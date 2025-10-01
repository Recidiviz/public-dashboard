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

import { getTenantFromDomain } from "./utils";

let originalUrl: string;

beforeEach(() => {
  originalUrl = window.location.href;
});

afterEach(() => {
  jsdom.reconfigure({ url: originalUrl });
});

test("*.nd.gov matches ND", () => {
  jsdom.reconfigure({ url: "https://dashboard.docr.nd.gov" });
  expect(getTenantFromDomain()).toBe("US_ND");

  // any subdomain should match
  jsdom.reconfigure({ url: "https://new-dashboard-url.nd.gov" });
  expect(getTenantFromDomain()).toBe("US_ND");

  // make sure that last nd.gov doesn't trick us
  jsdom.reconfigure({ url: "https://dashboard.maryland.gov" });
  expect(getTenantFromDomain).toThrow();
});

test("*.pa.gov matches PA", () => {
  jsdom.reconfigure({ url: "https://dashboard.cor.pa.gov" });
  expect(getTenantFromDomain()).toBe("US_PA");
});

test("other .gov domains error", () => {
  jsdom.reconfigure({ url: "https://dashboard.ca.gov" });
  expect(getTenantFromDomain).toThrow();

  jsdom.reconfigure({ url: "https://dashboard.co.gov" });
  expect(getTenantFromDomain).toThrow();

  jsdom.reconfigure({ url: "https://dashboard.whitehouse.gov" });
  expect(getTenantFromDomain).toThrow();
});

test("staging domains matching tenants", () => {
  jsdom.reconfigure({ url: "https://us-nd.spotlight-staging.recidiviz.org" });
  expect(getTenantFromDomain()).toBe("US_ND");

  jsdom.reconfigure({ url: "https://us-pa.spotlight-staging.recidiviz.org" });
  expect(getTenantFromDomain()).toBe("US_PA");
});

test("no match", () => {
  expect(getTenantFromDomain()).toBeUndefined();

  // multi-tenant staging home
  jsdom.reconfigure({ url: "https://spotlight-staging.recidiviz.org" });
  expect(getTenantFromDomain()).toBeUndefined();

  // unsupported tenant doesn't error, just doesn't trigger any special behavior
  jsdom.reconfigure({ url: "https://us-ri.spotlight-staging.recidiviz.org" });
  expect(getTenantFromDomain()).toBeUndefined();
});
