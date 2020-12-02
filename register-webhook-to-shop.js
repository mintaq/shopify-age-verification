require("events").EventEmitter.defaultMaxListeners = 15;
require("isomorphic-fetch");
const axios = require("axios");
const mysql = require("mysql");
const { registerWebhook } = require("@shopify/koa-shopify-webhooks");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");
const config = require("./age-verification.config");

/* CONFIG*/
const { HOST, MYSQL_HOST, MYSQL_DB, MYSQL_PWD, MYSQL_USER } = config;
/* END CONFIG */

var mysqlLib = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PWD,
  database: MYSQL_DB,
  connectionLimit: 10,
});

function getUserSettings() {
  let query = `SELECT access_token, store_name FROM tbl_usersettings WHERE app_id = '27' AND status = 'active'`;

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

async function registerWebhookToShop(shop, accessToken) {
  if (!shop || !accessToken) {
    return;
  }

  // REGISTE WEBHOOKS
  try {
    await registerWebhook({
      address: `${HOST}webhooks/app/uninstalled`,
      topic: "APP_UNINSTALLED",
      accessToken,
      shop,
      apiVersion: ApiVersion.April20,
    });

    await registerWebhook({
      address: `${HOST}webhooks/themes/update`,
      topic: "THEMES_UPDATE",
      accessToken,
      shop,
      apiVersion: ApiVersion.April20,
    });

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
        await registerWebhookToShop(store_name, access_token);
        if (i == user_settings_arr.length - 1) {
          setTimeout(() => {
            console.log("Done!");
            process.exit(0);
          }, 5000);
        }
      }, i * 200);
    });
  }
})();
