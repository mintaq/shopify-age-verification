import axios from "axios";
import mongoose from "mongoose";
import updateScriptInTheme from "./services/updateScriptInTheme";
import {
  getShopInstalled,
  getUserSettings,
  getShopSettings,
  insertTableRow,
  updateTableRow,
} from "./sql/sqlQueries";
import {
  submitBtnLabelColor,
  cancelBtnLabelColor,
  overlayBgColor,
  custom_date,
} from "./services/defaultValues";

const createShopAndAddScript = async function (shopDomain, accessToken) {
  const shopInstalled = await getShopInstalled(shopDomain);
  const shopSettings = await getShopSettings(shopDomain);
  const userSettings = await getUserSettings(shopDomain);
  const theme_id = await updateScriptInTheme(shopDomain, accessToken);
  const cur_date = new Date();
  const cur_date_installed =
    cur_date.toISOString().split("T")[0] +
    " " +
    cur_date.toTimeString().split(" ")[0];

  // NEW
  if (!shopInstalled) {
    // IF SHOP IS NOT INSTALLED

    try {
      await insertTableRow("shop_installed", {
        shop: shopDomain,
        date_installed: cur_date_installed,
        app_id: 27,
      });
      await insertTableRow("age_verifier_settings", {
        shop: shopDomain,
        themeId: theme_id + "",
        popupDisplaySelected: JSON.stringify(["home"]),
        blockProducts: JSON.stringify([]),
        custom_date: JSON.stringify(custom_date),
        overlayBgColor: JSON.stringify(overlayBgColor),
        submitBtnLabelColor: JSON.stringify(submitBtnLabelColor),
        cancelBtnLabelColor: JSON.stringify(cancelBtnLabelColor),
      });
      await insertTableRow("tbl_usersettings", {
        access_token: accessToken,
        store_name: shopDomain,
        app_id: 27,
        installed_date: cur_date_installed,
      });
    } catch (err) {
      return;
    }

    return;
  } else {
    // IF SHOP IS INSTALLED BEFORE
    // IF SHOP IS REINSTALL
    if (!shopSettings && !userSettings) {
      try {
        await insertTableRow("age_verifier_settings", {
          shop: shopDomain,
          themeId: theme_id + "",
          popupDisplaySelected: JSON.stringify(["home"]),
          blockProducts: JSON.stringify([]),
          custom_date: JSON.stringify(custom_date),
          overlayBgColor: JSON.stringify(overlayBgColor),
          submitBtnLabelColor: JSON.stringify(submitBtnLabelColor),
          cancelBtnLabelColor: JSON.stringify(cancelBtnLabelColor),
        });
        await insertTableRow("tbl_usersettings", {
          access_token: accessToken,
          store_name: shopDomain,
          app_id: 27,
          installed_date: shopInstalled.date_installed,
        });
        return;
      } catch (err) {
        return;
      }
    }

    try {
      await updateTableRow(
        "age_verifier_settings",
        { themeId: theme_id + "" },
        { shop: shopDomain }
      );
      await updateTableRow(
        "tbl_usersettings",
        { access_token: accessToken },
        { store_name: shopDomain, app_id: 27 }
      );
      return;
    } catch (err) {
      return;
    }
  }
};

module.exports = {
  createShopAndAddScript,
};
