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