import {
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

const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  // const fetchedShop = await Shop.findOne({ domain: shop });
  // const fetchedInstalledShop = await InstalledShop.findOne({ shop });
  // if (!fetchedInstalledShop && !fetchedShop) return;

  // const {confirmation_url} = fetchedInstalledShop;

  const userSettings = await getUserSettings(shop);
  const shopInstalled = await getShopInstalled(shop);
  let TRIAL_TIME;
  let confirmation_url, status;

  if (!shopInstalled) return (ctx.status = 404);
  if (userSettings) {
    console.log(userSettings);
    confirmation_url = userSettings.confirmation_url;
    status = userSettings.status;
  }

  // *** CHECK CHARGE ***
  const { date_installed, date_uninstalled } = shopInstalled;
  console.log("shop installed", shopInstalled);
  const _isOnTrial =
    nowMs - new Date(date_installed).getTime() < _7daysMs ? true : false;

  // IF SHOP IS NOT ACTIVE AND NOT ON TRIAL TIME -> REDIRECT TO confirmation_url
  if (confirmation_url && !_isOnTrial && status != "active")
    return ctx.redirect(confirmation_url);

  console.log("date_uninstall", date_uninstalled == null || "");
  console.log("trial", _isOnTrial);

  // IF SHOP IS ACTIVE OR ON TRIAL TIME -> REDIRECT TO HOME
  if (
    (_isOnTrial || status == "active") &&
    (date_uninstalled == null || date_uninstalled == "")
  ) {
    console.log("to home");
    return ctx.redirect("/");
  }
  // IF SHOP IS JUST INSTALLED -> CREATE NEW CHARGE
  // IF SHOP IS REINSTALLED -> CHECK TRIAL TIME
  if (date_uninstalled == null || "") {
    TRIAL_TIME = 7;
  } else {
    const install_date_ms = new Date(date_installed).getTime();
    const uninstall_date_ms = new Date(date_uninstalled).getTime();
    TRIAL_TIME = Math.floor(
      (uninstall_date_ms - install_date_ms) / 1000 / 60 / 60 / 24
    );
  }

  const postBody = {
    recurring_application_charge: {
      name: CHARGE_TITLE,
      price: PRICE,
      return_url: HOST,
      test: true,
      trial_days: Number.parseInt(TRIAL_TIME),
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

  return ctx.redirect(res_confirmation_url);
};

module.exports = getSubscriptionUrl;
