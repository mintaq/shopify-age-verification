import axios from "axios";
import { selectTableRow, updateTableRow } from "../sql/sqlQueries";
import updateScriptInTheme from "./updateScriptInTheme";

/**
 * 1. check if image existed or changed
 * 1.1 if not exist: create
 * 1.2 if exist: delete old one -> update new one
 *
 */

const uploadImageToAssets = async (shop, accessToken, img_data) => {
  const themeId = await updateScriptInTheme(shop, accessToken);
  const query_field = img_data.field;
  const img_name =
    img_data.name != null
      ? Math.floor(Math.random() * 1000) + "_" + img_data.name
      : null;
  const img_base64_data =
    img_data.data != null ? img_data.data.split(";base64,")[1] : null;

  const res__selectTable = await selectTableRow(
    "age_verifier_settings",
    query_field,
    { shop }
  );

  if (res__selectTable[query_field] != null) {
    // IF IMAGE IS EXISTED
    if (img_base64_data != null && img_name != null) {
      // IF INPUT DATA NOT NULL
      // DELETE OLD IMAGE IN ASSETS
      await axios.delete(
        `https://${shop}/admin/api/2020-10/themes/${themeId}/assets.json?asset[key]=assets/${res__selectTable[query_field]}`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      // CREATE NEW IMAGE IN ASSETS
      const axiosImageRes = await axios.put(
        `https://${shop}/admin/api/2020-10/themes/${themeId}/assets.json`,
        {
          asset: {
            key: `assets/${img_name}`,
            attachment: `${img_base64_data}`,
          },
        },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      // UPDATE IN DB
      const updateData =
        query_field == "popup_bg_name"
          ? {
              popup_bg_name: axiosImageRes.data.asset.key.split("/")[1],
              popup_bg: axiosImageRes.data.asset.public_url,
              themeId,
            }
          : {
              logo_name: axiosImageRes.data.asset.key.split("/")[1],
              logo: axiosImageRes.data.asset.public_url,
              themeId,
            };

      await updateTableRow("age_verifier_settings", updateData, { shop });

      return 1;
    } else {
      // IF INPUT DATA IS NULL (REMOVE EXISTED IMAGE)
      // DELETE IMAGE IN ASSETS
      await axios.delete(
        `https://${shop}/admin/api/2020-10/themes/${themeId}/assets.json?asset[key]=assets/${res__selectTable[query_field]}`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      // UPDATE TO DB
      const updateData =
        query_field == "popup_bg_name"
          ? {
              popup_bg_name: null,
              popup_bg: null,
              themeId,
            }
          : {
              logo_name: null,
              logo: null,
              themeId,
            };

      await updateTableRow("age_verifier_settings", updateData, { shop });
      return 2;
    }
  } else {
    // IF IMAGE IS NOT EXITED
    if (img_base64_data != null && img_name != null) {
      // IF INPUT DATA IS NOT NULL
      const axiosImageRes = await axios.put(
        `https://${shop}/admin/api/2020-10/themes/${themeId}/assets.json`,
        {
          asset: {
            key: `assets/${img_name}`,
            attachment: `${img_base64_data}`,
          },
        },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const updateData =
        query_field == "popup_bg_name"
          ? {
              popup_bg_name: axiosImageRes.data.asset.key.split("/")[1],
              popup_bg: axiosImageRes.data.asset.public_url,
              themeId,
            }
          : {
              logo_name: axiosImageRes.data.asset.key.split("/")[1],
              logo: axiosImageRes.data.asset.public_url,
              themeId,
            };

      await updateTableRow("age_verifier_settings", updateData, { shop });

      return 3;
    } else return 4;
  }
};

export default uploadImageToAssets;
