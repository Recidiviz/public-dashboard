import { Router, Redirect, useLocation } from "@reach/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { PATHS } from "../constants";
import PageOverview from "../page-overview";
import PageSentencing from "../page-sentencing";
import PagePrison from "../page-prison";
import PageProbation from "../page-probation";
import PageParole from "../page-parole";
import PageRacialDisparities from "../page-racial-disparities/PageRacialDisparities";

const PagesContainer = styled.main``;

export default function PageRoutes() {
  const location = useLocation();

  useEffect(() => {
    // hacky nonsense to make the page scroll to the top after navigation,
    // per https://github.com/reach/router/issues/198
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    window.analytics.page(location.pathname);
  }, [location]);

  return (
    <PagesContainer>
      <Router>
        <Redirect from="/" to={PATHS.overview} noThrow replace />
        <PageOverview path={PATHS.overview} />
        <PageSentencing path={PATHS.sentencing} />
        <PagePrison path={PATHS.prison} />
        <PageProbation path={PATHS.probation} />
        <PageParole path={PATHS.parole} />
        <PageRacialDisparities path={PATHS.race} />
      </Router>
    </PagesContainer>
  );
}
