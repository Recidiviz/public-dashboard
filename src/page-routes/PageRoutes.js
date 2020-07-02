import { Router, Redirect } from "@reach/router";
import React from "react";

import styled from "styled-components";
import { PATHS } from "../constants";
import PageOverview from "../page-overview";
import PageSentencing from "../page-sentencing";
import PagePrison from "../page-prison";
import PageProbation from "../page-probation";
import PageParole from "../page-parole";

const PagesContainer = styled.main``;

export default function PageRoutes() {
  return (
    <PagesContainer>
      <Router>
        <Redirect from="/" to={PATHS.overview} noThrow replace />
        <PageOverview path={PATHS.overview} />
        <PageSentencing path={PATHS.sentencing} />
        <PagePrison path={PATHS.prison} />
        <PageProbation path={PATHS.probation} />
        <PageParole path={PATHS.parole} />
      </Router>
    </PagesContainer>
  );
}
