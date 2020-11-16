import { registerWebhook } from "@shopify/koa-shopify-webhooks";

export const registerWebhooks = async (
  shop,
  accessToken,
  type,
  url,
  apiVersion
) => {
  const registration = await registerWebhook({
    address: `${process.env.HOST}${url}`,
    topic: type,
    accessToken,
    shop,
    apiVersion,
  });
};
