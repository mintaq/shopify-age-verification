import { APP_NAME } from "../age-verification.config";
import {
  getUserSettings,
  getShopInstalled,
  updateUserSettings,
} from "./sql/sqlQueries";

const acceptedCharge = async (ctx, accessToken, shop, charge_id) => {
  const userSettings = await getUserSettings(shop);
  const shopInstalled = await getShopInstalled(shop);

  if (!userSettings && !shopInstalled) return (ctx.status = 404);

  // *** ACTIVATE CHARGE ***
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
