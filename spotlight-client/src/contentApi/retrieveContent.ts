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

import US_ND from "./sources/us_nd";
import US_PA from "./sources/us_pa";
import { TenantContent, TenantId } from "./types";

const CONTENT_SOURCES: Record<TenantId, TenantContent> = { US_ND, US_PA };

type RetrieveContentParams = {
  tenantId: TenantId;
};

/**
 * Provides the entire content object for the tenant specified by `tenantId`.
 */
export default function retrieveContent({
  tenantId,
}: RetrieveContentParams): TenantContent {
  return CONTENT_SOURCES[tenantId];
}
