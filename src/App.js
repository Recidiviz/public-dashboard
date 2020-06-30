import { Router, Redirect } from "@reach/router";
import React from "react";
import SiteStyles from "./site-styles";
import { DEFAULT_TENANT } from "./constants";
import SiteLayout from "./site-layout";

function App() {
  const currentTenant = DEFAULT_TENANT;

  return (
    <>
      <SiteStyles />
      <Router>
        <Redirect from="/" to={`/${currentTenant}`} noThrow replace />
        <SiteLayout path=":tenantId/*" />
      </Router>
    </>
  );
}

export default App;
