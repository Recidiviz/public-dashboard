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
import React from "react";
import AuthWall from "./AuthWall";
import PageExplore from "./PageExplore";
import PageHome from "./PageHome";
import PageMetric from "./PageMetric";
import PageNarrativeHome from "./PageNarrativeHome";
import PageNotFound from "./PageNotFound";
import PageTenant from "./PageTenant";
import { DataPortalSlug, NarrativesSlug } from "./routerUtils/types";
import SiteNavigation from "./SiteNavigation";
import StoreProvider from "./StoreProvider";

/**
 * Helps with nesting; all it does is render its children.
 */
const PassThroughPage: React.FC<RouteComponentProps> = ({ children }) => (
  <>{children}</>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AuthWall>
        <SiteNavigation />
        <div role="main">
          <Router>
            {/*
              NOTE: every leaf route component in this router should be wrapped
              by the withRouteSync higher-order component to keep data and UI in sync!
            */}
            <PageHome path="/" />
            <PassThroughPage path="/:tenantId">
              <PageTenant path="/" />
              <PassThroughPage path={`/${DataPortalSlug}`}>
                <PageExplore path="/" />
                <PageMetric path="/:metricTypeId" />
                <PageNotFound default />
              </PassThroughPage>
              <PassThroughPage path={`/${NarrativesSlug}`}>
                <PageNarrativeHome path="/" />
              </PassThroughPage>
              <PageNotFound default />
            </PassThroughPage>
            <PageNotFound default />
          </Router>
        </div>
      </AuthWall>
    </StoreProvider>
  );
};

export default App;
