import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  Page,
  Button,
  Layout,
  TextField,
  Select,
  Tabs,
  ColorPicker,
  Stack,
  Popover,
  Modal,
  Toast,
  Frame,
  Thumbnail,
  Sticky,
  DisplayText,
  TextContainer,
  hsbToRgb,
  rgbString,
  rgbToHsb,
} from "@shopify/polaris";
// import ColorPicker from 'material-ui-color-picker'
// import {ColorPicker} from 'material-ui-color'
import { DropzoneAreaBase } from "material-ui-dropzone";
import SkeletonPageComp from "../components/SkeletonPageComp";
import styled from "styled-components";
import { useAppBridge } from "@shopify/app-bridge-react";
import axios from "axios";
import classes from "./index.css";

const StickyLayoutSection = ({ children }) => (
  <StickySection className="Polaris-Layout__Section Polaris-Layout__Section--secondary">
    {children}
  </StickySection>
);

const StickySection = styled.div`
  position: sticky;
  top: 2rem;
`;

const Index = ({ shopOrigin, settings }) => {
  const app = useAppBridge();
  const [tabSelected, setTabSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enableAppToastActivate, setEnableToastActivate] = useState(false);
  const [disableAppToastActivate, setDisableToastActivate] = useState(false);
  const [saveToastActivate, setSaveToastActivate] = useState(false);
  const [disableModalActivate, setDisableModalActivate] = useState(false);
  // LAYOUT SETTINGS
  const [popupDisplaySelected, setPopupDisplaySelected] = useState("allPages");
  const [currentLogo, setCurrentLogo] = useState({});
  const [uploadLogo, setUploadLogo] = useState({});
  const [appStatus, setAppStatus] = useState("enable");
  const [layoutSelected, setLayoutSelected] = useState("transparent");
  const [requireAgeSelected, setRequireAgeSelected] = useState("yes");
  const [minimumAge, setMinimumAge] = useState("16");
  const [rememberDays, setRememberDays] = useState("10");
  const [submitBtnLabel, setSubmitBtnLabel] = useState("OK");
  const [cancelBtnLabel, setCancelBtnLabel] = useState("Cancel");
  const [exitUrl, setExitUrl] = useState("https://www.google.com");
  // STYLE SETTINGS
  const [styleSettings, setStyleSettings] = useState({
    headlineText: "Welcome to shop!",
    headlineTextSize: "30",
    subHeadlineText: "You must at least 16 to visit this site!",
    subHeadlineTextSize: "16",
    overlayBgColor: { alpha: 1, red: 255, blue: 48, green: 48 },
    popupBgColor: { alpha: 1, red: 255, blue: 48, green: 48 },
    headlineTextColor: { alpha: 1, red: 0, blue: 0, green: 0 },
    subHeadlineTextColor: { alpha: 1, red: 0, blue: 0, green: 0 },
    submitBtnLabel: "OK",
    cancelBtnLabel: "Cancel",
    submitBtnBgColor: { alpha: 1, red: 255, blue: 48, green: 48 },
    cancelBtnBgColor: { alpha: 1, red: 255, blue: 48, green: 48 },
    submitBtnLabelColor: { alpha: 1, red: 0, blue: 0, green: 0 },
    cancelBtnLabelColor: { alpha: 1, red: 0, blue: 0, green: 0 },
  });

  // TODO: clean up
  const [headlineText, setHeadlineText] = useState("Welcome to shop!");
  const [headlineTextSize, setHeadlineTextSize] = useState("30");
  const [subHeadlineText, setSubHeadlineText] = useState(
    "You must at least 16 to visit this site!"
  );
  const [subHeadlineTextSize, setSubHeadlineTextSize] = useState("16");
  const [bgColorPicker, setBgColorPicker] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
    alpha: 0.8,
  });
  const [textColor, setTextColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
    alpha: 0.8,
  });
  const [submitBtnBgColor, setSubmitBtnBgColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
    alpha: 0.8,
  });
  const [cancelBtnBgColor, setCancelBtnBgColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
    alpha: 0.8,
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
  const handleOverlayBgColorActivateChange = useCallback((v) =>
    setOverlayBgColorActivate(v)
  );
  const handlePopupBgColorActivateChange = useCallback((v) =>
    setPopupBgColorActivate(v)
  );

  //TODO: clean up
  const [popoverTextColorActivate, setPopoverTextColorActivate] = useState(
    false
  );
  const [
    popoverSubmitBtnColorActivate,
    setPopoverSubmitBtnColorActivate,
  ] = useState(false);
  const [
    popoverCancelBtnColorActivate,
    setPopoverCancelBtnColorActivate,
  ] = useState(false);

  if (loading) {
    // console.log("react");
  }

  const requireInputAgeOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const layoutOptions = [
    { label: "Transparent", value: "transparent" },
    { label: "With Background Image", value: "withBackground" },
  ];

  const popupDisplayOptions = [
    { label: "All pages", value: "allPages" },
    { label: "Only in home page", value: "onlyHomePage" },
    { label: "Only in collection page", value: "onlyCollectionPage" },
    { label: "Specific products", value: "specificProducts" },
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

  // FETCH SHOP SETTINGS
  useEffect(() => {
    async function fetchShop() {
      const res = await axios.get(`/api/shops/${shopOrigin}`);
      if (!res) {
        console.log("Error", res);
        return;
      }

      setAppStatus(res.data.appStatus);

      const settings = res.data.settings;
      setLayoutSelected(settings.layoutSelected);
      setRequireAgeSelected(settings.requireAgeSelected);
      setMinimumAge(settings.minimumAge);
      setRememberDays(settings.rememberDays);
      setSubmitBtnLabel(settings.submitBtnLabel);
      setCancelBtnLabel(settings.cancelBtnLabel);
      setExitUrl(settings.exitUrl);

      const customStyles = res.data.customStyles;
      setBgColorPicker(customStyles.bgColorPicker);
      setHeadlineText(customStyles.headlineText);
      setHeadlineTextSize(customStyles.headlineTextSize);
      setSubHeadlineText(customStyles.subHeadlineText);
      setSubHeadlineTextSize(customStyles.subHeadlineTextSize);
      setTextColor(customStyles.textColor);
      setSubmitBtnBgColor(customStyles.submitBtnBgColor);
      setCancelBtnBgColor(customStyles.cancelBtnBgColor);

      setLoading(false);
    }
    fetchShop();
  }, []);

  // HANDLERS
  const handlePopupDisplayChange = useCallback(
    (value) => setPopupDisplaySelected(value),
    []
  );
  const handleTabChange = useCallback(
    (selectedTabIndex) => setTabSelected(selectedTabIndex),
    []
  );
  const handleLayoutSelectChange = useCallback(
    (value) => setLayoutSelected(value),
    []
  );
  const handleReqAgeSelectChange = useCallback(
    (value) => setRequireAgeSelected(value),
    []
  );
  const handleMinAgeChange = useCallback((value) => setMinimumAge(value), []);
  const handleDaysChange = useCallback((value) => setRememberDays(value), []);
  const handleExitUrlChange = useCallback((value) => setExitUrl(value));

  // STYLE SETTING HANDLERS
  const handleHeadlineTextChange = useCallback(
    (headlineText) => setStyleSettings({ ...styleSettings, headlineText }),
    []
  );
  const handleHeadlineTextSizeChange = useCallback(
    (headlineTextSize) =>
      setStyleSettings({ ...styleSettings, headlineTextSize }),
    []
  );
  const handleSubHeadlineTextChange = useCallback(
    (subHeadlineText) =>
      setStyleSettings({ ...styleSettings, subHeadlineText }),
    []
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

  const handleAppStatusChange = async () => {
    if (appStatus == "disable") {
      setAppStatus("enable");
      setEnableToastActivate(true);
      await axios.put(`/api/shops/${shopOrigin}`, {
        appStatus: "enable",
      });
    } else setDisableModalActivate(true);
    // setAppStatus(appStatus == "enable" ? "disable" : "enable");
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

  const handleRgbChange = (value) => {
    const rgbValues = value.replace(/[^\d*.?\d*,]/g, "").split(",");
    const color = rgbToHsb({
      red: rgbValues[0],
      green: rgbValues[1],
      blue: rgbValues[2],
      alpha: rgbValues[3],
    });
    return color;
  };

  const handleSaveSetting = async () => {
    setSaveToastActivate(true);
    const settings = {
      layoutSelected,
      requireAgeSelected,
      minimumAge,
      rememberDays,
      submitBtnLabel,
      cancelBtnLabel,
      exitUrl,
    };

    const customStyles = {
      headlineText,
      headlineTextSize,
      subHeadlineText,
      subHeadlineTextSize,
      bgColorPicker,
      textColor,
      submitBtnBgColor,
      cancelBtnBgColor,
    };

    const res = await axios.put(`/api/shops/${shopOrigin}`, {
      settings: { ...settings },
      customStyles: { ...customStyles },
    });
  };

  const handleSubmitLogo = () => {
    console.log(uploadLogo);
    setCurrentLogo(uploadLogo);
  };

  const handleRemoveLogo = () => {
    setCurrentLogo({});
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
              value={layoutSelected}
              onChange={handleLayoutSelectChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Logo">
          <Card.Section>
            <Stack spacing="loose" vertical>
              {currentLogo.data ? (
                <Thumbnail source={currentLogo.data} size="large" alt="Logo" />
              ) : (
                <TextContainer>
                  <p>Please upload your new logo!</p>
                </TextContainer>
              )}
              <Stack distribution="trailing">
                <Button
                  primary
                  disabled={currentLogo.data ? false : true}
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
            {uploadLogo.data ? (
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
              value={requireAgeSelected}
              onChange={handleReqAgeSelectChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Minimum age to view site:">
          <Card.Section>
            <TextField
              value={minimumAge}
              type="number"
              inputMode="numeric"
              onChange={handleMinAgeChange}
            />
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Display popup in:">
          <Card.Section>
            <Select
              options={popupDisplayOptions}
              value={popupDisplaySelected}
              onChange={handlePopupDisplayChange}
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

  // TODO: need fixed
  const handleColorPickerActivator = (activateSetter, styleSettingsState) => {
    return (
      <Button onClick={() => activateSetter(true)} plain>
        <div
          style={{
            height: "3.25rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: rgbString(styleSettings[styleSettingsState]),
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
      >
        <Popover.Section>
          <ColorPicker
            onChange={(color) => {
              stateHandler(hsbToRgb(color));
            }}
            color={rgbToHsb(styleSettings[styleSettingsState])}
            allowAlpha
          />
        </Popover.Section>
        <Popover.Section>
          <TextField
            value={rgbString(styleSettings[styleSettingsState])}
            onChange={(v) => stateHandler(hsbToRgb(v))}
          />
        </Popover.Section>
      </Popover>
    );
  };

  //TODO: clean up
  const textColorActivator = (
    <Stack distribution="fillEvenly">
      <Stack.Item>
        <span>Text color:</span>
      </Stack.Item>
      <Button onClick={() => setPopoverTextColorActivate(true)} plain>
        <div
          style={{
            height: "2rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: rgbString(hsbToRgb(textColor)),
          }}
        />
      </Button>
    </Stack>
  );

  const submitBtnBgColorActivator = (
    <Stack distribution="fillEvenly">
      <Stack.Item>
        <span>Submit button background color:</span>
      </Stack.Item>
      <Button onClick={() => setPopoverSubmitBtnColorActivate(true)} plain>
        <div
          style={{
            height: "2rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: rgbString(hsbToRgb(submitBtnBgColor)),
          }}
        />
      </Button>
    </Stack>
  );

  const cancelBtnBgColorActivator = (
    <Stack distribution="fillEvenly">
      <Stack.Item>
        <span>Cancel button background color:</span>
      </Stack.Item>
      <Button onClick={() => setPopoverCancelBtnColorActivate(true)} plain>
        <div
          style={{
            height: "2rem",
            width: "7rem",
            borderRadius: "0.3rem",
            border: "0.5px solid darkgrey",
            background: rgbString(hsbToRgb(cancelBtnBgColor)),
          }}
        />
      </Button>
    </Stack>
  );

  // TODO: clean up
  const textColorPopover = (
    <Popover
      active={popoverTextColorActivate}
      activator={textColorActivator}
      onClose={() => setPopoverTextColorActivate(false)}
    >
      <Popover.Section>
        {/* <ColorPicker
          onChange={handleTextColorChange}
          color={textColor}
          allowAlpha
        /> */}
      </Popover.Section>
      <Popover.Section>
        {/* <TextField
          value={rgb_textColor}
          onChange={() =>
            handleBgColorPickerChange(handleRgbChange(rgb_textColor))
          }
        /> */}
      </Popover.Section>
    </Popover>
  );

  const submitBtnBgColorPopover = (
    <Popover
      active={popoverSubmitBtnColorActivate}
      activator={submitBtnBgColorActivator}
      onClose={() => setPopoverSubmitBtnColorActivate(false)}
    >
      <Popover.Section>
        {/* <ColorPicker
          onChange={handleSubmitBtnBgColorChange}
          color={submitBtnBgColor}
          allowAlpha
        /> */}
      </Popover.Section>
      <Popover.Section>
        {/* <TextField
          value={rgb_submitBtnBgColor}
          onChange={() =>
            handleBgColorPickerChange(handleRgbChange(rgb_submitBtnBgColor))
          }
        /> */}
      </Popover.Section>
    </Popover>
  );

  const cancelBtnBgColorPopover = (
    <Popover
      active={popoverCancelBtnColorActivate}
      activator={cancelBtnBgColorActivator}
      onClose={() => setPopoverCancelBtnColorActivate(false)}
    >
      <Popover.Section>
        {/* <ColorPicker
          onChange={handleCancelBtnBgColorChange}
          color={cancelBtnBgColor}
          allowAlpha
        /> */}
      </Popover.Section>
      <Popover.Section>
        {/* <TextField
          value={rgb_cancelBtnBgColor}
          onChange={() =>
            handleBgColorPickerChange(handleRgbChange(rgb_cancelBtnBgColor))
          }
        /> */}
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
              {/* {bgColorPickerPopover} */}
              {textColorPopover}
              {submitBtnBgColorPopover}
              {cancelBtnBgColorPopover}
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Headline">
          <Stack>
            <Card.Section title="Text">
              <TextField
                value={styleSettings.headlineText}
                onChange={handleHeadlineTextChange}
              />
            </Card.Section>
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
              {/* {headlineTextColorPopover} */}
            </Card.Section>
          </Stack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Sub-headline">
          <Stack>
            <Card.Section title="Text">
              <TextField
                value={styleSettings.subHeadlineText}
                onChange={handleSubHeadlineTextChange}
              />
            </Card.Section>
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
            <Card.Section title="Label">
              <TextField
                value={styleSettings.submitBtnLabel}
                onChange={handleSubmitBtnLabelChange}
              />
            </Card.Section>
            <Card.Section title="Text Color">
              {handlePopupColorPicker(
                submitBtnLabelColorActivate,
                handleSubmitBtnLabelColorActivateChange,
                handleSubmitBtnLabelColorChange,
                "submitBtnLabelColor"
              )}
            </Card.Section>
            <Card.Section title="Background color">
              {handlePopupColorPicker(
                submitBtnBgColorActivate,
                handleSubmitBtnBgColorActivateChange,
                handleSubmitBtnBgColorChange,
                "submitBtnBgColor"
              )}
            </Card.Section>
          </Stack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Cancel button ">
          <Stack>
            <Card.Section title="Label">
              <TextField
                value={styleSettings.cancelBtnLabel}
                onChange={handleCancelBtnLabelChange}
              />
            </Card.Section>
            <Card.Section title="Text Color">
              {handlePopupColorPicker(
                cancelBtnLabelColorActivate,
                handleCancelBtnLabelColorActivateChange,
                handleCancelBtnLabelColorChange,
                "cancelBtnLabelColor"
              )}
            </Card.Section>
            <Card.Section title="Background color">
              {handlePopupColorPicker(
                cancelBtnBgColorActivate,
                handleCancelBtnBgColorActivateChange,
                handleCancelBtnBgColorChange,
                "cancelBtnBgColor"
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
              value={rememberDays}
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
            <TextField value={exitUrl} onChange={handleExitUrlChange} />
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
        {/* <StickyLayoutSection>asdasd</StickyLayoutSection> */}
        <Layout.Section oneHalf>
          <Sticky>
            <Page title="Layout Preview">
              <Frame>
                <div className="otAgeVerifier">
                  <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://minhlocal.omegatheme.com/age-verification-omega/pages/index.css"
                  />
                  <link
                    href="https://fonts.googleapis.com/css?family=Oswald:400,700"
                    rel="stylesheet"
                  />
                  <div
                    id="av-overlay-wrap"
                    style={{ backgroundColor: "rgba(0,0,0,.8)" }}
                  >
                    <div
                      id="av-overlay-form"
                      style={{ backgroundColor: bgColorPicker }}
                    >
                      {currentLogo.data ? (
                        <div className="logo-image">
                          <img src={currentLogo.data} />
                        </div>
                      ) : null}

                      <h1
                        className="headline_text"
                        style={{
                          fontSize: styleSettings.headlineTextSize + "px",
                          color: rgbString(styleSettings.headlineTextColor),
                        }}
                      >
                        {styleSettings.headlineText}
                      </h1>
                      <p
                        className="subhead_text"
                        id="subhead_text"
                        style={{
                          fontSize: styleSettings.subHeadlineTextSize + "px",
                          color: rgbString(styleSettings.subHeadlineTextColor),
                        }}
                      >
                        {styleSettings.subHeadlineText}
                      </p>

                      <div className="av_date_submit_form">
                        <div className="av_date_submit">
                          <a
                            id="av_submit_form"
                            style={{
                              background: submitBtnBgColor,
                              color: textColor,
                            }}
                          >
                            {submitBtnLabel}
                          </a>
                        </div>
                        <div className="av_date_cancel">
                          <a
                            style={{
                              background: cancelBtnBgColor,
                              color: textColor,
                            }}
                          >
                            {cancelBtnLabel}
                          </a>
                        </div>
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
