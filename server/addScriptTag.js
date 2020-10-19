import ShopifyAPIClient from "shopify-api-node";
import axios from "axios";
import mongoose from "mongoose";
import "./models/shop";

const Shop = mongoose.model("shops");

const addScriptTag = (shop, accessToken) => {
  console.log("add script");
  console.log(shop);
  console.log(accessToken);
  const scriptUrl = `https://${shop}/admin/api/2020-10/script_tags.json`;
  const options = {
    credentials: "include",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  };
  const requestBody = {
    script_tag: {
      event: "onload",
      src: `https://minhlocal.omegatheme.com/script_tag.js`,
    },
  };

  const optionsWithPost = {
    ...options,
    method: "POST",
    body: JSON.stringify(requestBody),
  };

  // fetch(`${scriptUrl}`, optionsWithPost)
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((error) => console.log("error", error));

  axios
    .post(scriptUrl, {
      ...options,
      script_tag: {
        event: "onload",
        src: `https://minhlocal.omegatheme.com/script_tag.js`,
      },
    })
    .then((res) => {
      console.log("res", res);
    })
    .catch((e) => {
      console.error(e);
    });
};

const BASE_SCRIPT_URL =
  "https://minhlocal.omegatheme.com/age-verification-omega/age-verfication-script-tag.js";

const createShopAndScriptTag = async function (shopDomain, accessToken) {
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  });

  const fetchedShop = await Shop.findOne({ domain: shopDomain });
  if (!fetchedShop) {
    const newScriptTag = await shopify.scriptTag.create({
      event: "onload",
      src: BASE_SCRIPT_URL,
    });

    const newShop = new Shop({
      domain: shopDomain,
      accessToken,
      scriptTagId: newScriptTag.id + "",
    });
    newShop.save();
  } else {
    console.log("Shop existed!");
    const updatedSriptTag = await shopify.scriptTag.update(
      fetchedShop.scriptTagId,
      {
        src: `${BASE_SCRIPT_URL}?v=${Math.floor(Math.random() * 100000)}`,
      }
    );

    await Shop.updateOne(
      { domain: shopDomain },
      { scriptTagId: updatedSriptTag.id + "" }
    );
    return;
  }
};

module.exports = {
  addScriptTag,
  createShopAndScriptTag,
};
