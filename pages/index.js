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
import { setCookie } from "nookies";
import classes from "./index.css";

const Index = ({ shopOrigin }) => {
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const [tabSelected, setTabSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enableAppToastActivate, setEnableToastActivate] = useState(false);
  const [disableAppToastActivate, setDisableToastActivate] = useState(false);
  const [saveToastActivate, setSaveToastActivate] = useState(false);
  const [disableModalActivate, setDisableModalActivate] = useState(false);
  const [uploadBgImage, setUploadBgImage] = useState(null);
  const [uploadLogo, setUploadLogo] = useState(null);

  // LAYOUT SETTINGS STATE
  const [appStatus, setAppStatus] = useState("enable");
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
  });

  // ADVANCE SETTINGS STATE
  const [advanceSettings, setAdvanceSettings] = useState({
    rememberDays: "10",
    exitUrl: "https://www.google.com",
  });

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
    { label: "Transparent", value: "transparent" },
    { label: "With Background Image", value: "withBackground" },
  ];

  const popupDisplayOptions = [
    { label: "In home page", value: "home" },
    { label: "In collection page", value: "collection" },
    { label: "Specific products", value: "product" },
    { label: "All pages", value: "all" },
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

  useEffect(() => {
    async function fetchShop() {
      const shopSettings = await axios.get(`/api/shops/${shopOrigin}`);
      if (!shopSettings) {
        console.log("Error", shopSettings);
        return;
      }

      setAppStatus(shopSettings.data.appStatus);
      setLayoutSettings({ ...shopSettings.data.layoutSettings });
      setStyleSettings({ ...shopSettings.data.styleSettings });
      setAdvanceSettings({ ...shopSettings.data.advanceSettings });

      setLoading(false);
    }
    fetchShop();
  }, []);

  // GENERAL HANDLERS
  const handleTabChange = useCallback((selectedTabIndex) =>
    setTabSelected(selectedTabIndex)
  );

  // LAYOUT SETTINGS HANDLERS
  const handlePopupDisplayChange = useCallback((popupDisplaySelected) =>
    setLayoutSettings({ ...layoutSettings, popupDisplaySelected })
  );
  const handleLayoutSelectChange = useCallback((layoutSelected) =>
    setLayoutSettings({ ...layoutSettings, layoutSelected })
  );
  const handleReqAgeSelectChange = useCallback((requireAgeSelected) =>
    setLayoutSettings({ ...layoutSettings, requireAgeSelected })
  );
  const handleMinAgeChange = useCallback((minimumAge) =>
    setLayoutSettings({ ...layoutSettings, minimumAge })
  );
  const handleBgImageChange = useCallback((bgImage) =>
    setLayoutSettings({ ...layoutSettings, bgImage })
  );
  const handleLogoChange = useCallback((logo) =>
    setLayoutSettings({ ...layoutSettings, logo })
  );
  const handleBlockProductsChange = useCallback((blockProducts) => {
    setLayoutSettings({ ...layoutSettings, blockProducts });
  });

  // STYLE SETTING HANDLERS
  const handleHeadlineTextChange = useCallback((headlineText) =>
    setStyleSettings({ ...styleSettings, headlineText })
  );
  const handleHeadlineTextSizeChange = useCallback((headlineTextSize) =>
    setStyleSettings({ ...styleSettings, headlineTextSize })
  );
  const handleSubHeadlineTextChange = useCallback((subHeadlineText) =>
    setStyleSettings({ ...styleSettings, subHeadlineText })
  );
  const handleSubHeadlineTextSizeChange = useCallback((subHeadlineTextSize) =>
    setStyleSettings({ ...styleSettings, subHeadlineTextSize })
  );
  const handleOverlayBgColorChange = useCallback((overlayBgColor) =>
    setStyleSettings({ ...styleSettings, overlayBgColor })
  );
  const handlePopupBgColorChange = useCallback((popupBgColor) =>
    setStyleSettings({ ...styleSettings, popupBgColor })
  );
  const handleHeadlineTextColorChange = useCallback((headlineTextColor) =>
    setStyleSettings({ ...styleSettings, headlineTextColor })
  );
  const handleSubHeadlineTextColorChange = useCallback((subHeadlineTextColor) =>
    setStyleSettings({ ...styleSettings, subHeadlineTextColor })
  );
  const handleSubmitBtnLabelChange = useCallback((submitBtnLabel) =>
    setStyleSettings({ ...styleSettings, submitBtnLabel })
  );
  const handleSubmitBtnBgColorChange = useCallback((submitBtnBgColor) =>
    setStyleSettings({ ...styleSettings, submitBtnBgColor })
  );
  const handleSubmitBtnLabelColorChange = useCallback((submitBtnLabelColor) =>
    setStyleSettings({ ...styleSettings, submitBtnLabelColor })
  );
  const handleCancelBtnLabelChange = useCallback((cancelBtnLabel) =>
    setStyleSettings({ ...styleSettings, cancelBtnLabel })
  );
  const handleCancelBtnBgColorChange = useCallback((cancelBtnBgColor) =>
    setStyleSettings({ ...styleSettings, cancelBtnBgColor })
  );
  const handleCancelBtnLabelColorChange = useCallback((cancelBtnLabelColor) =>
    setStyleSettings({ ...styleSettings, cancelBtnLabelColor })
  );

  // ADVANCE SETTINGS HANDLERS
  const handleDaysChange = useCallback((rememberDays) =>
    setAdvanceSettings({ ...advanceSettings, rememberDays })
  );
  const handleExitUrlChange = useCallback((exitUrl) =>
    setAdvanceSettings({ ...advanceSettings, exitUrl })
  );

  // OTHERS HANDLERS
  const handleAppStatusChange = async () => {
    if (appStatus == "disable") {
      setAppStatus("enable");
      setEnableToastActivate(true);
      await axios.put(`/api/shops/${shopOrigin}`, {
        appStatus: "enable",
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
    setAppStatus("disable");
    await axios.put(`/api/shops/${shopOrigin}`, {
      appStatus: "disable",
    });
  };

  const convertRgbToString = (value) => {
    let color = `rgba(${value.r},${value.g},${value.b},${value.a})`;
    return color;
  };

  const handleSaveSetting = async () => {
    setSaveToastActivate(true);

    await axios.put(`/api/shops/${shopOrigin}`, {
      layoutSettings,
      styleSettings,
      advanceSettings,
    });
  };

  const handleSubmitLogo = () => {
    setLayoutSettings(uploadLogo);
    handleLogoChange(uploadLogo);
    setUploadLogo(null);

    // setCookie(null, "otAgeVerification", "enable", {
    //   maxAge: 60 * 60,
    // });

    // localStorage.setItem("otAgeVerification", appStatus);
    // console.log(document.cookie)
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
              value={layoutSettings.layoutSelected}
              onChange={handleLayoutSelectChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      {layoutSettings.layoutSelected == "withBackground" ? (
        <>
          <Layout.Section>
            <Card title="Background Image">
              <Card.Section>
                <Stack spacing="loose" vertical>
                  {layoutSettings.bgImage != null ? (
                    <Thumbnail
                      source={layoutSettings.bgImage.data}
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
                      disabled={layoutSettings.bgImage != null ? false : true}
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
              }}
            >
              <Card.Section>
                <DropzoneAreaBase
                  acceptedFiles={["image/*"]}
                  onAdd={(fileObjs) => setUploadBgImage(fileObjs[0])}
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
                ) : (
                  <DisplayText size="large">...</DisplayText>
                )}
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
            ) : (
              <DisplayText size="large">...</DisplayText>
            )}
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
          <Card title="Select products:">
            <Button
              primary
              onClick={() => {
                setOpenResourcePicker(true);
              }}
            >
              Open Resource Picker
            </Button>
            <ResourcePicker
              resourceType="Product"
              open={openResourcePicker}
              initialSelectionIds={layoutSettings.blockProducts}
              onSelection={(v) => handleResourcePickerSelection(v)}
              showVariants={false}
              onCancel={() => setOpenResourcePicker(false)}
            />
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
            background: convertRgbToString(styleSettings.overlayBgColor),
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
            background: convertRgbToString(styleSettings.popupBgColor),
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
          color={styleSettings.overlayBgColor}
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
          color={styleSettings.popupBgColor}
          onChange={(color) => handlePopupBgColorChange(color.rgb)}
        />
      </Popover.Section>
    </Popover>
  );

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
                  value={styleSettings.headlineText}
                  onChange={handleHeadlineTextChange}
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Size">
              <TextField
                value={styleSettings.headlineTextSize}
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
                  value={styleSettings.subHeadlineText}
                  onChange={handleSubHeadlineTextChange}
                />
              </Card.Section>
            </Stack.Item>
            <Card.Section title="Size">
              <TextField
                value={styleSettings.subHeadlineTextSize}
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
              onChange={handleExitUrlChange}
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
  var months = MONTHS.map((month, index) => {
    return (
      <option key={index} value={index}>
        {month}
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
      : { backgroundColor: convertRgbToString(styleSettings.overlayBgColor) };

  const finalRender = loading ? (
    <SkeletonPageComp />
  ) : (
    <Frame>
      <Layout>
        <Layout.Section oneHalf>
          <Page
            title="Settings"
            primaryAction={{
              content: `${appStatus == "enable" ? "Disable" : "Enable"}`,
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
                        backgroundColor: convertRgbToString(
                          styleSettings.popupBgColor
                        ),
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
                          fontSize: styleSettings.headlineTextSize + "px",
                          color: convertRgbToString(
                            styleSettings.headlineTextColor
                          ),
                        }}
                      >
                        {styleSettings.headlineText}
                      </h1>
                      <p
                        className="ot-subhead_text"
                        style={{
                          fontSize: styleSettings.subHeadlineTextSize + "px",
                          color: convertRgbToString(
                            styleSettings.subHeadlineTextColor
                          ),
                        }}
                      >
                        {styleSettings.subHeadlineText}
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
                            color: convertRgbToString(
                              styleSettings.submitBtnLabelColor
                            ),
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
  );

  return finalRender;
};

export default Index;
