import axios from "axios";
import ShopifyAPIClient from "shopify-api-node";

// const BASE_SCRIPT_URL =
//   "https://minhlocal.omegatheme.com/age-verification-omega/age-verfication-script-tag.js";

const BASE_SCRIPT_URL =
  "https://scrip-tag.000webhostapp.com/age-verfication-script-tag.js";

function getEleByIdUsingRegex(tag, id, html) {
  return new RegExp(
    "<" +
      tag +
      "[^>]*id[\\s]?=[\\s]?['\"]" +
      id +
      "['\"][\\s\\S]*?</" +
      tag +
      ">"
  ).exec(html);
}

export default async function updateScriptInTheme(domain, accessToken) {
  const shopify = new ShopifyAPIClient({
    shopName: domain,
    accessToken: accessToken,
  });

  // FETCH THEME LIST
  const themeList = await shopify.theme.list();
  let { id } = themeList.find((theme) => theme.role === "main");

  // GET layout/theme.liquid
  const layoutLiquidRes = await axios.get(
    `https://${domain}/admin/api/2020-10/themes/${id}/assets.json?asset[key]=layout/theme.liquid`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  // TODO: ADD UPDATE
  // CREATE
  let newLayoutLiquid = layoutLiquidRes.data.asset.value;
  if (!layoutLiquidRes.data.asset.value.includes("_otScriptTheme")) {
    const layoutLiquid = layoutLiquidRes.data.asset.value.split("</head>");
    newLayoutLiquid =
      layoutLiquid[0] +
      `<script type="text/javascript" id="_otScriptTheme" src="${BASE_SCRIPT_URL}?v=${Math.floor(
        Math.random() * 100000
      )}"></script>\n` +
      "</head>\n" +
      layoutLiquid[1];
  } else {
    let matchedScriptEle = getEleByIdUsingRegex(
      "script",
      "_otScriptTheme",
      newLayoutLiquid
    )[0];
    newLayoutLiquid = newLayoutLiquid.replace(
      matchedScriptEle + '\n',
      `<script type="text/javascript" id="_otScriptTheme" src="${BASE_SCRIPT_URL}?v=${Math.floor(
        Math.random() * 100000
      )}"></script>\n`
    );
  }

  // PUT NEW LAYOUT
  const axiosThemeRes = await axios.put(
    `https://${domain}/admin/api/2020-10/themes/${id}/assets.json`,
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
