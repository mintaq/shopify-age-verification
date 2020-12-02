require("events").EventEmitter.defaultMaxListeners = 15;
require("isomorphic-fetch");
const axios = require("axios");
const ShopifyAPIClient = require("shopify-api-node");
const mysql = require("mysql");
const config = require("../age-verification.config");

/* CONFIG*/
const {
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

async function deleteOldScriptTag(shop, accessToken) {
  let shopify;
  let scriptTag;
  let scriptTag_id;
  let scriptTag_src;

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

  // FETCH SCRIPT-TAG LIST
  try {
    const scriptList = await shopify.scriptTag.list();

    if (Array.isArray(scriptList) && scriptList.length > 0) {
      console.log("shop & script list", scriptList);
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

  try {
    // DELETE SCRIPT TAG
    if (scriptTag_id && scriptTag_src) {
      await axios.delete(
        `https://${shop}/admin/api/2020-10/script_tags/${scriptTag_id}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`> ${shop}`);
    return;
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
        await deleteOldScriptTag(store_name, access_token);
        if (i == user_settings_arr.length - 1) {
          setTimeout(() => {
            console.log("Done!");
            process.exit(0);
          }, 5000);
        }
      }, i * 550);
    });
  }
})();
