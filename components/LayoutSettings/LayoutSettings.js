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
  ColorPicker,
  Popover,
  Modal,
  Toast,
  Frame,
  hsbToRgb,
  rgbString,
  rgbToHsb,
} from "@shopify/polaris";
import SkeletonPageComp from "../components/SkeletonPageComp";
import { useAppBridge } from "@shopify/app-bridge-react";
import axios from "axios";

const LayoutSettings = () => {
  return (
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
        <Card title="Require input age to verify">
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
        <Card title="Minimum age to view site">
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
        <Button fullWidth primary={true} onClick={handleSaveSetting}>
          Save
        </Button>
      </Layout.Section>
    </Layout>
  );
};
