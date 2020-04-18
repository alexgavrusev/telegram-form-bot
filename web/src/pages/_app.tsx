import React, { FC, useEffect, Suspense } from "react";
import { AppProps } from "next/app";
import { ReactQueryDevtools } from "react-query-devtools";

import Head from "components/head";
import Providers from "components/providers";
import ErrorBoundary from "components/error-boundary";
import GlobalSpinner from "components/global-spinner";
import FetchProgress from "components/fetch-progress";

import debug from "utils/debug";

const log = debug("web:pages:_app");

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  log("Initializing why-did-you-render");
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React);
}

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head />

      <ReactQueryDevtools />

      <noscript>Enable javascript to run this web app.</noscript>

      <Providers>
        {/* TODO: come up with a better way to handle errors */}
        <ErrorBoundary>
          <Suspense fallback={<GlobalSpinner />}>
            <FetchProgress />
            <Component {...pageProps} />
          </Suspense>
        </ErrorBoundary>
      </Providers>
    </>
  );
};

export default App;
