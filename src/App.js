import { Router, Redirect } from "@reach/router";
import React from "react";
import { ThemeProvider } from "styled-components";
import SiteStyles from "./site-styles";
import { DEFAULT_TENANT, THEME } from "./constants";
import SiteLayout from "./site-layout";

function App() {
  // eventually it will be possible to change this;
  // for initial launch it is hard-coded to a single value
  const currentTenant = DEFAULT_TENANT;

  return (
    <ThemeProvider theme={THEME}>
      <SiteStyles />
      <Router>
        <Redirect from="/" to={`/${currentTenant}`} noThrow replace />
        <SiteLayout path=":tenantId/*" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
