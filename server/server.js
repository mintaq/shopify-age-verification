import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
// import shopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import {
  createShopifyAuth,
  verifyToken,
  getQueryKey,
  redirectQueryString,
} from "koa-shopify-auth-cookieless";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import { receiveWebhook, registerWebhook } from "@shopify/koa-shopify-webhooks";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import * as handlers from "./handlers/index";
import { createShopAndAddScript } from "./createShopAndAddScript";
import getSubscriptionUrl from "./getSubscriptionUrl";
import acceptedCharge from "./acceptedCharge";
import {
  getShopSettings,
  updateTableRow,
  getUserSettings,
  deleteTableRow,
} from "./sql/sqlQueries";
import uploadImageToAssets from "./services/uploadImageToAssets";
import updateScriptInTheme from "./services/updateScriptInTheme";

// CONFIG
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, HOST } = process.env;

// SERVER
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(cors());
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      prefix: "/age-verification",
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      accessMode: "offline",

      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.state.shopify;

        // CREATE/UPDATE SHOP AND ADD/UPDATE SCRIPT TO THEME
        await createShopAndAddScript(shop, accessToken);

        // REGISTER WEBHOOK
        await registerWebhook({
          address: `${HOST}webhooks/app/uninstalled`,
          topic: "APP_UNINSTALLED",
          accessToken,
          shop,
          apiVersion: ApiVersion.April20,
        });

        await registerWebhook({
          address: `${HOST}webhooks/themes/update`,
          topic: "THEMES_UPDATE",
          accessToken,
          shop,
          apiVersion: ApiVersion.April20,
        });

        // CHECK CHARGE AND REDIRECT
        await getSubscriptionUrl(ctx, accessToken, shop);
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.April20,
    })
  );
  server.use(bodyParser({ jsonLimit: "10mb" }));
  // server.use(async (ctx) => {
  //   ctx.body = ctx.request.body;
  // });

  // ROUTES
  router.get("/age-verification/", async (ctx, next) => {
    if (
      ctx.query.hmac &&
      ctx.query.shop &&
      ctx.query.timestamp &&
      (!ctx.query.locale ||
        !ctx.query.new_design_language ||
        !ctx.query.session)
    ) {
      ctx.redirect(
        `${HOST}auth?hmac=${ctx.query.hmac}&shop=${ctx.query.shop}&timestamp=${ctx.query.timestamp}`
      );
    } else {
      next();
    }
  });

  router.get("/age-verification/api/shops/settings/:shop", async (ctx) => {
    try {
      const res = await getShopSettings(ctx.params.shop);
      if (!res) {
        return (ctx.status = 204);
      }
      ctx.body = res;
    } catch (err) {
      console.log(err);
      return (ctx.status = 404);
    }
  });

  router.get(
    "/age-verification/api/shops/public/user-settings/:shop",
    async (ctx) => {
      try {
        const res = await getUserSettings(ctx.params.shop);
        if (!res) {
          return (ctx.status = 204);
        }
        const res_body = {
          installed_date: res.installed_date,
          status: res.status,
        };
        ctx.body = res_body;
      } catch (err) {
        console.log(err);
        return (ctx.status = 404);
      }
    }
  );

  // AUTH ROUTES
  router.put("/age-verification/api/shops/upload_img/:shop", async (ctx) => {
    const { image_data } = ctx.request.body;

    try {
      const userSettings = await getUserSettings(ctx.params.shop);
      const { access_token } = userSettings;
      await uploadImageToAssets(ctx.params.shop, access_token, image_data);

      ctx.status = 200;
    } catch (err) {
      console.log(err);
      ctx.status = 400;
    }
  });

  router.get("/age-verification/api/shops/user-settings/:shop", async (ctx) => {
    try {
      const res = await getUserSettings(ctx.params.shop);
      if (!res) {
        return (ctx.status = 204);
      }
      ctx.body = res;
    } catch (err) {
      console.log(err);
      return (ctx.status = 404);
    }
  });

  router.put("/age-verification/api/shops/:shop", async (ctx, next) => {
    try {
      await updateTableRow("age_verifier_settings", ctx.request.body, {
        shop: ctx.params.shop,
      });
      ctx.res.statusCode = 200;
    } catch (err) {
      console.log(err);
      ctx.status = 400;
    }
  });

  // END AUTH ROUTES

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET });

  router.post(
    "/age-verification/webhooks/app/uninstalled",
    webhook,
    async (ctx) => {
      const cur_date = new Date();
      const cur_date_uninstalled =
        cur_date.toISOString().split("T")[0] +
        " " +
        cur_date.toTimeString().split(" ")[0];

      const { payload } = ctx.state.webhook;
      try {
        await deleteTableRow("age_verifier_settings", { shop: payload.domain });
        await deleteTableRow("tbl_usersettings", {
          store_name: payload.domain,
          app_id: 27,
        });
        await updateTableRow(
          "shop_installed",
          { date_uninstalled: cur_date_uninstalled },
          { shop: payload.domain, app_id: 27 }
        );
        ctx.status = 200;
      } catch (err) {
        console.log(err);
        ctx.status = 400;
      }
    }
  );

  router.post(
    "/age-verification/webhooks/themes/update",
    webhook,
    async (ctx) => {
      const { domain } = ctx.state.webhook;
      try {
        const userSettings = await getUserSettings(domain);
        if (!userSettings) return (ctx.status = 404);
        const { store_name, access_token } = userSettings;
        const theme_id = await updateScriptInTheme(store_name, access_token);
        await updateTableRow(
          "age_verifier_settings",
          { themeId: theme_id + "" },
          { shop: domain }
        );
        ctx.status = 200;
      } catch (err) {
        console.log(err);
        ctx.status = 400;
      }
    }
  );

  router.get("/age-verification/activate-charge/:shop", async (ctx) => {
    try {
      const userSettings = await getUserSettings(ctx.params.shop);
      const { access_token, store_name } = userSettings;
      await acceptedCharge(ctx, access_token, store_name, ctx.query.charge_id);
      ctx.status = 200;
    } catch (err) {
      console.log(err);
      ctx.status = 500;
    }
  });

  router.get("/age-verification/check-charge/:shop", async (ctx) => {
    try {
      const userSettings = await getUserSettings(ctx.params.shop);
      const { access_token, store_name } = userSettings;
      await getSubscriptionUrl(ctx, access_token, store_name);
    } catch (err) {
      console.log(err);
      ctx.status = 500;
    }
  });

  router.get("(.*)", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
