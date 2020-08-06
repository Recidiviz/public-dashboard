import { Router, Redirect } from "@reach/router";
import { setup as setupBreakpoints } from "@w11r/use-breakpoint";
import React from "react";
import { ThemeProvider } from "styled-components";
import { CUSTOM_BREAKPOINTS, DEFAULT_TENANT } from "./constants";
import { InfoPanelProvider } from "./info-panel";
import SiteStyles from "./site-styles";
import SiteLayout from "./site-layout";
import { THEME } from "./theme";

// set custom breakpoints for media queries
setupBreakpoints({
  breakpoints: {
    ...CUSTOM_BREAKPOINTS,
  },
});

function App() {
  // eventually it will be possible to change this;
  // for initial launch it is hard-coded to a single value
  const currentTenant = DEFAULT_TENANT;

  return (
    <ThemeProvider theme={THEME}>
      <InfoPanelProvider>
        <SiteStyles />
        <Router>
          <Redirect from="/" to={`/${currentTenant}`} noThrow replace />
          <SiteLayout path=":tenantId/*" />
        </Router>
      </InfoPanelProvider>
    </ThemeProvider>
  );
}

export default App;
