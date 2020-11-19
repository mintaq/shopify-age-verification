import {
  TRIAL_TIME,
  CHARGE_TIME,
  CHARGE_TITLE,
  PRICE,
  RETURN_URL,
  APP_NAME,
} from "../age-verification.config";
import axios from "axios";
import {
  getUserSettings,
  getShopInstalled,
  updateUserSettings,
} from "./sql/sqlQueries";

const _7daysMs = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
const TRIAL_END = new Date(_7daysMs).toISOString();

const acceptedCharge = async (ctx, accessToken, shop, charge_id) => {
  const userSettings = await getUserSettings(shop);
  const shopInstalled = await getShopInstalled(shop);

  if (!userSettings && !shopInstalled) return (ctx.status = 404);

  // if (userSettings.confirmation_url) {
  //   return ctx.redirect(userSettings.confirmation_url);
  // }

  // *** ACTIVATE CHARGE ***
  const postBody = {
    recurring_application_charge: {
      id: charge_id,
      name: CHARGE_TITLE,
      price: PRICE,
      status: "accepted",
      return_url: RETURN_URL + `/${userSettings.store_name}`,
      test: true,
      decorated_return_url:
        RETURN_URL + `/${userSettings.store_name}?charge_id=${charge_id}`,
    },
  };

  const response = await fetch(
    `https://${shop}/admin/api/2020-10/recurring_application_charges/${charge_id}/activate.json`,
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

  try {
    await updateUserSettings(shop, {
      status: "active",
    });
  } catch (err) {
    return (ctx.status = 500);
  }

  return ctx.redirect(`https://${shop}/admin/apps/${APP_NAME}`);
};

module.exports = acceptedCharge;
