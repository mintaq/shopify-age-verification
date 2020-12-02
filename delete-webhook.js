require("events").EventEmitter.defaultMaxListeners = 15;
require("isomorphic-fetch");
const axios = require("axios");
const mysql = require("mysql");
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

function getUserSettings(shop) {
  let query = `SELECT access_token, store_name FROM tbl_usersettings WHERE store_name='${shop}'`;

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

    console.log(`> ${shop}`);
    return;
  } catch (err) {
    // console.log("err", err);
    return;
  }
}

(async function a() {
  console.log("Processing...");
  let del_wh_stores = [
    "bonumpellis.myshopify.com",
    "christmasoutletstore.myshopify.com",
    "l-l-fave-finds.myshopify.com",
    "picked-by-lu.myshopify.com",
  ];

  for (let i = 0; i < del_wh_stores.length; i++) {
    setTimeout(async () => {
      const store = await getUserSettings(del_wh_stores[i]);
      await deleteWebhook(store[0].store_name, store[0].access_token);
      if (i == del_wh_stores.length - 1) {
        setTimeout(() => {
          console.log("Done!");
          process.exit(0);
        }, 2500);
      }
    }, i * 200);
  }
})();
