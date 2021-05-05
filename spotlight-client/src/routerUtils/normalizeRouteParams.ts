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
import { isNarrativeTypeId, isTenantId, TenantId } from "../contentApi/types";
import { NormalizedRouteParams, RouteParams } from "./types";

/**
 * converts URL parameter strings into valid union types
 */
export default function normalizeRouteParams(
  rawParams: RouteParams
): NormalizedRouteParams {
  const { tenantId, narrativeTypeId, sectionNumber } = rawParams;

  return {
    tenantId: normalizeTenantId(tenantId),
    narrativeTypeId: normalizeNarrativeTypeId(narrativeTypeId),
    sectionNumber: normalizeSectionNumber(sectionNumber),
  };
}

export function normalizeTenantId(
  rawParam: ValuesType<RouteParams>
): TenantId | null | undefined {
  if (typeof rawParam === "string") {
    const normalizedString = constantCase(rawParam);
    if (isTenantId(normalizedString)) return normalizedString;

    return null;
  }
  return undefined;
}

function normalizeNarrativeTypeId(rawParam: ValuesType<RouteParams>) {
  if (typeof rawParam === "string") {
    const normalizedString = pascalCase(rawParam);

    if (isNarrativeTypeId(normalizedString)) return normalizedString;

    return null;
  }
  return undefined;
}

function normalizeSectionNumber(rawParam: ValuesType<RouteParams>) {
  if (rawParam && typeof rawParam === "string") {
    const normalizedNumber = Number(rawParam);

    // we can't actually return a number here because route params must be strings,
    // but we can make sure it will resolve to a valid number when cast
    if (!normalizedNumber || normalizedNumber < 1) return null;

    return rawParam;
  }
  return undefined;
}
