import { Router } from "@reach/router";
import React from "react";

import { PATHS } from "../constants";
import Page from "../page";

export default function Routes() {
  return (
    <Router>
      <Page name="overview" path={PATHS.home} />
      <Page name="sentencing" path={PATHS.sentencing} />
      <Page name="prison" path={PATHS.prison} />
      <Page name="probation" path={PATHS.probation} />
      <Page name="parole" path={PATHS.parole} />
    </Router>
  );
}
