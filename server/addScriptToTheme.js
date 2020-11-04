import ShopifyAPIClient from "shopify-api-node";
import axios from "axios";
import mongoose from "mongoose";
import updateScriptInTheme from "./services/updateScriptInTheme";

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
  if (!fetchedShop) {
    const id = await updateScriptInTheme(shopDomain, accessToken);
    if (!fetchedInstalledShop) {
      const newInstalledShop = new InstalledShop({
        shop: shopDomain,
      });
      await newInstalledShop.save();
    }

    const newShop = new Shop({
      domain: shopDomain,
      accessToken,
      themeId: id,
    });

    const savedShop = await newShop.save();

    // console.log(typeof savedShop);
    return savedShop;
  } else {
    console.log("Shop existed!");

    const id = await updateScriptInTheme(shopDomain, accessToken);

    const updatedShop = await Shop.updateOne(
      { domain: shopDomain },
      { themeId: id, accessToken }
    );
    return updatedShop;
  }
};

module.exports = {
  createShopAndAddScript,
};
