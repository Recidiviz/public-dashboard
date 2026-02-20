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

import retrieveContent from "./retrieveContent";
import US_ND from "./sources/us_nd";
import US_PA from "./sources/us_pa";

test("returns content for the specified tenant", () => {
  expect(retrieveContent({ tenantId: "US_ND" })).toEqual(US_ND);
});

test("throws for disabled tenant", () => {
  expect(() => retrieveContent({ tenantId: "US_PA" })).toThrow();
});
