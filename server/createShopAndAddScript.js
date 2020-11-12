import ShopifyAPIClient from "shopify-api-node";
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
} from "./services/defaultValues"

import "./models/shop";
import "./models/InstalledShop";

const Shop = mongoose.model("shops");
const InstalledShop = mongoose.model("installed_shops");

const createShopAndAddScript = async function (shopDomain, accessToken) {
  console.log(shopDomain);
  console.log(accessToken);

  // const fetchedShop = await Shop.findOne({ domain: shopDomain });
  // const fetchedInstalledShop = await InstalledShop.findOne({
  //   shop: shopDomain,
  // });
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

    // await insertShopInstalled({
    //   shop: shopDomain,
    //   date_installed: new Date().toISOString(),
    // });

    await insertTableRow("shop_installed", {
      shop: shopDomain,
      date_installed: cur_date_installed,
      app_id: 1,
    });
    await insertTableRow("age_verifier_settings", {
      shop: shopDomain,
      app_id: 1,
      themeId: theme_id + "",
      popupDisplaySelected: JSON.stringify(["home"]),
      custom_date: JSON.stringify(custom_date),
      overlayBgColor: JSON.stringify(overlayBgColor),
      submitBtnLabelColor: JSON.stringify(submitBtnLabelColor),
      cancelBtnLabelColor: JSON.stringify(cancelBtnLabelColor),
    });
    await insertTableRow("tbl_usersettings", {
      access_token: accessToken,
      store_name: shopDomain,
      app_id: 1,
      installed_date: cur_date_installed,
    });
    return;
  } else {
    // IF SHOP IS INSTALLED BEFORE
    // IF SHOP IS REINSTALL
    console.log("Shop existed!");
    if (!shopSettings && !userSettings) {
      await insertTableRow("age_verifier_settings", {
        shop: shopDomain,
        themeId: theme_id + "",
        popupDisplaySelected: JSON.stringify(["home"]),
        custom_date: JSON.stringify(custom_date),
        overlayBgColor: JSON.stringify(overlayBgColor),
        submitBtnLabelColor: JSON.stringify(submitBtnLabelColor),
        cancelBtnLabelColor: JSON.stringify(cancelBtnLabelColor),
      });
      await insertTableRow("tbl_usersettings", {
        access_token: accessToken,
        store_name: shopDomain,
        app_id: 1,
        installed_date: shopInstalled.date_installed,
      });
      return;
    }

    await updateTableRow(
      "age_verifier_settings",
      { themeId: theme_id + "" },
      { shop: shopDomain }
    );
    await updateTableRow(
      "tbl_usersettings",
      { access_token: accessToken },
      { store_name: shopDomain }
    );
    return;
  }

  // OLD
  // if (!fetchedShop) {
  //   const id = await updateScriptInTheme(shopDomain, accessToken);
  //   if (!fetchedInstalledShop) {
  //     const newInstalledShop = new InstalledShop({
  //       shop: shopDomain,
  //     });
  //     await newInstalledShop.save();
  //   }

  //   const newShop = new Shop({
  //     domain: shopDomain,
  //     accessToken,
  //     themeId: id,
  //   });

  //   const savedShop = await newShop.save();

  //   // console.log(typeof savedShop);
  //   return savedShop;
  // } else {
  //   console.log("Shop existed!");

  //   const id = await updateScriptInTheme(shopDomain, accessToken);

  //   // await updateUserSettings(shopDomain, { access_token: accessToken });
  //   const updatedShop = await Shop.updateOne(
  //     { domain: shopDomain },
  //     { themeId: id, accessToken }
  //   );
  //   return updatedShop;
  // }
};

module.exports = {
  createShopAndAddScript,
};
