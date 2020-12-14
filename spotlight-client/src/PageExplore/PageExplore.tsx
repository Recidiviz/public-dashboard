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

import { Link, RouteComponentProps } from "@reach/router";
import { observer } from "mobx-react-lite";
import React from "react";
import { paramCase } from "change-case";
import { MetricTypeIdList } from "../contentApi/types";
import { useDataStore } from "../StoreProvider";
import withRouteSync from "../withRouteSync";

// TODO: probably factor this out
function makeRouteParam(param: string) {
  return paramCase(param);
}

const PageExplore: React.FC<RouteComponentProps> = () => {
  // TODO: what if undefined?
  const tenant = useDataStore().tenantStore.currentTenant;

  return (
    <article>
      <h1>Explore Data</h1>
      {/* FYI this list is just a helpful placeholder */}
      {tenant && (
        <ul>
          {MetricTypeIdList.map((metricTypeId) => {
            const metric = tenant.metrics[metricTypeId];
            return (
              metric && (
                <li key={metricTypeId}>
                  <Link to={makeRouteParam(metricTypeId)}>{metric.name}</Link>
                </li>
              )
            );
          })}
        </ul>
      )}
    </article>
  );
};

export default withRouteSync(observer(PageExplore));
