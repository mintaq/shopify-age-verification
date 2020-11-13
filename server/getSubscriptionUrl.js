import {
  CHARGE_TIME,
  CHARGE_TITLE,
  PRICE,
  HOST,
  APP_NAME,
} from "../age-verification.config";
import axios from "axios";
import {
  getUserSettings,
  getShopInstalled,
  updateUserSettings,
} from "./sql/sqlQueries";

const _7daysMs = 7 * 24 * 60 * 60 * 1000;
const nowMs = new Date().getTime();

const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  const userSettings = await getUserSettings(shop);
  const shopInstalled = await getShopInstalled(shop);
  let TRIAL_TIME;
  let confirmation_url, status;

  if (!shopInstalled) return (ctx.status = 404);
  if (userSettings) {
    confirmation_url = userSettings.confirmation_url;
    status = userSettings.status;
  }

  // *** CHECK CHARGE ***
  const { date_installed, date_uninstalled } = shopInstalled;
  const _isOnTrial =
    nowMs - new Date(date_installed).getTime() < _7daysMs ? true : false;

  // IF SHOP IS NOT ACTIVE && NOT ON TRIAL TIME && NOT UNINSTALLED -> REDIRECT TO confirmation_url
  if (confirmation_url && !_isOnTrial && status != "active") {
    if (
      new Date(date_installed).getTime() >= new Date("2020-11-13").getTime()
    ) {
      return ctx.redirect(confirmation_url);
    } else {
      const charge_id = confirmation_url.split("charges/")[1].split("/")[0];
      console.log("charge_id", charge_id);
      await fetch(
        `https://${shop}/admin/api/2020-10/recurring_application_charges/${charge_id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
        }
      );
    }
  }

  // IF SHOP IS ACTIVE OR ON TRIAL TIME -> REDIRECT TO HOME
  if (
    (_isOnTrial || status == "active") &&
    (date_uninstalled == null || date_uninstalled == "") &&
    confirmation_url
  ) {
    return ctx.redirect("/");
  }

  // IF SHOP IS JUST INSTALLED -> CREATE NEW CHARGE
  // IF SHOP IS REINSTALLED -> CHECK TRIAL TIME
  if (date_uninstalled == null || date_uninstalled == "") {
    TRIAL_TIME = 7;
  } else {
    const install_date_ms = new Date(date_installed).getTime();
    const uninstall_date_ms = new Date(date_uninstalled).getTime();
    const end_trial_date_ms = install_date_ms + _7daysMs;
    let remain_trial_time;
    if (uninstall_date_ms < end_trial_date_ms) {
      remain_trial_time =
        (end_trial_date_ms - uninstall_date_ms) / 1000 / 60 / 60 / 24;
    } else remain_trial_time = 0;
    TRIAL_TIME = Number.parseInt(remain_trial_time + "");
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
  const res_confirmation_url =
    responseJson.recurring_application_charge.confirmation_url;
  const res_status = responseJson.recurring_application_charge.status;

  // TODO: update mysql: confirmation_url, shop status

  await updateUserSettings(shop, {
    confirmation_url: res_confirmation_url,
    status: res_status,
  });

  return ctx.redirect(res_confirmation_url);
};

module.exports = getSubscriptionUrl;
