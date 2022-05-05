// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { TenantId } from "../contentApi/types";
import { normalizeTenantId } from "../routerUtils/normalizeRouteParams";

/**
 * Reads the hostname from the current Location. If it maps to a TenantId
 * (following known naming conventions), that TenantId will be returned;
 * otherwise `undefined`. *.gov domains are a special case: if a .gov Location
 * fails to match a known TenantID an error will be thrown.
 */
export function getTenantFromDomain(): TenantId | undefined {
  const domain = window.location.hostname;

  // production domains
  if (domain.endsWith(".gov")) {
    // TODO(#530): Add ID here
    // TODO(#): Add ME here
    if (domain.endsWith(".nd.gov")) {
      return "US_ND";
    }
    if (domain.endsWith(".pa.gov")) {
      return "US_PA";
    }
    // TODO(#529): Add TN here
    throw new Error("Unable to proceed; this .gov domain is not supported.");
  }

  // staging domains
  const stagingRegex = /^(.+).spotlight-staging.recidiviz.org$/i;
  const stagingMatch = stagingRegex.exec(domain);
  if (stagingMatch) {
    return normalizeTenantId(stagingMatch[1]) ?? undefined;
  }
}
