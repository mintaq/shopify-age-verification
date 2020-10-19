import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    domain: { type: String, unique: true },
    accessToken: { type: String, default: "" },
    settings: {
      layoutSelected: { type: String, default: "transparent" },
      requireAgeSelected: { type: String, default: "yes" },
      minimumAge: { type: String, default: "16" },
      rememberDays: { type: String, default: "10" },
      submitBtnLabel: { type: String, default: "OK" },
      cancelBtnLabel: { type: String, default: "Cancel" },
      exitUrl: { type: String, default: "https://www.google.com" },
    },
    customStyles: {
      headlineText: { type: String, default: "Welcom to shop!" },
      headlineTextSize: { type: String, default: "30" },
      subHeadlineText: {
        type: String,
        default: "You must at least 16 to visit this site!",
      },
      subHeadlineTextSize: { type: String, default: "16" },
      bgColorPicker: {
        hue: { type: String, default: "120" },
        brightness: { type: String, default: "1" },
        saturation: { type: String, default: "1" },
        alpha: { type: String, default: "0.8" },
      },
      textColor: {
        hue: { type: String, default: "120" },
        brightness: { type: String, default: "1" },
        saturation: { type: String, default: "1" },
        alpha: { type: String, default: "0.8" },
      },
      submitBtnBgColor: {
        hue: { type: String, default: "120" },
        brightness: { type: String, default: "1" },
        saturation: { type: String, default: "1" },
        alpha: { type: String, default: "0.8" },
      },
      cancelBtnBgColor: {
        hue: { type: String, default: "120" },
        brightness: { type: String, default: "1" },
        saturation: { type: String, default: "1" },
        alpha: { type: String, default: "0.8" },
      },
    },
    scriptTagId: { type: String, default: "" },
    appStatus: {
      type: String,
      default: "enable",
    },
  },
  { timestamps: true }
);

mongoose.model("shops", shopSchema);
