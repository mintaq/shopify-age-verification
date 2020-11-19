import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  Page,
  Button,
  Layout,
  TextField,
  Select,
  Tabs,
  Stack,
  Popover,
  Modal,
  Toast,
  Frame,
  Thumbnail,
  Sticky,
  DisplayText,
  TextContainer,
  ChoiceList,
  TextStyle,
} from "@shopify/polaris";
import { SketchPicker } from "react-color";
import { DropzoneAreaBase } from "material-ui-dropzone";
import SkeletonPageComp from "../components/SkeletonPageComp";
import styled from "styled-components";
import { ResourcePicker } from "@shopify/app-bridge-react";
import axios from "axios";
import classes from "./index.css";

const Index = ({ shopOrigin }) => {
  const [themeId, set__themeId] = useState("");
  const [user_settings, set__user_settings] = useState({});
  const [is_saving, set__is_saving] = useState(false);
  const [chargeStatus, setChargeStatus] = useState(true);
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const [tabSelected, setTabSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enableAppToastActivate, setEnableToastActivate] = useState(false);
  const [disableAppToastActivate, setDisableToastActivate] = useState(false);
  const [saveToastActivate, setSaveToastActivate] = useState(false);
  const [disableModalActivate, setDisableModalActivate] = useState(false);
  const [uploadBgImage, setUploadBgImage] = useState(null);
  const [uploadLogo, setUploadLogo] = useState(null);

  // TODO: check collection page
  // LAYOUT SETTINGS STATE
  const [appStatus, setAppStatus] = useState("enable");
  const [prevDisplayOpts, setPrevDisplayOpts] = useState([]);
  const [layoutSettings, setLayoutSettings] = useState({
    popupDisplaySelected: [],
    blockProducts: [],
    bgImage: null,
    logo: null,
    layoutSelected: "transparent",
    requireAgeSelected: "yes",
    minimumAge: "16",
    submitBtnLabel: "OK",
    cancelBtnLabel: "Cancel",
  });
  // *** FROM MYSQL
  const [app_enable, set__app_enable] = useState("1"); // default: 1 | 1: enable
  const [av_layout, set__av_layout] = useState("1"); // default: 1 | 1: normal, 2: with bg image
  const [logo, set__logo] = useState(null);
  const [logo_name, set__logo_name] = useState(null);
  const [popup_bg, set__popup_bg] = useState(null);
  const [popup_bg_name, set__popup_bg_name] = useState(null);
  const [input_age, set__input_age] = useState("1"); // default: 1 | 1: yes
  const [min_age, set__min_age] = useState("18");
  const [bgImage_temp, set__bgImage_temp] = useState(null);
  const [logo_temp, set__logo_temp] = useState(null);
  // TODO: collection page
  // NEW
  const [page_show, set__page_show] = useState(0);
  const [collection_page, set__collection_page] = useState([]);
  const [specific_products, set__specific_products] = useState([]);
  // OLD
  const [popupDisplaySelected, set__popupDisplaySelected] = useState([]);
  const [blockProducts, set__blockProducts] = useState([]);

  // STYLE SETTINGS STATE
  const [styleSettings, setStyleSettings] = useState({
    headlineText: "Welcome to shop!",
    headlineTextSize: "30",
    subHeadlineText: "You must at least 16 to visit this site!",
    subHeadlineTextSize: "16",
    overlayBgColor: { r: 31, g: 26, b: 26, a: 1 },
    popupBgColor: { r: 241, g: 241, b: 241, a: 1 },
    headlineTextColor: { r: 1, g: 1, b: 1, a: 1 },
    subHeadlineTextColor: { r: 1, g: 1, b: 1, a: 1 },
    submitBtnLabel: "OK",
    cancelBtnLabel: "Cancel",
    submitBtnBgColor: { r: 241, g: 27, b: 27, a: 1 },
    cancelBtnBgColor: { r: 108, g: 89, b: 89, a: 1 },
    submitBtnLabelColor: { r: 1, g: 1, b: 1, a: 1 },
    cancelBtnLabelColor: { r: 1, g: 1, b: 1, a: 1 },
    customMonths: {},
  });

  // *** FROM MYSQL
  const [headline_text, set__headline_text] = useState("Welcome to shop!");
  const [headline_size, set__headline_size] = useState(30);
  const [subhead_text, set__subhead_text] = useState(
    "You must at least 16 to visit this site!"
  );
  const [subhead_size, set__subhead_size] = useState(16);
  const [overlayBgColor, set__overlayBgColor] = useState({
    r: 31,
    g: 26,
    b: 26,
    a: 1,
  });
  const [popupBgColor, set__popupBgColor] = useState({
    r: 241,
    g: 241,
    b: 241,
    a: 0,
  });
  const [popup_bgcolor, set__popup_bgcolor] = useState("");
  const [headlineTextColor, set__headlineTextColor] = useState({
    r: 1,
    g: 1,
    b: 1,
    a: 1,
  });
  const [subHeadlineTextColor, set__subHeadlineTextColor] = useState({
    r: 1,
    g: 1,
    b: 1,
    a: 1,
  });
  const [submit_label, set__submit_label] = useState("OK");
  const [cancel_label, set__cancel_label] = useState("Cancel");
  const [submit_bgcolor, set__submit_bgcolor] = useState("");
  const [cancel_bgcolor, set__cancel_bgcolor] = useState("");
  const [submitBtnLabelColor, set__submitBtnLabelColor] = useState({
    r: 1,
    g: 1,
    b: 1,
    a: 1,
  });
  const [cancelBtnLabelColor, set__cancelBtnLabelColor] = useState({
    r: 1,
    g: 1,
    b: 1,
    a: 1,
  });
  const [submitBtnBgColor, set__submitBtnBgColor] = useState({
    r: 241,
    g: 132,
    b: 27,
    a: 1,
  });
  const [cancelBtnBgColor, set__cancelBtnBgColor] = useState({
    r: 108,
    g: 89,
    b: 89,
    a: 1,
  });
  const [text_color, set__text_color] = useState("");
  const [custom_date, set__custom_date] = useState({
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  });
  const [validate_error, set__validate_error] = useState("");

  // ADVANCE SETTINGS STATE
  const [advanceSettings, setAdvanceSettings] = useState({
    rememberDays: "10",
    exitUrl: "https://www.google.com",
    customCSS: "",
  });

  // *** FROM MYSQL
  const [cache_time, set__cache_time] = useState("10");
  const [exit_link, set__exit_link] = useState("https://www.google.com");
  const [customcss, set__customcss] = useState("");

  // ACTIVATOR AND HANDLERS
  const [overlayBgColorActivate, setOverlayBgColorActivate] = useState(false);
  const [popupBgColorActivate, setPopupBgColorActivate] = useState(false);
  const [headlineColorActive, setHeadlineColorActivate] = useState(false);
  const [subHeadlineColorActive, setSubHeadlineColorActive] = useState(false);
  const [submitBtnBgColorActivate, setSubmitBtnBgColorActivate] = useState(
    false
  );
  const [cancelBtnBgColorActivate, setCancelBtnBgColorActivate] = useState(
    false
  );
  const [
    submitBtnLabelColorActivate,
    setSubmitBtnLabelColorActivate,
  ] = useState(false);
  const [
    cancelBtnLabelColorActivate,
    setCancelBtnLabelColorActivate,
  ] = useState(false);
  const handleHeadlineColorActivateChange = useCallback((v) =>
    setHeadlineColorActivate(v)
  );
  const handleSubHeadlineColorActivateChange = useCallback((v) =>
    setSubHeadlineColorActive(v)
  );
  const handleSubmitBtnLabelColorActivateChange = useCallback((v) =>
    setSubmitBtnLabelColorActivate(v)
  );
  const handleSubmitBtnBgColorActivateChange = useCallback((v) =>
    setSubmitBtnBgColorActivate(v)
  );
  const handleCancelBtnLabelColorActivateChange = useCallback((v) =>
    setCancelBtnLabelColorActivate(v)
  );
  const handleCancelBtnBgColorActivateChange = useCallback((v) =>
    setCancelBtnBgColorActivate(v)
  );

  // OPTIONS ARRAYS
  const requireInputAgeOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const layoutOptions = [
    { label: "Transparent", value: "1" },
    { label: "With Background Image", value: "2" },
  ];

  const popupDisplayOptions = [
    { label: "All pages", value: "all" },
    { label: "In home page", value: "home" },
    { label: "In collection page", value: "collection" },
    { label: "Specific products", value: "product" },
  ];

  const tabs = [
    {
      id: "layout-settings",
      content: "Layout settings",
      accessibilityLabel: "Layout settings",
      panelID: "layout-settings-content",
      render: layoutSettingsTab,
    },
    {
      id: "style-settings",
      content: "Style settings",
      accessibilityLabel: "Style settings",
      panelID: "style-settings-content",
      render: styleSettings,
    },
    {
      id: "advance-settings",
      content: "Advance settings",
      accessibilityLabel: "Advance settings",
      panelID: "advance-settings-content",
      render: advanceSettingsTab,
    },
  ];

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // *** INIT DATA ***
  useEffect(() => {
    async function fetchShop() {
      const user_settings = await axios.get(
        `/api/shops/user-settings/${shopOrigin}`
      );
      if (!user_settings) return;

      set__user_settings(user_settings.data);

      const isActive = await checkAppChargeStatus(user_settings.data);
      if (isActive) {
        const { data } = await axios.get(
          `/age-verifier/api/shops/settings/${shopOrigin}`
        );

        // *** LAYOUT STATES ***
        set__themeId(data.themeId);
        set__app_enable(data.app_enable + "");
        set__av_layout(data.av_layout + "");
        set__logo(data.logo);
        set__logo_name(data.logo_name);
        set__popup_bg(data.popup_bg);
        set__popup_bg_name(data.popup_bg_name);
        set__input_age(data.input_age + "");
        set__min_age(data.min_age + "");
        popup_display_coverter(
          data.page_show,
          data.specific_products,
          data.popupDisplaySelected,
          data.blockProducts
        );

        // *** STYLE STATES ***
        set__headline_text(data.headline_text);
        set__headline_size(data.headline_size);
        set__subhead_text(data.subhead_text);
        set__subhead_size(data.subhead_size);
        set__overlayBgColor(colorConverter(data.overlayBgColor));
        colorMerger(
          data.popup_bgcolor,
          data.popupBgColor,
          "popup_bgcolor",
          "popupBgColor"
        );
        colorMerger(
          data.text_color,
          data.headlineTextColor,
          "text_color",
          "headlineTextColor"
        );
        colorMerger(
          data.text_color,
          data.subHeadlineTextColor,
          "text_color",
          "subHeadlineTextColor"
        );
        set__submit_label(data.submit_label);
        set__cancel_label(data.cancel_label);
        colorMerger(
          data.submit_bgcolor,
          data.submitBtnBgColor,
          "submit_bgcolor",
          "submitBtnBgColor"
        );
        colorMerger(
          data.cancel_bgcolor,
          data.cancelBtnBgColor,
          "cancel_bgcolor",
          "cancelBtnBgColor"
        );
        set__submitBtnLabelColor(colorConverter(data.submitBtnLabelColor));
        set__cancelBtnLabelColor(colorConverter(data.cancelBtnLabelColor));
        set__text_color(colorConverter(data.text_color));
        set__custom_date(JSON.parse(data.custom_date));
        set__validate_error(data.validate_error);

        // *** ADVANCE STATES ***
        set__cache_time(data.cache_time + "");
        set__exit_link(data.exit_link);
        set__customcss(data.customcss);

        setAppStatus(data.appStatus);
        setPrevDisplayOpts(data.popupDisplaySelected);
        setChargeStatus(true);
        setLoading(false);
      } else {
        setChargeStatus(false);
        setLoading(false);
      }
    }
    fetchShop();
  }, []);

  // GENERAL HANDLERS
  const handleTabChange = useCallback((selectedTabIndex) =>
    setTabSelected(selectedTabIndex)
  );

  const checkAppChargeStatus = async (data) => {
    let _isOnTrial;
    let _isActive;
    const nowDate = new Date().getTime();
    const _7daysMs = 7 * 24 * 60 * 60 * 1000;
    const installedDate = new Date(data.installed_date).getTime();

    nowDate - installedDate < _7daysMs
      ? (_isOnTrial = true)
      : (_isOnTrial = false);

    data.status == "active" ? (_isActive = true) : (_isActive = false);

    return _isActive || _isOnTrial;
  };

  const colorConverter = (color) => {
    if (color.includes("#")) {
      color = color.split("#")[1];
      var values = color.match(/.{1,2}/g);

      return {
        r: parseInt(values[0], 16),
        g: parseInt(values[1], 16),
        b: parseInt(values[2], 16),
        a: 1,
      };
    } else if (color != null && color != "") {
      return JSON.parse(color);
    } else {
      return {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      };
    }
  };

  const colorMerger = (oldColor, newColor, oldColor_name, newColor_name) => {
    if (oldColor && (newColor == "" || newColor == null)) {
      switch (oldColor_name) {
        case "popup_bgcolor":
          set__popupBgColor(colorConverter(oldColor));
          break;
        case "text_color":
          if (newColor_name == "headlineTextColor") {
            set__headlineTextColor(colorConverter(oldColor));
          } else {
            set__subHeadlineTextColor(colorConverter(oldColor));
          }
          break;
        case "submit_bgcolor":
          set__submitBtnBgColor(colorConverter(oldColor));
          break;
        case "cancel_bgcolor":
          set__cancelBtnBgColor(colorConverter(oldColor));
      }
    } else {
      if (newColor_name == "popupBgColor")
        set__popupBgColor(JSON.parse(newColor));
      if (newColor_name == "headlineTextColor") {
        set__headlineTextColor(JSON.parse(newColor));
      }
      if (newColor_name == "subHeadlineTextColor") {
        set__subHeadlineTextColor(JSON.parse(newColor));
      }
      if (newColor_name == "submitBtnBgColor") {
        set__submitBtnBgColor(JSON.parse(newColor));
      }
      if (newColor_name == "cancelBtnBgColor") {
        set__cancelBtnBgColor(JSON.parse(newColor));
      }
    }
  };

  const popup_display_coverter = (
    old_block_type,
    old_specific_products,
    new_popupDisplaySelected,
    new_blockProducts
  ) => {
    if (new_popupDisplaySelected == "" || new_popupDisplaySelected == null) {
      if (old_block_type == 1) {
        set__popupDisplaySelected(["home"]);
      } else if (old_block_type == 2) {
        set__popupDisplaySelected(["collection"]);
      } else if (old_block_type == 3) {
        set__popupDisplaySelected(["product"]);
        if (old_specific_products != "" && old_specific_products != null) {
          const old_prod_temp = JSON.parse(old_specific_products);
          let temp_arr = [];
          if (Array.isArray(old_prod_temp)) {
            old_prod_temp.map(({ id }) => {
              return temp_arr.push({
                id: `gid://shopify/Product/${id}`,
                rid: id,
              });
            });
            set__blockProducts(temp_arr);
          } else {
            set__blockProducts([]);
          }
        }
      } else {
        set__popupDisplaySelected(["home"]);
        set__blockProducts([]);
      }
    } else {
      set__popupDisplaySelected(JSON.parse(new_popupDisplaySelected));
      if (new_blockProducts != "" && new_blockProducts != null) {
        set__blockProducts(JSON.parse(new_blockProducts));
      } else set__blockProducts([]);
    }
  };

  // LAYOUT SETTINGS HANDLERS
  const handlePopupDisplayChange = useCallback((popupDisplaySelected) => {
    if (
      prevDisplayOpts.includes("all") &&
      (!popupDisplaySelected.includes("home") ||
        !popupDisplaySelected.includes("collection") ||
        !popupDisplaySelected.includes("product"))
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = popupDisplaySelected.filter(
        (word) => word != "all"
      );
      set__popupDisplaySelected(popupDisplaySelected);
    } else if (
      !prevDisplayOpts.includes("all") &&
      popupDisplaySelected.includes("home") &&
      popupDisplaySelected.includes("collection") &&
      popupDisplaySelected.includes("product")
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = ["all", "home", "collection", "product"];
      set__popupDisplaySelected(popupDisplaySelected);
    } else if (
      !prevDisplayOpts.includes("all") &&
      popupDisplaySelected.includes("all")
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = ["all", "home", "collection", "product"];
      set__popupDisplaySelected(popupDisplaySelected);
    } else if (
      prevDisplayOpts.includes("all") &&
      !popupDisplaySelected.includes("all")
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = [];
      set__popupDisplaySelected(popupDisplaySelected);
    }
    setPrevDisplayOpts(popupDisplaySelected);
    set__popupDisplaySelected(popupDisplaySelected);
  });
  const handleLayoutSelectChange = useCallback((avLayout) =>
    set__av_layout(avLayout)
  );
  const handleReqAgeSelectChange = useCallback((inputAge) => {
    set__input_age(inputAge);
  });
  const handleMinAgeChange = useCallback((min_age) => set__min_age(min_age));
  const handleBgImageChange = useCallback(
    (bgImage) => {
      set__popup_bg(bgImage);
      setLayoutSettings({ ...layoutSettings, bgImage });
    } //TODO: clean up
  );
  const handleLogoChange = useCallback((logo) => {
    set__logo(logo);
    setLayoutSettings({ ...layoutSettings, logo });
  });
  const handleBlockProductsChange = useCallback((blockProducts) => {
    set__blockProducts(blockProducts);
    setLayoutSettings({ ...layoutSettings, blockProducts });
  });
  const handleBgImageTempChange = useCallback((bgImage_temp) => {
    set__bgImage_temp(bgImage_temp);
  });
  const handleLogoTempChange = useCallback((logo_temp) => {
    set__logo_temp(logo_temp);
  });

  // STYLE SETTING HANDLERS
  const handleHeadlineTextChange = useCallback((headline_text) =>
    set__headline_text(headline_text)
  );
  const handleHeadlineTextSizeChange = useCallback((headline_size) =>
    set__headline_size(headline_size)
  );
  const handleSubHeadlineTextChange = useCallback((subhead_text) =>
    set__subhead_text(subhead_text)
  );
  const handleSubHeadlineTextSizeChange = useCallback((subhead_size) =>
    set__subhead_size(subhead_size)
  );
  const handleOverlayBgColorChange = useCallback((overlayBgColor) =>
    set__overlayBgColor(overlayBgColor)
  );
  const handlePopupBgColorChange = useCallback((popup_bgcolor) =>
    set__popupBgColor(popup_bgcolor)
  );
  const handleHeadlineTextColorChange = useCallback((headlineTextColor) => {
    set__headlineTextColor(headlineTextColor);
  });
  const handleSubHeadlineTextColorChange = useCallback(
    (subHeadlineTextColor) => {
      set__subHeadlineTextColor(subHeadlineTextColor);
    }
  );
  const handleSubmitBtnLabelChange = useCallback((submit_label) =>
    set__submit_label(submit_label)
  );
  const handleSubmitBtnBgColorChange = useCallback((submitBtnBgColor) => {
    set__submitBtnBgColor(submitBtnBgColor);
  });
  const handleSubmitBtnLabelColorChange = useCallback((submitBtnLabelColor) => {
    set__submitBtnLabelColor(submitBtnLabelColor);
  });
  const handleCancelBtnLabelChange = useCallback((cancel_label) =>
    set__cancel_label(cancel_label)
  );
  const handleCancelBtnBgColorChange = useCallback((cancelBtnBgColor) => {
    set__cancelBtnBgColor(cancelBtnBgColor);
  });
  const handleCancelBtnLabelColorChange = useCallback((cancelBtnLabelColor) => {
    set__cancelBtnLabelColor(cancelBtnLabelColor);
  });
  const handleCustomMonthsChange = useCallback((customMonths) => {
    setStyleSettings({ ...styleSettings, customMonths });
    set__custom_date(customMonths);
  });
  const handleOneMonthChange = useCallback((month, value) => {
    setStyleSettings({
      ...styleSettings,
      customMonths: { ...styleSettings.customMonths, [month]: value },
    });
    set__custom_date({
      ...custom_date,
      [month]: value,
    });
  });
  const handleValidateErrorChange = useCallback((validate_error) => {
    set__validate_error(validate_error);
  });

  // ADVANCE SETTINGS HANDLERS
  const handleDaysChange = useCallback((cache_time) =>
    set__cache_time(cache_time)
  );
  const handleExitUrlChange = useCallback((exit_link) =>
    set__exit_link(exit_link)
  );
  const handleCustomCSSChange = useCallback((customcss) => {
    set__customcss(customcss);
  });

  // OTHERS HANDLERS
  // *** HANDLE SAVE SETTINGS ***
  const handleSaveSetting = async () => {
    set__is_saving(true);

    await axios.put(`/api/shops/${shopOrigin}`, {
      app_enable: Number.parseInt(app_enable),
      av_layout: Number.parseInt(av_layout),
      input_age: Number.parseInt(input_age),
      min_age: Number.parseInt(min_age),
      headline_text,
      headline_size,
      subhead_text,
      subhead_size,
      popupDisplaySelected: JSON.stringify(popupDisplaySelected),
      blockProducts: JSON.stringify(blockProducts),
      custom_date: JSON.stringify(custom_date),
      submit_label,
      cancel_label,
      cache_time: Number.parseInt(cache_time),
      exit_link,
      validate_error,
      customcss,
      overlayBgColor: JSON.stringify(overlayBgColor),
      popupBgColor: JSON.stringify(popupBgColor),
      submitBtnLabelColor: JSON.stringify(submitBtnLabelColor),
      cancelBtnLabelColor: JSON.stringify(cancelBtnLabelColor),
      headlineTextColor: JSON.stringify(headlineTextColor),
      subHeadlineTextColor: JSON.stringify(subHeadlineTextColor),
      submitBtnBgColor: JSON.stringify(submitBtnBgColor),
      cancelBtnBgColor: JSON.stringify(cancelBtnBgColor),
    });

    setSaveToastActivate(true);
    set__is_saving(false);

    // SAVE IMAGEs
    // Background img
    if (bgImage_temp != null) {
      const type = bgImage_temp.file.type.split("/")[1];
      await axios.put(`/api/shops/upload_img/${shopOrigin}`, {
        image_data: {
          data: bgImage_temp.data,
          name: `${shopOrigin}_ageBg.${type}`,
          field: "popup_bg_name",
        },
      });
    } else if (bgImage_temp == null && popup_bg == null) {
      await axios.put(`/api/shops/upload_img/${shopOrigin}`, {
        image_data: {
          data: null,
          name: null,
          field: "popup_bg_name",
        },
      });
    }

    // Logo
    if (logo_temp != null) {
      const type = logo_temp.file.type.split("/")[1];
      await axios.put(`/api/shops/upload_img/${shopOrigin}`, {
        image_data: {
          data: logo_temp.data,
          name: `${shopOrigin}_ageLogo.${type}`,
          field: "logo_name",
        },
      });
    } else if (logo_temp == null && logo == null) {
      await axios.put(`/api/shops/upload_img/${shopOrigin}`, {
        image_data: {
          data: null,
          name: null,
          field: "logo_name",
        },
      });
    }
  };

  const handleAppStatusChange = async () => {
    if (app_enable != 1) {
      set__app_enable(1);
      setEnableToastActivate(true);
      await axios.put(`/api/shops/${shopOrigin}`, {
        app_enable: 1,
      });
    } else setDisableModalActivate(true);
  };

  const handleDisableModalClose = () => {
    setDisableModalActivate(false);
    set__app_enable(1);
  };

  const handleDisableApp = async () => {
    setDisableModalActivate(false);
    setDisableToastActivate(true);
    set__app_enable(0);
    await axios.put(`/api/shops/${shopOrigin}`, {
      app_enable: 0,
    });
  };

  const convertRgbToString = (value) => {
    let color = `rgba(${value.r},${value.g},${value.b},${value.a})`;
    return color;
  };

  const handleSubmitLogo = () => {
    handleLogoTempChange(uploadLogo);
    setUploadLogo(null);
    // handleLogoChange(uploadLogo);
  };

  const handleRemoveLogo = () => {
    handleLogoChange(null);
    handleLogoTempChange(null);
  };

  const handleSubmitBgImage = () => {
    handleBgImageTempChange(uploadBgImage);
    setUploadBgImage(null);
  };

  const handleRemoveBgImage = () => {
    handleBgImageTempChange(null);
    handleBgImageChange(null);
  };

  const handleResourcePickerSelection = ({ id, selection }) => {
    let blockProducts = [];
    selection.map(({ id }) => {
      let idSplit = id.split("/");
      let rid = idSplit[idSplit.length - 1];
      return blockProducts.push({ rid, id });
    });

    handleBlockProductsChange(blockProducts);
    setOpenResourcePicker(false);
  };

  const disableModal = (
    <Modal
      open={disableModalActivate}
      onClose={handleDisableModalClose}
      title="Do you want to disable the app?"
      primaryAction={{
        content: "No",
        onAction: handleDisableModalClose,
      }}
      secondaryActions={{
        content: "Yes",
        onAction: handleDisableApp,
      }}
    ></Modal>
  );

  // TOASTS
  const enableToast = enableAppToastActivate ? (
    <Toast
      content="App enabled!"
      onDismiss={() => setEnableToastActivate(false)}
      duration={4500}
    />
  ) : null;

  const disableToast = disableAppToastActivate ? (
    <Toast
      content="App disabled!"
      onDismiss={() => setDisableToastActivate(false)}
      duration={4500}
    />
  ) : null;

  const saveToast = saveToastActivate ? (
    <Toast
      content="Saved!"
      onDismiss={() => setSaveToastActivate(false)}
      duration={4500}
    />
  ) : null;

  // LAYOUT SETTINGS SECTION
  const layoutSettingsTab = (
    <Layout>
      <Layout.Section>
        <Card title="Select your layout">
          <Card.Section>
            <Select
              options={layoutOptions}
              value={av_layout}
              onChange={handleLayoutSelectChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {av_layout == 2 ? (
        <>
          <Layout.Section>
            <Card title="Background Image">
              <Card.Section>
                <Stack spacing="loose" vertical>
                  {popup_bg != null &&
                  popup_bg != "" &&
                  bgImage_temp == null ? (
                    <Thumbnail
                      source={popup_bg}
                      size="large"
                      alt="Background Img"
                    />
                  ) : bgImage_temp != null ? (
                    <Thumbnail
                      source={bgImage_temp.data}
                      size="large"
                      alt="Background Img"
                    />
                  ) : (
                    <TextContainer>
                      <p>Please upload your background image!</p>
                    </TextContainer>
                  )}
                  <Stack distribution="trailing">
                    <Button
                      primary
                      disabled={
                        popup_bg != null || bgImage_temp != null ? false : true
                      }
                      onClick={handleRemoveBgImage}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card
              title="Upload new background image"
              primaryFooterAction={{
                content: "Submit",
                onAction: () => handleSubmitBgImage(),
                disabled: uploadBgImage != null ? false : true,
              }}
            >
              <Card.Section>
                <DropzoneAreaBase
                  acceptedFiles={["image/*"]}
                  onAdd={(fileObjs) => {
                    setUploadBgImage(fileObjs[0]);
                  }}
                  onDelete={(fileObj) => setUploadBgImage({})}
                  dropzoneText={"Drag and drop logo here or Click (<1MB)"}
                  filesLimit={1}
                  maxFileSize={1000000}
                />
              </Card.Section>
              <Card.Section title="Preview uploaded background image">
                {uploadBgImage != null ? (
                  <Thumbnail
                    source={uploadBgImage.data}
                    size="large"
                    alt="Background img"
                  />
                ) : null
                // <DisplayText size="large">Please upload your background image!</DisplayText>
                }
              </Card.Section>
            </Card>
          </Layout.Section>
        </>
      ) : null}

      <Layout.Section>
        <Card title="Logo">
          <Card.Section>
            <Stack spacing="loose" vertical>
              {logo != null && logo != "" && logo_temp == null ? (
                <Thumbnail source={logo} size="large" alt="Logo" />
              ) : logo_temp != null ? (
                <Thumbnail source={logo_temp.data} size="large" alt="Logo" />
              ) : (
                <TextContainer>
                  <p>Please upload your new logo!</p>
                </TextContainer>
              )}
              <Stack distribution="trailing">
                <Button
                  primary
                  disabled={logo != null || logo_temp != null ? false : true}
                  onClick={handleRemoveLogo}
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card
          title="Upload new logo"
          primaryFooterAction={{
            content: "Submit",
            onAction: () => handleSubmitLogo(),
            disabled: uploadLogo != null ? false : true,
          }}
        >
          <Card.Section>
            <DropzoneAreaBase
              acceptedFiles={["image/*"]}
              onAdd={(fileObjs) => setUploadLogo(fileObjs[0])}
              onDelete={(fileObj) => setUploadLogo({})}
              dropzoneText={"Drag and drop logo here or Click (<1MB)"}
              filesLimit={1}
              maxFileSize={1000000}
            />
          </Card.Section>
          <Card.Section title="Preview uploaded logo">
            {uploadLogo != null ? (
              <Thumbnail source={uploadLogo.data} size="large" alt="Logo" />
            ) : null
            // <DisplayText size="large">Please upload your logo!</DisplayText>
            }
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Require input age to verify:">
          <Card.Section>
            <Select
              options={requireInputAgeOptions}
              value={input_age}
              onChange={handleReqAgeSelectChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {input_age == 1 ? (
        <Layout.Section>
          <Card title="Minimum age to view site:">
            <Card.Section>
              <TextField
                value={min_age + ""}
                type="number"
                inputMode="numeric"
                onChange={handleMinAgeChange}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
      ) : null}

      <Layout.Section>
        <Card title="Display popup in:">
          <Card.Section>
            <ChoiceList
              allowMultiple
              choices={popupDisplayOptions}
              selected={popupDisplaySelected}
              onChange={(v) => {
                handlePopupDisplayChange(v);
              }}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {popupDisplaySelected.includes("product") ? (
        <Layout.Section>
          <Card>
            <Card.Section>
              <Stack alignment="center">
                <Stack.Item>
                  <span>Select specific products:</span>
                </Stack.Item>
                <Button
                  primary
                  onClick={() => {
                    setOpenResourcePicker(true);
                  }}
                >
                  Open Resource Picker
                </Button>
              </Stack>
              <ResourcePicker
                resourceType="Product"
                open={openResourcePicker}
                initialSelectionIds={blockProducts}
                onSelection={(v) => {
                  handleResourcePickerSelection(v);
                }}
                showVariants={false}
                onCancel={() => setOpenResourcePicker(false)}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
      ) : null}

      <Layout.Section>
        <Button
          disabled={is_saving}
          fullWidth
          primary={true}
          onClick={handleSaveSetting}
        >
          {is_saving ? "Saving..." : "Save"}
        </Button>
      </Layout.Section>
    </Layout>
  );

  const handleColorPickerActivator = (activateSetter, styleSettingsState) => {
    let stateColor;
    switch (styleSettingsState) {
      case "cancelBtnLabelColor":
        stateColor = cancelBtnLabelColor;
        break;
      case "cancelBtnBgColor":
        stateColor = cancelBtnBgColor;
        break;
      case "submitBtnLabelColor":
        stateColor = submitBtnLabelColor;
        break;
      case "submitBtnBgColor":
        stateColor = submitBtnBgColor;
        break;
      case "subHeadlineTextColor":
        stateColor = subHeadlineTextColor;
        break;
      case "headlineTextColor":
        stateColor = headlineTextColor;
        break;
    }

    return (
      <Button onClick={() => activateSetter(true)} plain>
        <div
          style={{
            height: "3.25rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: convertRgbToString(stateColor),
          }}
        />
      </Button>
    );
  };

  const handlePopupColorPicker = (
    activateState,
    activateSetter,
    stateHandler,
    styleSettingsState
  ) => {
    let stateColor;
    switch (styleSettingsState) {
      case "cancelBtnLabelColor":
        stateColor = cancelBtnLabelColor;
        break;
      case "cancelBtnBgColor":
        stateColor = cancelBtnBgColor;
        break;
      case "submitBtnLabelColor":
        stateColor = submitBtnLabelColor;
        break;
      case "submitBtnBgColor":
        stateColor = submitBtnBgColor;
        break;
      case "subHeadlineTextColor":
        stateColor = subHeadlineTextColor;
        break;
      case "headlineTextColor":
        stateColor = headlineTextColor;
        break;
    }

    return (
      <Popover
        active={activateState}
        activator={handleColorPickerActivator(
          activateSetter,
          styleSettingsState
        )}
        onClose={() => activateSetter(false)}
        fullHeight={true}
      >
        <Popover.Section>
          <SketchPicker
            color={stateColor}
            onChange={(color) => stateHandler(color.rgb)}
          />
        </Popover.Section>
      </Popover>
    );
  };

  const overlayBgColorActivator = (
    <Stack distribution="fillEvenly">
      <Stack.Item>
        <span>Overlay color:</span>
      </Stack.Item>
      <Button onClick={() => setOverlayBgColorActivate(true)} plain>
        <div
          style={{
            height: "3.25rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: convertRgbToString(overlayBgColor),
          }}
        />
      </Button>
    </Stack>
  );

  const popupBgColorActivator = (
    <Stack distribution="fillEvenly">
      <Stack.Item>
        <span>Popup background color:</span>
      </Stack.Item>
      <Button onClick={() => setPopupBgColorActivate(true)} plain>
        <div
          style={{
            height: "3.25rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: convertRgbToString(popupBgColor),
          }}
        />
      </Button>
    </Stack>
  );

  const overlayBgColorPopover = (
    <Popover
      active={overlayBgColorActivate}
      activator={overlayBgColorActivator}
      onClose={() => setOverlayBgColorActivate(false)}
      fullHeight={true}
    >
      <Popover.Section>
        <SketchPicker
          color={overlayBgColor}
          onChange={(color) => handleOverlayBgColorChange(color.rgb)}
        />
      </Popover.Section>
    </Popover>
  );

  const popupBgColorPopover = (
    <Popover
      active={popupBgColorActivate}
      activator={popupBgColorActivator}
      onClose={() => setPopupBgColorActivate(false)}
      fullHeight={true}
    >
      <Popover.Section>
        <SketchPicker
          color={popupBgColor}
          onChange={(color) => handlePopupBgColorChange(color.rgb)}
        />
      </Popover.Section>
    </Popover>
  );

  const listMonths = Object.keys(custom_date);
  let renderCustomMonths = [];
  for (let i = 0; i < listMonths.length - 1; i += 2) {
    renderCustomMonths.push(
      <Stack key={i} distribution="fillEvenly" spacing="tight">
        <TextField
          value={custom_date[listMonths[i]]}
          placeholder={MONTHS[i]}
          onChange={(v) => handleOneMonthChange(listMonths[i], v)}
        />
        <TextField
          value={custom_date[listMonths[i + 1]]}
          placeholder={MONTHS[i + 1]}
          onChange={(v) => handleOneMonthChange(listMonths[i + 1], v)}
        />
      </Stack>
    );
  }

  // STYLE SETTINGS SECTION
  const styleSettingsTab = (
    <Layout>
      <Layout.Section>
        <Card title="Color pickers">
          <Card.Section>
            <Stack vertical={true}>
              {overlayBgColorPopover}
              {popupBgColorPopover}
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Headline">
          <Stack>
            <Stack.Item fill>
              <Card.Section title="Text">
                <TextField
                  value={headline_text}
                  onChange={handleHeadlineTextChange}
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Size">
              <TextField
                value={headline_size}
                onChange={handleHeadlineTextSizeChange}
                type="number"
                inputMode="numeric"
              />
            </Card.Section>
            <Card.Section title="Color">
              {handlePopupColorPicker(
                headlineColorActive,
                handleHeadlineColorActivateChange,
                handleHeadlineTextColorChange,
                "headlineTextColor"
              )}
            </Card.Section>
          </Stack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Sub-headline">
          <Stack>
            <Stack.Item fill>
              <Card.Section title="Text">
                <TextField
                  value={subhead_text}
                  onChange={handleSubHeadlineTextChange}
                  placeholder="You must at least 18 to visit this shop!"
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Size">
              <TextField
                value={subhead_size}
                onChange={handleSubHeadlineTextSizeChange}
                type="number"
                inputMode="numeric"
              />
            </Card.Section>
            <Card.Section title="Color">
              {handlePopupColorPicker(
                subHeadlineColorActive,
                handleSubHeadlineColorActivateChange,
                handleSubHeadlineTextColorChange,
                "subHeadlineTextColor"
              )}
              {/* {subHeadlineTextColorPopover} */}
            </Card.Section>
          </Stack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Submit button">
          <Stack>
            <Stack.Item fill>
              <Card.Section title="Label">
                <TextField
                  value={submit_label}
                  onChange={handleSubmitBtnLabelChange}
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Background">
              {handlePopupColorPicker(
                submitBtnBgColorActivate,
                handleSubmitBtnBgColorActivateChange,
                handleSubmitBtnBgColorChange,
                "submitBtnBgColor"
              )}
            </Card.Section>
            <Card.Section title="Text Color">
              {handlePopupColorPicker(
                submitBtnLabelColorActivate,
                handleSubmitBtnLabelColorActivateChange,
                handleSubmitBtnLabelColorChange,
                "submitBtnLabelColor"
              )}
            </Card.Section>
          </Stack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Cancel button ">
          <Stack>
            <Stack.Item fill>
              <Card.Section title="Label">
                <TextField
                  value={cancel_label}
                  onChange={handleCancelBtnLabelChange}
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Background">
              {handlePopupColorPicker(
                cancelBtnBgColorActivate,
                handleCancelBtnBgColorActivateChange,
                handleCancelBtnBgColorChange,
                "cancelBtnBgColor"
              )}
            </Card.Section>
            <Card.Section title="Text Color">
              {handlePopupColorPicker(
                cancelBtnLabelColorActivate,
                handleCancelBtnLabelColorActivateChange,
                handleCancelBtnLabelColorChange,
                "cancelBtnLabelColor"
              )}
            </Card.Section>
          </Stack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Validate error message:">
          <Card.Section>
            <TextField
              value={validate_error}
              placeholder="You are not old enough to visit this shop!"
              onChange={handleValidateErrorChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {input_age == 1 ? (
        <Layout.Section>
          <Card title="Custom months">
            <Card.Section>
              <Stack vertical={true} alignment="center">
                {renderCustomMonths}
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      ) : null}

      <Layout.Section>
        <Button
          disabled={is_saving}
          fullWidth
          primary={true}
          onClick={handleSaveSetting}
        >
          {is_saving ? "Saving..." : "Save"}
        </Button>
      </Layout.Section>
    </Layout>
  );

  // ADVANCE SETTINGS SECTION
  const advanceSettingsTab = (
    <Layout>
      <Layout.Section>
        <Card title="Remember visitors for (days)">
          <Card.Section>
            <TextField
              value={cache_time}
              placeholder="10"
              type="number"
              inputMode="numeric"
              onChange={handleDaysChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Exit URL">
          <Card.Section>
            <TextField
              value={exit_link}
              placeholder="https://www.google.com"
              onChange={handleExitUrlChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Custom CSS">
          <Card.Section>
            <TextField
              value={customcss}
              onChange={handleCustomCSSChange}
              multiline={5}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Button
          disabled={is_saving}
          fullWidth
          primary={true}
          onClick={handleSaveSetting}
        >
          {is_saving ? "Saving..." : "Save"}
        </Button>
      </Layout.Section>
    </Layout>
  );

  let months = listMonths.map((month, index) => {
    return (
      <option key={index} value={custom_date[month]}>
        {custom_date[month]}
      </option>
    );
  });

  let days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(
      <option key={i} value={i}>
        {i < 10 ? "0" + i : i}
      </option>
    );
  }

  const avOverlayWrapStyle =
    av_layout == 2 && popup_bg != null && popup_bg != "" && bgImage_temp == null
      ? {
          backgroundImage: `url('${popup_bg}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }
      : av_layout == 2 && bgImage_temp != null
      ? {
          backgroundImage: `url(${bgImage_temp.data})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }
      : { backgroundColor: convertRgbToString(overlayBgColor) };

  const finalRender = loading ? (
    <SkeletonPageComp />
  ) : chargeStatus ? (
    <Frame>
      <Layout>
        <Layout.Section oneHalf>
          <Page
            title="Settings"
            primaryAction={{
              content: `${app_enable == 1 ? "Disable" : "Enable"}`,
              onAction: () => handleAppStatusChange(),
            }}
            separator
          >
            {enableToast}
            {disableToast}
            {saveToast}
            {disableModal}
            <Card>
              <Tabs
                tabs={tabs}
                selected={tabSelected}
                onSelect={handleTabChange}
              >
                <Card.Section>
                  {tabSelected == 0
                    ? layoutSettingsTab
                    : tabSelected == 1
                    ? styleSettingsTab
                    : tabSelected == 2
                    ? advanceSettingsTab
                    : null}
                </Card.Section>
              </Tabs>
            </Card>
          </Page>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Sticky>
            <Page title="Layout Preview">
              <Frame>
                <div className="otAgeVerification">
                  <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://minh.omegatheme.com/age-verifier/index.css"
                  />
                  <link rel="preconnect" href="https://fonts.gstatic.com" />
                  <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
                    rel="stylesheet"
                  />
                  <div id="ot-av-overlay-wrap" style={avOverlayWrapStyle}>
                    <div
                      id="ot-av-overlay-form"
                      style={{
                        backgroundColor: convertRgbToString(popupBgColor),
                      }}
                    >
                      {logo != null && logo_temp == null ? (
                        <div className="ot-logo-image">
                          <img src={logo} />
                        </div>
                      ) : logo_temp != null ? (
                        <div className="ot-logo-image">
                          <img src={logo_temp.data} />
                        </div>
                      ) : null}

                      <h1
                        className="ot-headline_text"
                        style={{
                          fontSize: headline_size + "px",
                          color: convertRgbToString(headlineTextColor),
                        }}
                      >
                        {headline_text}
                      </h1>
                      <p
                        className="ot-subhead_text"
                        style={{
                          fontSize: subhead_size + "px",
                          color: convertRgbToString(subHeadlineTextColor),
                        }}
                      >
                        {subhead_text}
                      </p>
                      {input_age == 1 ? (
                        <div className="ot-av-datepicker-fields">
                          <select className="av-month">${months}</select>
                          <select className="av-day">${days}</select>
                          <input
                            type="text"
                            className="av-year"
                            maxLength="4"
                            placeholder="1970"
                          />
                        </div>
                      ) : null}
                      <div className="ot-av-submit-form">
                        <button
                          className="ot-av-submit-btn"
                          style={{
                            background: convertRgbToString(submitBtnBgColor),
                            color: convertRgbToString(submitBtnLabelColor),
                          }}
                        >
                          {submit_label}
                        </button>
                        <button
                          className="ot-av-cancel-btn"
                          style={{
                            background: convertRgbToString(cancelBtnBgColor),
                            color: convertRgbToString(cancelBtnLabelColor),
                          }}
                        >
                          {cancel_label}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Frame>
            </Page>
          </Sticky>
        </Layout.Section>
      </Layout>
    </Frame>
  ) : (
    <div>
      <h1>Charge now, pay later</h1>
      <p>
        To proceed with the installation, click below to activate the app and
        approve the charge.
      </p>
      <a
        target="_blank"
        href={`https://minh.omegatheme.com/check-charge/${shopOrigin}`}
      >
        Activate App
      </a>
    </div>
  );

  return finalRender;
};

export default Index;
