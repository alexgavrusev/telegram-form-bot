import React, { FC } from "react";
import {
  ReactQueryConfigProvider,
  ReactQueryProviderConfig,
} from "react-query";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "theme";

const queryConfig: ReactQueryProviderConfig = {
  shared: {
    suspense: true,
  },
  queries: {
    refetchOnMount: false,
    useErrorBoundary: false,
  },
  mutations: {
    useErrorBoundary: false,
  },
};

const Providers: FC = ({ children }) => (
  <ReactQueryConfigProvider config={queryConfig}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </ReactQueryConfigProvider>
);

export default Providers;
