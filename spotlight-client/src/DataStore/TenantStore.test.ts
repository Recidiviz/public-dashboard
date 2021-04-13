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

import { runInAction } from "mobx";
import SystemNarrative from "../contentModels/SystemNarrative";
import Tenant from "../contentModels/Tenant";
import { reactImmediately } from "../testUtils";
import RootStore from "./RootStore";

let originalUrl: string;

beforeEach(() => {
  originalUrl = window.location.href;
});

afterEach(() => {
  jsdom.reconfigure({ url: originalUrl });
});

function getDataStore() {
  return new RootStore();
}

test("belongs to root store", () => {
  const DataStore = getDataStore();
  expect(DataStore.tenantStore).toBeDefined();
});

test("has no default tenant", () => {
  const { tenantStore } = getDataStore();
  reactImmediately(() => {
    expect(tenantStore.currentTenant).toBeUndefined();
  });
  expect.hasAssertions();
});

test("can set current tenant", () => {
  const { tenantStore } = getDataStore();
  runInAction(() => {
    tenantStore.currentTenantId = "US_ND";
  });

  reactImmediately(() => {
    expect(tenantStore.currentTenant).toBeInstanceOf(Tenant);
    expect(tenantStore.currentTenant?.id).toBe("US_ND");
  });
  expect.hasAssertions();
});

test("can set current narrative", () => {
  const { tenantStore } = getDataStore();
  expect(tenantStore.currentTenant).toBeUndefined();

  runInAction(() => {
    tenantStore.currentTenantId = "US_ND";
    tenantStore.currentNarrativeTypeId = "Prison";
  });

  reactImmediately(() => {
    expect(tenantStore.currentNarrative).toBeInstanceOf(SystemNarrative);
  });

  expect.assertions(2);
});

test("set tenant from current domain", () => {
  jsdom.reconfigure({ url: "https://dashboard.docr.nd.gov" });

  const { tenantStore } = getDataStore();

  reactImmediately(() => {
    expect(tenantStore.currentTenant?.id).toBe("US_ND");
  });
});

test("lock tenant if set from current domain", () => {
  jsdom.reconfigure({ url: "https://dashboard.docr.nd.gov" });

  const { tenantStore } = getDataStore();

  // we shouldn't be able to clear the current tenant
  runInAction(() => {
    tenantStore.currentTenantId = undefined;
  });
  reactImmediately(() => {
    expect(tenantStore.currentTenant?.id).toBe("US_ND");
    expect(tenantStore.currentTenantId).toBe("US_ND");
  });

  // TODO (#391): we shouldn't be able to change to another tenant either
});
