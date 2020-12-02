require("events").EventEmitter.defaultMaxListeners = 15;
require("isomorphic-fetch");
const axios = require("axios");
const mysql = require("mysql");
const config = require("../age-verification.config");

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

async function deleteWebhook(shop, accessToken) {
  if (!shop || !accessToken) {
    return;
  }

  // DELTE WEBHOOKS
  try {
    const whlist = await axios.get(
      `https://${shop}/admin/api/2020-10/webhooks.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

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
      whIdArr.map(async (id) => {
        await axios.delete(
          `https://${shop}/admin/api/2020-10/webhooks/${id}.json`,
          {
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
          }
        );
      });
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
        await deleteWebhook(store_name, access_token);
        if (i == user_settings_arr.length - 1) {
          setTimeout(() => {
            console.log("Done!");
            process.exit(0);
          }, 2500);
        }
      }, i * 550);
    });
  }
})();
