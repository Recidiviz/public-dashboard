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
import { action } from "mobx";
import React, { useEffect } from "react";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import { RouteParams } from "../routerUtils/types";
import { useDataStore } from "../StoreProvider";

/**
 * A high-order component responsible for syncing relevant route parameters
 * to the data store, so it can react to navigation.
 * Passes all props through `RouteComponent`, with route parameter types narrowed
 * from strings to unions of their valid values.
 * All Reach Router route components should be wrapped in this HOC!
 */
const withUpdateStore = <Props extends RouteComponentProps & RouteParams>(
  RouteComponent: React.FC<Props>
): React.FC<Props> => {
  const WrappedRouteComponent: React.FC<Props> = (props) => {
    const { tenantStore } = useDataStore();

    const normalizedProps = normalizeRouteParams(props);

    useEffect(
      action("sync route params", () => {
        tenantStore.currentTenantId = normalizedProps.tenantId;
        tenantStore.currentNarrativeTypeId = normalizedProps.narrativeTypeId;
      })
    );

    return (
      <RouteComponent
        {...props}
        tenantId={normalizedProps.tenantId}
        narrativeTypeId={normalizedProps.narrativeTypeId}
      />
    );
  };

  return WrappedRouteComponent;
};

export default withUpdateStore;
