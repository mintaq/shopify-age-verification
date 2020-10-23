import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import mongoose from "mongoose";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import * as handlers from "./handlers/index";
import { createShopAndScriptTag } from "./addScriptTag";
import ShopifyAPIClient from "shopify-api-node";

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
} = process.env;

// MONGODB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
import "./models/shop";
const Shop = mongoose.model("shops");

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
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        process.env.ACCESS_TOKEN = accessToken;

        createShopAndScriptTag(shop, accessToken);
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  server.use(bodyParser());
  // server.use(async (ctx) => {
  //   ctx.body = ctx.request.body;
  // });

  // ROUTES
  router.get("/api/shops/:domain", async (ctx, next) => {
    const shop = await Shop.findOne({ domain: ctx.params.domain });
    if (!shop) {
      return (ctx.status = 404);
    }

    return (ctx.body = shop);
  });
  router.get("/api/products/:domain", async (ctx) => {
    const shop = await Shop.findOne({ domain: ctx.params.domain });
    if (!shop) {
      return (ctx.status = 404);
    }

    const shopifyClient = new ShopifyAPIClient({
      shopName: shop.domain,
      accessToken: shop.accessToken,
    });

    const products = await shopifyClient.product.list();
    console.log(products);

    return (ctx.body = products);
  });
  router.put("/api/shops/:domain", verifyRequest(), async (ctx, next) => {
    const res = await Shop.updateOne(
      { domain: ctx.params.domain },
      ctx.request.body
    );
    ctx.res.statusCode = 200;
  });
  router.get("(.*)", verifyRequest(), async (ctx) => {
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
