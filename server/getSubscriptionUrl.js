import {
  TRIAL_TIME,
  CHARGE_TIME,
  CHARGE_TITLE,
  PRICE,
  HOST,
  APP_NAME,
} from "../age-verification.config";
import mongoose from "mongoose";
import "./models/shop";
import axios from "axios";

const Shop = mongoose.model("shops");

const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  const postBody = {
    recurring_application_charge: {
      name: CHARGE_TITLE,
      price: PRICE,
      return_url: HOST,
      test: true,
      trial_days: TRIAL_TIME,
    },
  };

  const response = await fetch(
    `https://${shop}/admin/api/2020-10/recurring_application_charges.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify(postBody),
    }
  );

  const responseJson = await response.json();
  console.log(responseJson);
  const confirmationUrl =
    responseJson.recurring_application_charge.confirmation_url;

  await Shop.updateOne({ domain: shop }, { confirmation_url: confirmationUrl });

  return ctx.redirect(confirmationUrl);
};

module.exports = getSubscriptionUrl;
