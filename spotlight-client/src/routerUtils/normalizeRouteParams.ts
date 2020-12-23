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

import { constantCase, pascalCase } from "change-case";
import { ValuesType } from "utility-types";
import {
  isMetricTypeId,
  isSystemNarrativeTypeId,
  isTenantId,
} from "../contentApi/types";
import { NormalizedRouteParams, RouteParams } from "./types";

/**
 * converts URL parameter strings into valid union types
 */
export default function normalizeRouteParams(
  rawParams: RouteParams
): NormalizedRouteParams {
  const { tenantId, metricTypeId, narrativeTypeId } = rawParams;

  return {
    tenantId: normalizeTenantId(tenantId),
    metricTypeId: normalizeMetricTypeId(metricTypeId),
    narrativeTypeId: normalizeNarrativeTypeId(narrativeTypeId),
  };
}

function normalizeTenantId(rawParam: ValuesType<RouteParams>) {
  if (typeof rawParam === "string") {
    const normalizedString = constantCase(rawParam);
    if (isTenantId(normalizedString)) return normalizedString;
    throw new Error(`unknown TenantId: ${normalizedString}`);
  }
  return undefined;
}

function normalizeMetricTypeId(rawParam: ValuesType<RouteParams>) {
  if (typeof rawParam === "string") {
    const normalizedString = pascalCase(rawParam);
    if (isMetricTypeId(normalizedString)) return normalizedString;
    throw new Error(`unknown MetricTypeId: ${normalizedString}`);
  }
  return undefined;
}

function normalizeNarrativeTypeId(rawParam: ValuesType<RouteParams>) {
  if (typeof rawParam === "string") {
    const normalizedString = pascalCase(rawParam);
    if (isSystemNarrativeTypeId(normalizedString)) return normalizedString;
    throw new Error(`unknown narrative type id: ${normalizedString}`);
  }
  return undefined;
}
