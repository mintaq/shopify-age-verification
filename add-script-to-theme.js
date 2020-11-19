const axios = require("axios");
const ShopifyAPIClient = require("shopify-api-node");
// const { HOST } = require("./age-verification.config.js") ;
// const { getUserSettings } = require("./server/sql/sqlQueries.js") ;
const mysql = require("mysql");
const HOST = "https://minh.omegatheme.com";
const MYSQL_HOST = "192.168.11.128";
const MYSQL_USER = "minhtq";
const MYSQL_PWD = "password";
const MYSQL_DB = "shopify_minh";
const BASE_SCRIPT_URL = `${HOST}/age-verifier/age-verfication-script-tag.js`;

var mysqlLib = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PWD,
  database: MYSQL_DB,
  connectionLimit: 10,
});

function getUserSettings() {
  let query = `SELECT access_token, store_name FROM tbl_usersettings`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results);
      });
      connection.on("error", function (err) {
        console.log(err);
        reject(err);
        return;
      });
    });
  });
}

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

async function updateScriptInTheme(domain, accessToken) {
  const shopify = new ShopifyAPIClient({
    shopName: domain,
    accessToken: accessToken,
  });

  // FETCH THEME LIST
  const themeList = await shopify.theme.list();
  let { id } = themeList.find((theme) => theme.role == "main");

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

  // CREATE/UPDATE SCRIPT
  let newLayoutLiquid = layoutLiquidRes.data.asset.value;
  if (!layoutLiquidRes.data.asset.value.includes("_otScriptTheme")) {
    // IF SCRIPT IS NOT  -> CREATE
    const layoutLiquid = layoutLiquidRes.data.asset.value.split("</head>");
    newLayoutLiquid =
      layoutLiquid[0] +
      `<script type="text/javascript" id="_otScriptTheme" src="${BASE_SCRIPT_URL}?v=${Math.floor(
        Math.random() * 100000
      )}"></script>\n` +
      "</head>\n" +
      layoutLiquid[1];
  } else {
    // IF SCRIPT IS EXISTED -> UPDATE
    let matchedScriptEle = getEleByIdUsingRegex(
      "script",
      "_otScriptTheme",
      newLayoutLiquid
    )[0];
    newLayoutLiquid = newLayoutLiquid.replace(
      matchedScriptEle + "\n",
      `<script type="text/javascript" id="_otScriptTheme" src="${BASE_SCRIPT_URL}?v=${Math.floor(
        Math.random() * 100000
      )}"></script>\n`
    );
  }

  // PUT SCRIPT TO THEME
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

  console.log(axiosThemeRes.data);
}

(async function a() {
  const user_settings_arr = await getUserSettings();
  // console.log(user_settings_arr)
  await updateScriptInTheme(
    "bamboo-cycles.myshopify.com",
    "7fb07d8f20e5f3f6abc3d8ec307999b2"
  );
  // user_settings_arr.map(async ({access_token, store_name})=> {
  //   console.log(access_token)
  //   console.log(store_name)
  // })
})();
