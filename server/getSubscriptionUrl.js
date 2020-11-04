import {
  TRIAL_TIME,
  CHARGE_TIME,
  CHARGE_TITLE,
  PRICE,
  HOST,
  APP_NAME,
} from "../age-verification.config";
import axios from "axios";
import mongoose from "mongoose";
import "./models/shop";
import "./models/InstalledShop";

const Shop = mongoose.model("shops");
const InstalledShop = mongoose.model("installed_shops");

const _7daysMs = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
const TRIAL_END = new Date(_7daysMs).toISOString();

const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  const fetchedShop = await Shop.findOne({domain: shop})
  const fetchedInstalledShop = await InstalledShop.findOne({shop})

  if (!fetchedInstalledShop && !fetchedShop) return

  const {confirmation_url} = fetchedInstalledShop.data;

  if (!confirmation_url) {
    return ctx.redirect(confirmationUrl);
  }

  const postBody = {
    recurring_application_charge: {
      name: CHARGE_TITLE,
      price: PRICE,
      return_url: HOST,
      test: true,
      trial_days: TRIAL_TIME,
      trial_end_on: TRIAL_END,
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
  const status = responseJson.recurring_application_charge.status;

  await Shop.updateOne({ domain: shop }, { confirmation_url: confirmationUrl });
  await InstalledShop.updateOne({ shop }, { status });

  return ctx.redirect(confirmationUrl);
};

module.exports = getSubscriptionUrl;
