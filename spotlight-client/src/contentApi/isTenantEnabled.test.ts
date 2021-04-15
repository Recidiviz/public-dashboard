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

// we have to import everything dynamically to manipulate process.env,
// which is weird and Typescript doesn't like it, so silence these warnings
/* eslint-disable @typescript-eslint/no-explicit-any */
let cleanup: any;
let TenantIdList: any;
/* eslint-enable @typescript-eslint/no-explicit-any */

// this doesn't do anything but convince TypeScript this file is a module,
// since we don't have any top-level imports
export {};

// mocking the node env is esoteric, see https://stackoverflow.com/a/48042799
const ORIGINAL_ENV = process.env;

/**
 * Convenience method for importing test module after updating environment
 */
async function getTestFn() {
  return (await import("./isTenantEnabled")).isTenantEnabled;
}

beforeEach(async () => {
  // make a copy that we can modify
  process.env = { ...ORIGINAL_ENV };

  jest.resetModules();
  // reimport all modules except the test module
  const reactTestingLibrary = await import("@testing-library/react");
  cleanup = reactTestingLibrary.cleanup;
  TenantIdList = (await import("./types")).TenantIdList;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  // dynamic imports break auto cleanup so we have to do it manually
  cleanup();
});

test("all tenants enabled", async () => {
  process.env.REACT_APP_ENABLED_TENANTS = TenantIdList.join(",");

  const isTenantEnabled = await getTestFn();

  expect(TenantIdList.map(isTenantEnabled)).toEqual(
    TenantIdList.map(() => true)
  );
});

test("disabled tenant", async () => {
  process.env.REACT_APP_ENABLED_TENANTS = "US_ND";

  const isTenantEnabled = await getTestFn();

  expect(TenantIdList.map(isTenantEnabled)).toEqual(
    TenantIdList.map((id: string) => id === "US_ND")
  );
});
