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

import assertNever from "assert-never";
import { paramCase } from "change-case";
import { DeepNonNullable } from "utility-types";
import { NarrativesSlug, NormalizedRouteParams } from "./types";

function makeRouteParam(param: string) {
  return paramCase(param);
}

type RequiredParams = DeepNonNullable<NormalizedRouteParams>;

type GetUrlOptions =
  | { page: "home" }
  | { page: "tenant"; params: Pick<RequiredParams, "tenantId"> }
  | { page: "narrative list"; params: Pick<RequiredParams, "tenantId"> }
  | {
      page: "narrative";
      params: Pick<RequiredParams, "tenantId" | "narrativeTypeId">;
    };

/**
 * Creates a properly parameterized URL from the input options
 */
function getUrlForResource(opts: GetUrlOptions): string {
  switch (opts.page) {
    case "home":
      return "/";
    case "tenant":
      return `/${makeRouteParam(opts.params.tenantId)}`;
    case "narrative list":
      return `/${makeRouteParam(opts.params.tenantId)}/${NarrativesSlug}`;
    case "narrative":
      return `/${makeRouteParam(
        opts.params.tenantId
      )}/${NarrativesSlug}/${makeRouteParam(opts.params.narrativeTypeId)}`;
    default:
      assertNever(opts);
  }
}

export default getUrlForResource;
