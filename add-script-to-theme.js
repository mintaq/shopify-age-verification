require("events").EventEmitter.defaultMaxListeners = 15;
require("isomorphic-fetch");
const axios = require("axios");
const ShopifyAPIClient = require("shopify-api-node");
const mysql = require("mysql");
const { registerWebhook } = require("@shopify/koa-shopify-webhooks");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");
const config = require("./age-verification.config");

/* CONFIG*/
const {
  HOST,
  STATIC_FILE_FOLDER,
  MYSQL_HOST,
  MYSQL_DB,
  MYSQL_PWD,
  MYSQL_USER,
} = config;
/* END CONFIG */

const BASE_SCRIPT_URL = `${STATIC_FILE_FOLDER}age-verfication-script-tag.js`;

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

function updateTableRow(table, data, where) {
  const dataKeys = Object.keys(data);
  const whereKeys = Object.keys(where);
  let sql_Set = "";
  let sql_Where = "";
  let query = "";

  whereKeys.map((col, i) => {
    sql_Where += `${col} = "${where[col]}" ${
      i != whereKeys.length - 1 ? "AND " : ""
    }`;
  });

  for (let i = 0; i < dataKeys.length; i++) {
    let value = data[dataKeys[i]];
    let field = dataKeys[i];

    if (value == null) {
      sql_Set += `${field}=NULL`;
    } else if (
      field == "cancel_label" ||
      field == "headline_text" ||
      field == "subhead_text" ||
      field == "submit_label" ||
      field == "validate_error" ||
      field == "customcss" ||
      field == "exit_link"
    ) {
      sql_Set += `${field}="${value}"`;
    } else if (
      typeof value == "string" &&
      (value.includes("[") || value.includes("{"))
    ) {
      try {
        if (typeof JSON.parse(value) == "object") {
          value = value.replace("'", "''");
          sql_Set += `${field}='${value}'`;
        }
      } catch (e) {
        sql_Set += `${field}="${value}"`;
      }
    } else {
      sql_Set += `${field}="${value}"`;
    }

    sql_Set += i == dataKeys.length - 1 ? "" : ", ";
  }

  query = `UPDATE ${table} SET ${sql_Set} WHERE ${sql_Where}`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      if (err) {
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

async function updateScriptInTheme(shop, accessToken) {
  let shopify;

  if (!shop || !accessToken) {
    return;
  }

  try {
    shopify = new ShopifyAPIClient({
      shopName: shop,
      accessToken: accessToken,
    });
  } catch (err) {
    return;
  }

  // FETCH THEME LIST, SCRIPT-TAG LIST
  let theme;
  let theme_id;
  let scriptTag;
  let scriptTag_id;
  let scriptTag_src;

  try {
    const themeList = await shopify.theme.list();
    const scriptList = await shopify.scriptTag.list();

    theme = themeList.find((theme) => theme.role == "main");
    theme_id = theme.id;

    if (Array.isArray(scriptList) && scriptList.length > 0) {
      scriptTag = scriptList.find((scriptTag) =>
        scriptTag.src.includes("https://apps.omegatheme.com/age-verifier1/")
      );
      if (scriptTag) {
        scriptTag_id = scriptTag.id;
        scriptTag_src = scriptTag.src;
      }
    }
  } catch (err) {
    // console.log("err", err);
    return;
  }

  // GET layout/theme.liquid
  const layoutLiquidRes = await axios.get(
    `https://${shop}/admin/api/2020-10/themes/${theme_id}/assets.json?asset[key]=layout/theme.liquid`,
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
    // const layoutLiquid = layoutLiquidRes.data.asset.value.split("</head>");
    // newLayoutLiquid =
    //   layoutLiquid[0] +
    //   `<script type="text/javascript" id="_otScriptTheme" src="${BASE_SCRIPT_URL}?v=${Math.floor(
    //     Math.random() * 100000
    //   )}"></script>\n` +
    //   "</head>\n" +
    //   layoutLiquid[1];
  } else {
    // IF SCRIPT IS EXISTED -> UPDATE
    let matchedScriptEle = getEleByIdUsingRegex(
      "script",
      "_otScriptTheme",
      newLayoutLiquid
    )[0];
    newLayoutLiquid = newLayoutLiquid.replace(matchedScriptEle + "\n", ``);
  }

  // PUT/UPDATE SCRIPT TO THEME/SCRIPT-TAG, REGISTE WEBHOOKS
  try {
    // PUT SCRIPT TO THEME
    await axios.put(
      `https://${shop}/admin/api/2020-10/themes/${theme_id}/assets.json`,
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

    // UPDATE SCRIPT TAG
    if (scriptTag_id && scriptTag_src) {
      await axios.put(
        `https://${shop}/admin/api/2020-10/script_tags/${scriptTag_id}.json`,
        {
          script_tag: {
            id: scriptTag_id,
            src: scriptTag_src.replace(
              "https://apps.omegatheme.com/age-verifier1/",
              "https://apps.omegatheme.com/age-verifier/"
            ),
          },
        },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // REGISTER WEBHOOK
    // await registerWebhook({
    //   address: `${HOST}webhooks/app/uninstalled`,
    //   topic: "APP_UNINSTALLED",
    //   accessToken,
    //   shop,
    //   apiVersion: ApiVersion.April20,
    // });

    // await registerWebhook({
    //   address: `${HOST}webhooks/themes/update`,
    //   topic: "THEMES_UPDATE",
    //   accessToken,
    //   shop,
    //   apiVersion: ApiVersion.April20,
    // });

    const whlist = await axios.get(
      `https://${shop}/admin/api/2020-10/webhooks.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(whlist.data);
    const webhooklist = whlist.data.webhooks;
    let whIdArr = [];
    webhooklist.map((webhook) => {
      if (
        webhook.address.includes(
          "https://apps.omegatheme.com/age-verification/webhooks/"
        )
      ) {
        whIdArr.push(webhook.id);
      }
    });

    if (whIdArr.length > 0) {
      await axios.delete(
        `https://${shop}/admin/api/2020-10/webhooks/${whIdArr[0]}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      await axios.delete(
        `https://${shop}/admin/api/2020-10/webhooks/${whIdArr[1]}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // UPDATE THEME ID
    // await updateTableRow(
    //   "age_verifier_settings",
    //   { themeId: theme_id + "" },
    //   { shop }
    // );

    console.log(`> ${shop}`);
    return theme_id;
  } catch (err) {
    // console.log("err", err);
    return;
  }
}

(async function a() {
  console.log("Processing...");
  let user_settings_arr = await getUserSettings();

  if (user_settings_arr.length == 0) {
    console.log("No shop found!");
    process.exit(0);
  } else {
    user_settings_arr.map(async ({ access_token, store_name }, i) => {
      setTimeout(async () => {
        // console.log("#", i);
        await updateScriptInTheme(store_name, access_token);
        if (i == user_settings_arr.length - 1) {
          setTimeout(() => {
            console.log("Done!");
            process.exit(0);
          }, 5000);
        }
      }, i * 550);
    });
  }

  // console.log(promises);
})();
