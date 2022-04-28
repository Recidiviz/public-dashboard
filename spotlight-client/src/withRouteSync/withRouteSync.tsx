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
import { observer } from "mobx-react-lite";
import React, { ComponentType, useEffect } from "react";
import { isTenantEnabled } from "../contentApi/isTenantEnabled";
import NotFound from "../NotFound";
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
const withRouteSync = <Props extends RouteComponentProps & RouteParams>(
  RouteComponent: ComponentType<Props>
): ComponentType<Props> => {
  const WrappedRouteComponent: React.FC<Props> = (props) => {
    const { tenantStore, uiStore } = useDataStore();

    const normalizedProps = normalizeRouteParams(props);

    const { path } = props;

    const isTenantForbidden =
      tenantStore.locked &&
      // either currentTenantId is not set, or the route's tenantId doesn't match the currentTenantId
      (!tenantStore.currentTenantId ||
        (normalizedProps.tenantId &&
          tenantStore.currentTenantId !== normalizedProps.tenantId));

    const isTenantDisabled = Boolean(
      tenantStore.currentTenantId &&
        !isTenantEnabled(tenantStore.currentTenantId)
    );

    const isRouteInvalid =
      isTenantForbidden ||
      isTenantDisabled ||
      Object.values(normalizedProps).includes(null) ||
      // catchall path for partially valid URLs; e.g. :tenantId/something-invalid
      path === "/*";

    // this is fine, we actually want this to run on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(
      action("sync route params", () => {
        tenantStore.currentTenantId = normalizedProps.tenantId ?? undefined;
        tenantStore.currentNarrativeTypeId =
          normalizedProps.narrativeTypeId ?? undefined;
        tenantStore.currentSectionNumber = Number(
          normalizedProps.sectionNumber
        );

        uiStore.isRouteInvalid = isRouteInvalid;
      })
    );

    if (isRouteInvalid) {
      return <NotFound />;
    }

    return <RouteComponent {...props} {...normalizedProps} />;
  };

  return observer(WrappedRouteComponent);
};

export default withRouteSync;
