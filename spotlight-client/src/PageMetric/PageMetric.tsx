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

import { RouteComponentProps } from "@reach/router";
import { observer } from "mobx-react-lite";
import React from "react";
import { MetricTypeId } from "../contentApi/types";
import { useDataStore } from "../StoreProvider";
import withRouteSync from "../withRouteSync";

type PageMetricProps = RouteComponentProps & { metricTypeId?: MetricTypeId };

const PageMetric: React.FC<PageMetricProps> = ({ metricTypeId }) => {
  const tenant = useDataStore().tenantStore.currentTenant;

  // if this component is used properly as a route component,
  // this should never be true;
  // if it is, something has gone very wrong
  if (!metricTypeId) {
    throw new Error("missing metricTypeId");
  }

  // tenant may be briefly undefined on initial page load
  const metric = tenant?.metrics[metricTypeId];

  return (
    <article>
      <h1>{metric?.name}</h1>
    </article>
  );
};

export default withRouteSync(observer(PageMetric));