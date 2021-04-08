import { Router, Redirect, useLocation } from "@reach/router";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components/macro";
import { ALL_PAGES, PATHS } from "../constants";
import useCurrentPage from "../hooks/useCurrentPage";
import PageNotFound from "../page-not-found";
import PageOverview from "../page-overview";
import PagePrison from "../page-prison";
import PageProbation from "../page-probation";
import PageParole from "../page-parole";
import PageRacialDisparities from "../page-racial-disparities";
import PageSentencing from "../page-sentencing";
import { getSiteTitle } from "../utils";

const PagesContainer = styled.main``;

export default function PageRoutes() {
  const location = useLocation();
  const activePath = useCurrentPage();

  useEffect(() => {
    // hacky nonsense to make the page scroll to the top after navigation,
    // per https://github.com/reach/router/issues/198
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    window.analytics.page(location.pathname);
  }, [location.pathname]);

  return (
    <PagesContainer>
      <Helmet>
        <title>{getSiteTitle({ pageTitle: ALL_PAGES.get(activePath) })}</title>
      </Helmet>
      <Router>
        <Redirect from="/" to={PATHS.overview} noThrow replace />
        <PageOverview path={PATHS.overview} />
        <PageSentencing path={PATHS.sentencing} />
        <PagePrison path={PATHS.prison} />
        <PageProbation path={PATHS.probation} />
        <PageParole path={PATHS.parole} />
        <PageRacialDisparities path={PATHS.race} />
        <PageNotFound default />
      </Router>
    </PagesContainer>
  );
}
