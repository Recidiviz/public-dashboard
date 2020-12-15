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

import { reactImmediately } from "../testUtils";
import Tenant from "../contentModels/Tenant";
import RootStore from "./RootStore";

let DataStore: RootStore;

beforeEach(() => {
  DataStore = new RootStore();
});

test("contains a tenant store", () => {
  expect(DataStore.tenantStore).toBeDefined();
});

describe("tenant store", () => {
  let tenantStore: typeof DataStore.tenantStore;

  beforeEach(() => {
    tenantStore = DataStore.tenantStore;
  });

  test("has no default tenant", () => {
    reactImmediately(() => {
      expect(tenantStore.currentTenant).toBeUndefined();
    });
    expect.hasAssertions();
  });

  test("can set current tenant", () => {
    tenantStore.setCurrentTenant({ tenantId: "US_ND" });
    reactImmediately(() => {
      expect(tenantStore.currentTenant).toBeInstanceOf(Tenant);
    });
    expect.hasAssertions();
  });
});
