import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import { receiveWebhook, registerWebhook } from "@shopify/koa-shopify-webhooks";
import Koa from "koa";
import mongoose from "mongoose";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { clearCookie, setCookie } from "koa-cookies";
import * as handlers from "./handlers/index";
import { createShopAndAddScript } from "./createShopAndAddScript";
// import resizeImage from "./siervices/resizeImage";
import getSubscriptionUrl from "./getSubscriptionUrl";
import acceptedCharge from "./acceptedCharge";
import axios from "axios";
import {
  getShopSettings,
  updateTableRow,
  getUserSettings,
  deleteTableRow,
} from "./sql/sqlQueries";
import uploadImageToAssets from "./services/uploadImageToAssets";

// CONFIG
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const {
  SHOPIFY_API_SECRET,
  SHOPIFY_API_KEY,
  SCOPES,
  MONGODB_URI,
  HOST,
  API_VERSION,
} = process.env;

// MONGODB
const options = {
  useMongoClient: true,
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
};
// mongoose
//   .connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     console.log("connected to mongoDB");
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });

// import "./models/shop";
// import "./models/InstalledShop";

// const Shop = mongoose.model("shops");
// const InstalledShop = mongoose.model("installed_shops");

// SERVER
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(cors());
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;

        // CREATE/UPDATE SHOP AND ADD/UPDATE SCRIPT TO THEME
        await createShopAndAddScript(shop, accessToken);

        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        // REGISTER WEBHOOK
        const registration = await registerWebhook({
          address: `${HOST}/webhooks/app/uninstalled`,
          topic: "APP_UNINSTALLED",
          accessToken,
          shop,
          apiVersion: ApiVersion.October19,
        });

        if (registration.success) {
          console.log("Successfully registered webhook!");
        } else {
          console.log("Failed to register webhook", registration.result);
        }

        // CHECK CHARGE AND REDIRECT
        await getSubscriptionUrl(ctx, accessToken, shop);
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  server.use(bodyParser({ jsonLimit: "10mb" }));
  // server.use(async (ctx) => {
  //   ctx.body = ctx.request.body;
  // });

  // ROUTES
  router.get("/api/shops/settings/:domain", async (ctx) => {
    const res = await getShopSettings(ctx.params.domain);
    if (!res) return (ctx.status = 404);

    ctx.body = res;
  });

  router.get("/api/shops/public/user_settings/:domain", async (ctx) => {
    const res = await getUserSettings(ctx.params.domain);
    if (!res) return (ctx.status = 404);
    const res_body = {
      installed_date: res.installed_date,
      status: res.status,
    };

    ctx.body = res_body;
  });

  router.put("/api/shops/upload_img/:domain", verifyRequest(), async (ctx) => {
    const { image_data, themeId } = ctx.request.body;

    const res__image_data = await uploadImageToAssets(
      ctx.params.domain,
      ctx.session.accessToken,
      themeId,
      image_data
    );

    console.log(res__image_data);
    ctx.status = 200;
  });

  router.get(
    "/api/shops/user_settings/:domain",
    verifyRequest(),
    async (ctx) => {
      const res = await getUserSettings(ctx.params.domain);
      if (!res) return (ctx.status = 404);

      ctx.body = res;
    }
  );

  router.put("/api/shops/:domain", verifyRequest(), async (ctx, next) => {
    await updateTableRow("age_verifier_settings", ctx.request.body, {
      shop: ctx.params.domain,
    });

    ctx.res.statusCode = 200;
  });

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET });

  router.post("/webhooks/app/uninstalled", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook);
    const cur_date = new Date();
    const cur_date_uninstalled =
      cur_date.toISOString().split("T")[0] +
      " " +
      cur_date.toTimeString().split(" ")[0];

    const { payload } = ctx.state.webhook;
    await deleteTableRow("age_verifier_settings", { shop: payload.domain });
    await deleteTableRow("tbl_usersettings", { store_name: payload.domain });
    await updateTableRow(
      "shop_installed",
      { date_uninstalled: cur_date_uninstalled },
      { shop: payload.domain }
    );
  });

  router.get("/check_charge", async (ctx) => {
    const { shop, accessToken } = ctx.session;

    await acceptedCharge(ctx, accessToken, shop, ctx.query.charge_id);
  });

  router.get("(.*)", verifyRequest(), async (ctx) => {
    console.log(ctx.host);
    console.log("cookie: ", ctx.cookies.get("shopOrigin"));
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

//ALTER TABLE `age_verifier_settings` ADD `popupBgColor` TEXT NOT NULL AFTER `overlayBgColor`;
