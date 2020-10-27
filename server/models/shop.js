import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    domain: { type: String, unique: true },
    accessToken: { type: String, default: "" },
    styleSettings: {
      headlineText: { type: String, default: "Welcome to shop!" },
      headlineTextSize: { type: String, default: "30" },
      subHeadlineText: {
        type: String,
        default: "You must at least 16 to visit this site!",
      },
      subHeadlineTextSize: { type: String, default: "16" },
      overlayBgColor: {
        r: { type: Number, default: 31 },
        g: { type: Number, default: 26 },
        b: { type: Number, default: 26 },
        a: { type: Number, default: 1 },
      },
      popupBgColor: {
        r: { type: Number, default: 241 },
        g: { type: Number, default: 241 },
        b: { type: Number, default: 241 },
        a: { type: Number, default: 1 },
      },
      headlineTextColor: {
        r: { type: Number, default: 1 },
        g: { type: Number, default: 1 },
        b: { type: Number, default: 1 },
        a: { type: Number, default: 1 },
      },
      subHeadlineTextColor: {
        r: { type: Number, default: 1 },
        g: { type: Number, default: 1 },
        b: { type: Number, default: 1 },
        a: { type: Number, default: 1 },
      },
      submitBtnLabel: { type: String, default: "OK" },
      cancelBtnLabel: { type: String, default: "Cancel" },
      submitBtnBgColor: {
        r: { type: Number, default: 241 },
        g: { type: Number, default: 27 },
        b: { type: Number, default: 27 },
        a: { type: Number, default: 1 },
      },
      cancelBtnBgColor: {
        r: { type: Number, default: 108 },
        g: { type: Number, default: 89 },
        b: { type: Number, default: 89 },
        a: { type: Number, default: 1 },
      },
      submitBtnLabelColor: {
        r: { type: Number, default: 1 },
        g: { type: Number, default: 1 },
        b: { type: Number, default: 1 },
        a: { type: Number, default: 1 },
      },
      cancelBtnLabelColor: {
        r: { type: Number, default: 1 },
        g: { type: Number, default: 1 },
        b: { type: Number, default: 1 },
        a: { type: Number, default: 1 },
      },
    },
    layoutSettings: {
      popupDisplaySelected: { type: [String], default: ["home"] },
      blockProducts: { type: [Object] },
      bgImage: { type: Object, default: null },
      logo: { type: Object, default: null },
      layoutSelected: { type: String, default: "transparent" },
      requireAgeSelected: { type: String, default: "yes" },
      minimumAge: { type: String, default: "16" },
      submitBtnLabel: { type: String, default: "OK" },
      cancelBtnLabel: { type: String, default: "Cancel" },
    },
    advanceSettings: {
      rememberDays: { type: String, default: "10" },
      exitUrl: { type: String, default: "https://www.google.com" },
    },
    themeId: { type: Number },
    appStatus: { type: String, default: "enable" },
  },
  { timestamps: true }
);

mongoose.model("shops", shopSchema);
