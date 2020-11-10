import ShopifyAPIClient from "shopify-api-node";
import axios from "axios";
import mongoose from "mongoose";
import updateScriptInTheme from "./services/updateScriptInTheme";
import {
  getShopInstalled,
  insertShopInstalled,
  updateUserSettings,
  insertTableRow,
  updateTableRow,
} from "./sql/sqlQueries";

import "./models/shop";
import "./models/InstalledShop";

const Shop = mongoose.model("shops");
const InstalledShop = mongoose.model("installed_shops");

const createShopAndAddScript = async function (shopDomain, accessToken) {
  console.log(shopDomain);
  console.log(accessToken);

  const fetchedShop = await Shop.findOne({ domain: shopDomain });
  const fetchedInstalledShop = await InstalledShop.findOne({
    shop: shopDomain,
  });
  const shopInstalled = await getShopInstalled(shopDomain);
  const id = await updateScriptInTheme(shopDomain, accessToken);
  console.log(shopInstalled);

  // NEW
  if (!shopInstalled) {
    // await insertShopInstalled({
    //   shop: shopDomain,
    //   date_installed: new Date().toISOString(),
    // });
    await insertTableRow("shop_installed", {
      shop: shopDomain,
      date_installed: new Date().toISOString(),
    });
    await insertTableRow("age_verifier_settings", {
      shop: shopDomain,
      date_installed: new Date().toISOString(),
      themeId: id,
    });
    return;
  } else {
    const overlayColor = { r: 31, g: 26, b: 26, a: 1 };
    console.log("Shop existed!");
    await updateTableRow(
      "age_verifier_settings",
      { themeId: id, overlayBgColor: JSON.stringify(overlayColor) },
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
