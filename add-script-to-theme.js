const axios = require("axios");
const ShopifyAPIClient = require("shopify-api-node");
// const { HOST } = require("./age-verification.config.js") ;
// const { getUserSettings } = require("./server/sql/sqlQueries.js") ;
const mysql = require("mysql");
const HOST = "https://minh.omegatheme.com";
const STATIC_FILE_FOLDER = "age-verifier";
const BASE_SCRIPT_URL = `${HOST}/${STATIC_FILE_FOLDER}/age-verfication-script-tag.js`;

var mysqlLib = mysql.createPool({
  host: "192.168.11.128",
  user: "minhtq",
  password: "password",
  database: "shopify_minh",
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
    sql_Where += `${col} = "${where[col]}"`;
  });

  for (let i = 0; i < dataKeys.length; i++) {
    let value = data[dataKeys[i]];
    let field = dataKeys[i];

    if (value == null) {
      sql_Set += `${field}=NULL`;
    } else if (!Number.isNaN(value) || value == true || value == false) {
      sql_Set += `${field}='${value}'`;
    } else if (typeof value == "object") {
      sql_Set += `${field}=${JSON.stringify(value)}`;
    } else {
      sql_Set += `${field}=${value}`;
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

async function updateScriptInTheme(domain, accessToken) {
  const shopify = new ShopifyAPIClient({
    shopName: domain,
    accessToken: accessToken,
  });

  // FETCH THEME LIST
  let id;
  try {
    const themeList = await shopify.theme.list();
    const theme = themeList.find((theme) => theme.role == "main");
    id = theme.id;
  } catch (err) {
    return;
  }

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
  try {
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

    await updateTableRow(
      "age_verifier_settings",
      { themeId: id + "" },
      { shop: domain }
    );

    return id;
  } catch (err) {
    return;
  }
}

(async function a() {
  const user_settings_arr = await getUserSettings();
  user_settings_arr.push(
    {
      store_name: "sunshine-coast-vape-store-ltd.myshopify.com",
      access_token: "11943401712a42199d06ec7534bb6b64",
    },
    {
      store_name: "bamboo-cycles.myshopify.com",
      access_token: "7fb07d8f20e5f3f6abc3d8ec307999b2",
    }
  );
  let promises = await Promise.all(
    user_settings_arr.map(async ({ access_token, store_name }) => {
      try {
        let themeId = await updateScriptInTheme(store_name, access_token);
        return themeId;
      } catch (err) {
        throw err;
      }
    })
  );
  // console.log(promises)
  console.log("Done!");
})();
