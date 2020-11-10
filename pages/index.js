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
// import sharp from "sharp";
import classes from "./index.css";

const Index = ({ shopOrigin }) => {
  const [installedShop, setInstalledShop] = useState({});
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
  const [app_enable, set__app_enable] = useState(1); // default: 1 | 1: enable
  const [av_layout, set__av_layout] = useState(1); // default: 1 | 1: normal, 2: with bg image
  const [logo, set__logo] = useState(null);
  const [logo_name, set__logo_name] = useState(null);
  const [popup_bg, set__popup_bg] = useState(null);
  const [popup_bg_name, set__popup_bg_name] = useState(null);
  const [input_age, set__input_age] = useState(1); // default: 1 | 1: yes
  const [min_age, set__min_age] = useState(18);
  const [logo_data, set__logo_data] = useState(null);
  const [bgImage_data, set__bgImage_data] = useState(null);
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
  const [text_color, set__text_color] = useState("");
  const [custom_date, set__custom_date] = useState(null);
  const [validate_error, set__validate_error] = useState(null);

  // ADVANCE SETTINGS STATE
  const [advanceSettings, setAdvanceSettings] = useState({
    rememberDays: "10",
    exitUrl: "https://www.google.com",
    customCSS: "",
  });

  // *** FROM MYSQL
  const [cache_time, set__cache_time] = useState(10);
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
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const layoutOptions = [
    { label: "Transparent", value: 1 },
    { label: "With Background Image", value: 2 },
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

  useEffect(() => {
    async function fetchShop() {
      const { data } = await axios.get(
        `/api/mysql/shops/settings/${shopOrigin}`
      );
      console.log("MysqlData", data);
      // console.log("overlayBgColor ", JSON.parse(data.overlayBgColor));

      // *** LAYOUT STATES ***
      set__app_enable(data.app_enable);
      set__av_layout(data.av_layout);
      set__logo(data.logo);
      set__logo_name(data.logo_name);
      set__popup_bg(data.popup_bg);
      set__popup_bg_name(data.popup_bg_name);
      set__input_age(data.input_age);
      set__min_age(data.min_age);
      set__page_show(data.page_show);
      set__collection_page(data.collection_page);
      set__specific_products(data.specific_products);
      set__popupDisplaySelected(data.popupDisplaySelected);
      set__blockProducts(data.blockProducts);
      set__logo_data(data.logo_data);
      set__bgImage_data(data.bgImage_data);

      // *** STYLE STATES ***
      set__headline_text(data.headline_text);
      set__headline_size(data.headline_size);
      set__subhead_text(data.subhead_text);
      set__subhead_size(data.subhead_size);
      set__overlayBgColor(colorConverter(data.overlayBgColor));
      set__popup_bgcolor(colorConverter(data.popup_bgcolor));
      set__headlineTextColor(colorConverter(data.headlineTextColor));
      set__subHeadlineTextColor(colorConverter(data.subHeadlineTextColor));
      set__submit_label(data.submit_label);
      set__cancel_label(data.cancel_label);
      set__submit_bgcolor(colorConverter(data.submit_bgcolor));
      set__cancel_bgcolor(colorConverter(data.cancel_bgcolor));
      set__submitBtnLabelColor(colorConverter(data.submitBtnLabelColor));
      set__cancelBtnLabelColor(colorConverter(data.cancelBtnLabelColor));
      set__text_color(colorConverter(data.text_color));
      set__custom_date(data.custom_date);
      set__validate_error(data.validate_error);

      // *** ADVANCE STATES ***
      set__cache_time(data.cache_time);
      set__exit_link(data.exit_link);
      set__customcss(data.customcss);

      const installedShopRes = await axios.get(
        `/api/shops/installed/${shopOrigin}`
      );
      if (!installedShopRes) return;
      setInstalledShop({ ...installedShopRes.data });

      const isActive = await checkAppChargeStatus();
      if (isActive) {
        const shopSettings = await axios.get(
          `/api/shops/settings/${shopOrigin}`
        );
        if (!shopSettings) {
          console.log("Error", shopSettings);
          return;
        }

        setAppStatus(shopSettings.data.appStatus);
        setLayoutSettings({ ...shopSettings.data.layoutSettings });
        setStyleSettings({ ...shopSettings.data.styleSettings });
        setAdvanceSettings({ ...shopSettings.data.advanceSettings });
        setPrevDisplayOpts(
          shopSettings.data.layoutSettings.popupDisplaySelected
        );
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

  const checkAppChargeStatus = async () => {
    let _isOnTrial;
    let _isActive;
    const nowDate = new Date().getTime();
    const _7daysMs = 7 * 24 * 60 * 60 * 1000;
    const installedDate = new Date(installedShop.createdAt).getTime();

    nowDate - installedDate < _7daysMs
      ? (_isOnTrial = false)
      : (_isOnTrial = true);

    installedShop.status === "active"
      ? (_isActive = true)
      : (_isActive = false);

    return _isActive || _isOnTrial;
  };

  const colorConverter = (color) => {
    if (color.includes("#")) {
      return {
        r: (color >> 16) & 0xff,
        g: (color >> 8) & 0xff,
        b: color & 0xff,
        a: 1,
      };
    } else if (color != null && color != "") return JSON.parse(color);
    else return "";
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
      setLayoutSettings({ ...layoutSettings, popupDisplaySelected });
    } else if (
      !prevDisplayOpts.includes("all") &&
      popupDisplaySelected.includes("home") &&
      popupDisplaySelected.includes("collection") &&
      popupDisplaySelected.includes("product")
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = ["all", "home", "collection", "product"];
      setLayoutSettings({ ...layoutSettings, popupDisplaySelected });
    } else if (
      !prevDisplayOpts.includes("all") &&
      popupDisplaySelected.includes("all")
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = ["all", "home", "collection", "product"];
      setLayoutSettings({ ...layoutSettings, popupDisplaySelected });
    } else if (
      prevDisplayOpts.includes("all") &&
      !popupDisplaySelected.includes("all")
    ) {
      setPrevDisplayOpts(popupDisplaySelected);
      popupDisplaySelected = [];
      setLayoutSettings({ ...layoutSettings, popupDisplaySelected });
    }
    setPrevDisplayOpts(popupDisplaySelected);
    setLayoutSettings({ ...layoutSettings, popupDisplaySelected });
  });
  const handleLayoutSelectChange = useCallback((av_layout) =>
    set__av_layout(av_layout)
  );
  const handleReqAgeSelectChange = useCallback((requireAgeSelected) =>
    setLayoutSettings({ ...layoutSettings, requireAgeSelected })
  );
  const handleMinAgeChange = useCallback((minimumAge) =>
    setLayoutSettings({ ...layoutSettings, minimumAge })
  );
  const handleBgImageChange = useCallback(
    (bgImage) => {
      console.log(bgImage);
      set__bgImage_data(bgImage);
      setLayoutSettings({ ...layoutSettings, bgImage });
    } //TODO: clean up
  );
  const handleLogoChange = useCallback((logo) => {
    set__logo_data(logo);
    setLayoutSettings({ ...layoutSettings, logo });
  });
  const handleBlockProductsChange = useCallback((blockProducts) => {
    setLayoutSettings({ ...layoutSettings, blockProducts });
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
    set__popup_bgcolor(popup_bgcolor)
  );
  const handleHeadlineTextColorChange = useCallback((headlineTextColor) => {
    set__headlineTextColor(headlineTextColor);
    setStyleSettings({ ...styleSettings, headlineTextColor });
  });
  const handleSubHeadlineTextColorChange = useCallback(
    (subHeadlineTextColor) => {
      set__subHeadlineTextColor(subHeadlineTextColor);
      setStyleSettings({ ...styleSettings, subHeadlineTextColor });
    }
  );
  const handleSubmitBtnLabelChange = useCallback((submitBtnLabel) =>
    setStyleSettings({ ...styleSettings, submitBtnLabel })
  );
  const handleSubmitBtnBgColorChange = useCallback((submitBtnBgColor) => {
    set__submit_bgcolor(submitBtnBgColor);
    setStyleSettings({ ...styleSettings, submitBtnBgColor });
  });
  const handleSubmitBtnLabelColorChange = useCallback((submitBtnLabelColor) => {
    set__submitBtnLabelColor(submitBtnLabelColor);
    setStyleSettings({ ...styleSettings, submitBtnLabelColor });
  });
  const handleCancelBtnLabelChange = useCallback((cancelBtnLabel) =>
    setStyleSettings({ ...styleSettings, cancelBtnLabel })
  );
  const handleCancelBtnBgColorChange = useCallback((cancelBtnBgColor) => {
    set__cancel_bgcolor(cancelBtnBgColor);
    setStyleSettings({ ...styleSettings, cancelBtnBgColor });
  });
  const handleCancelBtnLabelColorChange = useCallback((cancelBtnLabelColor) => {
    set__cancelBtnLabelColor(cancelBtnLabelColor);
    setStyleSettings({ ...styleSettings, cancelBtnLabelColor });
  });
  const handleCustomMonthsChange = useCallback((customMonths) => {
    setStyleSettings({ ...styleSettings, customMonths });
  });
  const handleOneMonthChange = useCallback((month, value) => {
    setStyleSettings({
      ...styleSettings,
      customMonths: { ...styleSettings.customMonths, [month]: value },
    });
  });

  // ADVANCE SETTINGS HANDLERS
  const handleDaysChange = useCallback((rememberDays) =>
    setAdvanceSettings({ ...advanceSettings, rememberDays })
  );
  const handleExitUrlChange = useCallback((exitUrl) =>
    setAdvanceSettings({ ...advanceSettings, exitUrl })
  );
  const handleCustomCSSChange = useCallback((customCSS) => {
    setAdvanceSettings({ ...advanceSettings, customCSS });
  });

  // OTHERS HANDLERS
  const handleSaveSetting = async () => {
    setSaveToastActivate(true);

    // await axios.put(`/api/shops/${shopOrigin}`, {
    //   layoutSettings,
    //   styleSettings,
    //   advanceSettings,
    // });

    await axios.put(`/api/shops/${shopOrigin}`, {
      headline_text,
      headline_size,
      subhead_text,
      subhead_size,
      overlayBgColor: JSON.stringify(overlayBgColor),
      bgImage_data: JSON.stringify(bgImage_data),
    });
  };

  const handleAppStatusChange = async () => {
    if (app_enable != 1) {
      set__app_enable(1);
      setEnableToastActivate(true);
      await axios.put(`/api/shops/${shopOrigin}`, {
        app_enable: "enable",
      });
    } else setDisableModalActivate(true);
  };

  const handleDisableModalClose = () => {
    setDisableModalActivate(false);
    setAppStatus("enable");
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

  const handleSubmitLogo = async () => {
    setLayoutSettings(uploadLogo);
    handleLogoChange(uploadLogo);
    setUploadLogo(null);

    // let buf = Buffer(uploadLogo.data);
    // let dataBase64 = Buffer.from(buf).toString("base64");
    // console.log(dataBase64);
  };

  const handleRemoveLogo = () => {
    handleLogoChange(null);
  };

  const handleSubmitBgImage = () => {
    handleBgImageChange(uploadBgImage);
    setUploadBgImage(null);
  };

  const handleRemoveBgImage = () => {
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
                  {bgImage_data != null && bgImage_data != "" ? (
                    <Thumbnail
                      source={bgImage_data.data}
                      size="large"
                      alt="Logo"
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
                        bgImage_data != null && bgImage_data != ""
                          ? false
                          : true
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
                    console.log(fileObjs);
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
                    alt="Logo"
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
              {layoutSettings.logo != null ? (
                <Thumbnail
                  source={layoutSettings.logo.data}
                  size="large"
                  alt="Logo"
                />
              ) : (
                <TextContainer>
                  <p>Please upload your new logo!</p>
                </TextContainer>
              )}
              <Stack distribution="trailing">
                <Button
                  primary
                  disabled={layoutSettings.logo != null ? false : true}
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
              value={layoutSettings.requireAgeSelected}
              onChange={handleReqAgeSelectChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {layoutSettings.requireAgeSelected === "yes" ? (
        <Layout.Section>
          <Card title="Minimum age to view site:">
            <Card.Section>
              <TextField
                value={layoutSettings.minimumAge}
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
              selected={layoutSettings.popupDisplaySelected}
              onChange={(v) => {
                handlePopupDisplayChange(v);
              }}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {layoutSettings.popupDisplaySelected.includes("product") ? (
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
                initialSelectionIds={layoutSettings.blockProducts}
                onSelection={(v) => handleResourcePickerSelection(v)}
                showVariants={false}
                onCancel={() => setOpenResourcePicker(false)}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
      ) : null}

      <Layout.Section>
        <Button fullWidth primary={true} onClick={handleSaveSetting}>
          Save
        </Button>
      </Layout.Section>
    </Layout>
  );

  const handleColorPickerActivator = (activateSetter, styleSettingsState) => {
    return (
      <Button onClick={() => activateSetter(true)} plain>
        <div
          style={{
            height: "3.25rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: convertRgbToString(styleSettings[styleSettingsState]),
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
            color={styleSettings[styleSettingsState]}
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
            background: convertRgbToString(popup_bgcolor),
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
          color={popup_bgcolor}
          onChange={(color) => handlePopupBgColorChange(color.rgb)}
        />
      </Popover.Section>
    </Popover>
  );

  const listMonths = Object.keys(styleSettings.customMonths);
  let renderCustomMonths = [];
  for (let i = 0; i < listMonths.length - 1; i += 2) {
    renderCustomMonths.push(
      <Stack key={i} distribution="fillEvenly" spacing="tight">
        <TextField
          value={styleSettings.customMonths[listMonths[i]]}
          placeholder={MONTHS[i]}
          onChange={(v) => handleOneMonthChange(listMonths[i], v)}
        />
        <TextField
          value={styleSettings.customMonths[listMonths[i + 1]]}
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
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Size">
              <TextField
                value={subhead_size}
                onChange={handleSubHeadlineTextSizeChange}
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
                  value={styleSettings.submitBtnLabel}
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
                  value={styleSettings.cancelBtnLabel}
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

      {layoutSettings.requireAgeSelected === "yes" ? (
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
        <Button fullWidth primary={true} onClick={handleSaveSetting}>
          Save
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
              value={advanceSettings.rememberDays}
              placeholder="0"
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
              value={advanceSettings.exitUrl}
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
              value={advanceSettings.customCSS}
              onChange={handleCustomCSSChange}
              multiline={5}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Button fullWidth primary={true} onClick={handleSaveSetting}>
          Save
        </Button>
      </Layout.Section>
    </Layout>
  );

  var months = listMonths.map((month, index) => {
    return (
      <option key={index} value={styleSettings.customMonths[month]}>
        {styleSettings.customMonths[month]}
      </option>
    );
  });

  const avOverlayWrapStyle =
    layoutSettings.layoutSelected == "withBackground" &&
    layoutSettings.bgImage != null
      ? {
          backgroundImage: `url(${layoutSettings.bgImage.data})`,
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
                    href="https://scrip-tag.000webhostapp.com/index.css"
                  />
                  <link
                    href="https://fonts.googleapis.com/css?family=Oswald:400,700"
                    rel="stylesheet"
                  />
                  <div id="ot-av-overlay-wrap" style={avOverlayWrapStyle}>
                    <div
                      id="ot-av-overlay-form"
                      style={{
                        backgroundColor: convertRgbToString(popup_bgcolor),
                      }}
                    >
                      {layoutSettings.logo != null ? (
                        <div className="ot-logo-image">
                          <img src={layoutSettings.logo.data} />
                        </div>
                      ) : null}

                      <h1
                        className="ot-headline_text"
                        style={{
                          fontSize: headline_size + "px",
                          color: convertRgbToString(
                            styleSettings.headlineTextColor
                          ),
                        }}
                      >
                        {headline_text}
                      </h1>
                      <p
                        className="ot-subhead_text"
                        style={{
                          fontSize: subhead_size + "px",
                          color: convertRgbToString(
                            styleSettings.subHeadlineTextColor
                          ),
                        }}
                      >
                        {subhead_text}
                      </p>
                      {layoutSettings.requireAgeSelected === "yes" ? (
                        <div className="ot-av-datepicker-fields">
                          <select className="av-month">${months}</select>
                          <input
                            type="text"
                            className="av-day"
                            maxLength="2"
                            placeholder="01"
                          />
                          <input
                            type="text"
                            className="av-year"
                            maxLength="4"
                            placeholder="1998"
                          />
                        </div>
                      ) : null}
                      <div className="ot-av-submit-form">
                        <button
                          className="ot-av-submit-btn"
                          style={{
                            background: convertRgbToString(
                              styleSettings.submitBtnBgColor
                            ),
                            color: convertRgbToString(submitBtnLabelColor),
                          }}
                        >
                          {styleSettings.submitBtnLabel}
                        </button>
                        <button
                          className="ot-av-cancel-btn"
                          style={{
                            background: convertRgbToString(
                              styleSettings.cancelBtnBgColor
                            ),
                            color: convertRgbToString(
                              styleSettings.cancelBtnLabelColor
                            ),
                          }}
                        >
                          {styleSettings.cancelBtnLabel}
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
    <div>asdfF</div>
  );

  return finalRender;
};

export default Index;
