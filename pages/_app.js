import { Container } from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import "./chargeStyles.css";

import translations from "@shopify/polaris/locales/en.json";
import React, { useEffect, useState } from "react";

const MyApp = ({ Component, pageProps }) => {
  const [shopOrigin, set_shopOrigin] = useState("");

  useEffect(() => {
    if (window) {
      const { search } = window.location;
      const searchParams = new URLSearchParams(search);
      if (searchParams.has("shop")) {
        set_shopOrigin(searchParams.get("shop"));
      }
    }
  }, []);

  const finalRender = shopOrigin ? (
    <Container>
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true,
          }}
        >
          <Component {...pageProps} shopOrigin={shopOrigin} />
        </Provider>
      </AppProvider>
    </Container>
  ) : null;

  return finalRender;
};

export default MyApp;
