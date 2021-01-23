// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { RouteComponentProps, Router } from "@reach/router";
import { rem } from "polished";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import styled from "styled-components/macro";
import AuthWall from "./AuthWall";
import { FOOTER_HEIGHT, NAV_BAR_HEIGHT } from "./constants";
import GlobalStyles from "./GlobalStyles";
import PageHome from "./PageHome";
import PageNarrative from "./PageNarrative";
import PageNarrativeList from "./PageNarrativeList";
import PageNotFound from "./PageNotFound";
import PageTenant from "./PageTenant";
import { NarrativesSlug } from "./routerUtils/types";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";
import StoreProvider from "./StoreProvider";
import TooltipMobile from "./TooltipMobile";

/**
 * Helps with nesting; all it does is render its children.
 */
const PassThroughPage: React.FC<RouteComponentProps> = ({ children }) => (
  <>{children}</>
);

const Main = styled.div.attrs((props) => ({ role: "main" }))`
  margin-top: ${rem(NAV_BAR_HEIGHT)};
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT + FOOTER_HEIGHT)});
`;

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <StoreProvider>
        <GlobalStyles />
        <AuthWall>
          <SiteNavigation />
          <Main>
            <Router>
              {/*
                NOTE: every leaf route component in this router should be wrapped
                by the withRouteSync higher-order component to keep data and UI in sync!
              */}
              <PageHome path="/" />
              <PassThroughPage path="/:tenantId">
                <PageTenant path="/" />
                <PassThroughPage path={`/${NarrativesSlug}`}>
                  <PageNarrativeList path="/" />
                  <PageNarrative path="/:narrativeTypeId/*sectionNumber" />
                </PassThroughPage>
                <PageNotFound default />
              </PassThroughPage>
              <PageNotFound default />
            </Router>
          </Main>
          <SiteFooter />
          <TooltipMobile />
        </AuthWall>
      </StoreProvider>
    </HelmetProvider>
  );
};

export default App;
