// import ApolloClient from "apollo-boost";
// import fetch from "node-fetch";
// import { ApolloProvider } from "react-apollo";
import App, { Container } from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import React, { useEffect, useState } from "react";

// const client = new ApolloClient({
//   fetch: fetch,
// });
const MyApp = ({ Component, pageProps }) => {
  // const { Component, pageProps } = this.props;
  // const shopOrigin = Cookies.get("shopOrigin");
  const [shopOrigin, set_shopOrigin] = useState("");

  useEffect(() => {
    console.log(window);
  });

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
          {/* <ApolloProvider client={client}> */}
          <Component {...pageProps} shopOrigin={shopOrigin} />
          {/* </ApolloProvider> */}
        </Provider>
      </AppProvider>
    </Container>
  ) : null;

  return finalRender;
};

export default MyApp;
