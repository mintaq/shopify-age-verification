import ShopifyAPIClient from "shopify-api-node";
import axios from "axios";
import mongoose from "mongoose";
import "./models/shop";
import updateScriptInTheme from "./services/updateScriptInTheme";

const Shop = mongoose.model("shops");

const createShopAndAddScript = async function (shopDomain, accessToken) {
  console.log(shopDomain);
  console.log(accessToken);

  const fetchedShop = await Shop.findOne({ domain: shopDomain });
  if (!fetchedShop) {
    const id = await updateScriptInTheme(shopDomain, accessToken);

    const newShop = new Shop({
      domain: shopDomain,
      accessToken,
      themeId: id,
    });
    newShop.save();
  } else {
    console.log("Shop existed!");

    const id = await updateScriptInTheme(shopDomain, accessToken);

    await Shop.updateOne({ domain: shopDomain }, { themeId: id, accessToken });
    return;
  }
};

module.exports = {
  createShopAndAddScript,
};
