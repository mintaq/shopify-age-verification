import axios from "axios";
import ShopifyAPIClient from "shopify-api-node";

// const BASE_SCRIPT_URL =
//   "https://minhlocal.omegatheme.com/age-verification-omega/age-verfication-script-tag.js";

const BASE_SCRIPT_URL =
  "https://scrip-tag.000webhostapp.com/age-verfication-script-tag.js";

export default async function updateScriptInTheme(
  domain,
  themeId,
  accessToken
) {
  const shopify = new ShopifyAPIClient({
    shopName: domain,
    accessToken: accessToken,
  });

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
    `<script type="text/javascript" async="" src="${BASE_SCRIPT_URL}?v=${Math.floor(
      Math.random() * 100000
    )}"></script>\n` +
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

  return axiosThemeRes.data.asset.theme_id;
}
