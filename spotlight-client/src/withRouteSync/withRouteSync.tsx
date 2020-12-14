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
import { constantCase, pascalCase } from "change-case";
import React, { useEffect } from "react";
import {
  isMetricTypeId,
  isTenantId,
  MetricTypeId,
  TenantId,
} from "../contentApi/types";
import { useDataStore } from "../StoreProvider";

type RouteParams = {
  // these should match paths as defined in App.tsx
  tenantId?: string;
  metricTypeId?: string;
  narrativeTypeId?: string;
};

type NormalizedRouteParams = {
  tenantId?: TenantId;
  metricTypeId?: MetricTypeId;
};

function normalizeRouteParams(rawParams: RouteParams): NormalizedRouteParams {
  if (rawParams && typeof rawParams === "object") {
    const { tenantId, metricTypeId } = rawParams as { [key: string]: unknown };

    return {
      tenantId: normalizeTenantId(tenantId),
      metricTypeId: normalizeMetricTypeId(metricTypeId),
    };
  }
  return {};
}

function normalizeTenantId(rawParam: unknown) {
  if (typeof rawParam === "string") {
    const normalizedString = constantCase(rawParam);
    if (isTenantId(normalizedString)) return normalizedString;
    throw new Error(`unknown TenantId: ${normalizedString}`);
  }
  return undefined;
}

function normalizeMetricTypeId(rawParam: unknown) {
  if (typeof rawParam === "string") {
    const normalizedString = pascalCase(rawParam);
    if (isMetricTypeId(normalizedString)) return normalizedString;
    throw new Error(`unknown MetricTypeId: ${normalizedString}`);
  }
  return undefined;
}

/**
 * A high-order component responsible for syncing relevant route parameters
 * to the data store, so it can react to navigation.
 * Passes all props through `RouteComponent`, with route parameter types narrowed
 * from strings to unions of their valid values.
 * All Reach Router route components should be wrapped in this HOC!
 */
const withRouteSync = <Props extends RouteComponentProps & RouteParams>(
  RouteComponent: React.FC<Props>
): React.FC<Props> => {
  const WrappedRouteComponent: React.FC<Props> = (props) => {
    const { tenantStore } = useDataStore();

    const normalizedProps = normalizeRouteParams(props);

    useEffect(() => {
      tenantStore.setCurrentTenant({
        tenantId: normalizedProps.tenantId,
      });
    });

    return (
      <RouteComponent
        {...props}
        tenantId={normalizedProps.tenantId}
        metricTypeId={normalizedProps.metricTypeId}
      />
    );
  };

  return WrappedRouteComponent;
};

export default withRouteSync;
