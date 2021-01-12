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
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import withRouteSync from "../withRouteSync";

const PageNarrativeList: React.FC<RouteComponentProps> = () => {
  const { tenant } = useDataStore();

  const systemNarratives = tenant?.systemNarratives;

  return (
    <article>
      <h1>Collections</h1>
      {tenant && systemNarratives && Object.keys(systemNarratives).length > 0 && (
        <section>
          <h2>system overview</h2>
          <ul>
            {Object.values(systemNarratives).map((narrative) => {
              return (
                narrative && (
                  <li key={narrative.id}>
                    <Link
                      to={getUrlForResource({
                        page: "narrative",
                        params: {
                          tenantId: tenant.id,
                          narrativeTypeId: narrative.id,
                        },
                      })}
                    >
                      {narrative.title}
                    </Link>
                  </li>
                )
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
};

export default withRouteSync(observer(PageNarrativeList));
