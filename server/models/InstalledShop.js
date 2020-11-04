import mongoose from "mongoose";

const installedShopSchema = new mongoose.Schema(
  {
    shop: { type: String },
    app_id: { type: Number },
    name_shop: { type: String },
    email_shop: { type: String },
    phone: { type: Number },
    country: { type: String },
    status: { type: String },
    date_uninstalled: { type: Date },
    note: { type: String },
  },
  { timestamps: true }
);

mongoose.model("installed_shops", installedShopSchema);
