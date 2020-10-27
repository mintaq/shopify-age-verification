import ShopifyAPIClient from "shopify-api-node";
import axios from "axios";
import mongoose from "mongoose";
import "./models/shop";

const Shop = mongoose.model("shops");

// const BASE_SCRIPT_URL =
//   "https://minhlocal.omegatheme.com/age-verification-omega/age-verfication-script-tag.js";

const BASE_SCRIPT_URL =
  "https://scrip-tag.000webhostapp.com/age-verfication-script-tag.js";

const createShopAndAddScript = async function (shopDomain, accessToken) {
  console.log(shopDomain);
  console.log(accessToken);
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  });

  const fetchedShop = await Shop.findOne({ domain: shopDomain });
  if (!fetchedShop) {
    // const newScriptTag = await shopify.scriptTag.create({
    //   event: "onload",
    //   src: BASE_SCRIPT_URL,
    // });

    const testTheme = await shopify.theme.list();
    console.log(testTheme);
    let { id } = testTheme.find((theme) => theme.role === "main");
    const updatedThemeId = await shopify.asset.update(id, {
      key: "layout/theme.liquid",
      value: `<script type="text/javascript" async="" src="https://scrip-tag.000webhostapp.com/age-verfication-script-tag.js?v=1234"></script>`,
    });

    const newShop = new Shop({
      domain: shopDomain,
      accessToken,
      themeId: id,
    });
    newShop.save();
  } else {
    // console.log(process.env.ACCESS_TOKEN)
    console.log("Shop existed!");

    const testTheme = await shopify.theme.list();
    let { id } = testTheme.find((theme) => theme.role === "main");

    const layoutLiquidRes = await axios.get(
      `https://${fetchedShop.domain}/admin/api/2020-10/themes/${id}/assets.json?asset[key]=layout/theme.liquid`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const layoutLiquid = layoutLiquidRes.data.asset.value.split("</head>");
    const newLayoutLiquid =
      layoutLiquid[0] +
      `<script type="text/javascript" async="" src="https://scrip-tag.000webhostapp.com/age-verfication-script-tag.js?v=1234"></script>\n` +
      "</head>\n" +
      layoutLiquid[1];

    const axiosThemeRes = await axios.put(
      `https://${fetchedShop.domain}/admin/api/2020-10/themes/${id}/assets.json`,
      {
        asset: {
          key: "layout/theme.liquid",
          value: newLayoutLiquid,
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(axiosThemeRes);

    // const updatedSriptTag = await shopify.scriptTag.update(
    //   fetchedShop.scriptTagId,
    //   {
    //     src: `${BASE_SCRIPT_URL}?v=${Math.floor(Math.random() * 100000)}`,
    //   }
    // );

    await Shop.updateOne({ domain: shopDomain }, { themeId: id, accessToken });
    return;
  }
};

module.exports = {
  createShopAndAddScript,
};
