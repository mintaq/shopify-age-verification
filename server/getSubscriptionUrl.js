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
import {
  getUserSettings,
  getShopInstalled,
  updateUserSettings,
} from "./sql/sqlQueries";

const Shop = mongoose.model("shops");
const InstalledShop = mongoose.model("installed_shops");

const _7daysMs = 7 * 24 * 60 * 60 * 1000;
const nowMs = new Date().getTime();
// const _isOnTrial =

const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  // const fetchedShop = await Shop.findOne({ domain: shop });
  // const fetchedInstalledShop = await InstalledShop.findOne({ shop });
  // if (!fetchedInstalledShop && !fetchedShop) return;

  // const {confirmation_url} = fetchedInstalledShop;

  const userSettings = await getUserSettings(shop)[0];
  const shopInstalled = await getShopInstalled(shop)[0];

  if (!userSettings || !shopInstalled) return;

  const { confirmation_url, status } = userSettings;
  const { date_installed } = shopInstalled;
  const _isOnTrial =
    nowMs - new Date(date_installed).getTime() < _7daysMs ? true : false;

  if (confirmation_url && !_isOnTrial) return ctx.redirect(confirmation_url);

  if (_isOnTrial || status === 'active') return ctx.redirect("/");

  const postBody = {
    recurring_application_charge: {
      name: CHARGE_TITLE,
      price: PRICE,
      return_url: HOST,
      test: true,
      trial_days: TRIAL_TIME,
    },
  };

  // CREATE NEW CHARGE
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
  const res_confirmation_url =
    responseJson.recurring_application_charge.confirmation_url;
  const res_status = responseJson.recurring_application_charge.status;

  // TODO: update mysql: confirmation_url, shop status
  // await Shop.updateOne({ domain: shop }, { confirmation_url: confirmationUrl });
  // await InstalledShop.updateOne({ shop }, { status });

  await updateUserSettings(shop, {
    confirmation_url: res_confirmation_url,
    status: res_status,
  });

  return ctx.redirect(confirmationUrl);
};

module.exports = getSubscriptionUrl;
