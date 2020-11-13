import {
  TRIAL_TIME,
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


const _7daysMs = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
const TRIAL_END = new Date(_7daysMs).toISOString();

const acceptedCharge = async (ctx, accessToken, shop, charge_id) => {
  const userSettings = await getUserSettings(shop);
  const shopInstalled = await getShopInstalled(shop);

  if (!userSettings && !shopInstalled) return ctx.status = 404;

  const { confirmation_url } = userSettings;

  // if (confirmation_url) {
  //   return ctx.redirect(confirmation_url);
  // }

  // *** ACTIVATE CHARGE ***
  const postBody = {
    recurring_application_charge: {
      id: charge_id,
      name: CHARGE_TITLE,
      price: PRICE,
      status: "accepted",
      return_url: HOST,
      test: true,
      trial_days: TRIAL_TIME,
      decorated_return_url: HOST + `?charge_id=${charge_id}`,
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

  await updateUserSettings(shop, {
    status: 'active'
  })

  return ctx.redirect("/");
};

module.exports = acceptedCharge;
