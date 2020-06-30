import { Router, Redirect } from "@reach/router";
import React from "react";

import { PATHS } from "../constants";
import Page from "../page";

export default function PageRoutes() {
  return (
    <Router>
      <Redirect from="/" to={PATHS.overview} noThrow replace />
      <Page name="overview" path={PATHS.overview} />
      <Page name="sentencing" path={PATHS.sentencing} />
      <Page name="prison" path={PATHS.prison} />
      <Page name="probation" path={PATHS.probation} />
      <Page name="parole" path={PATHS.parole} />
    </Router>
  );
}
