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

import retrieveContent from "../contentApi/retrieveContent";
import { CollectionTypeId, MetricTypeId } from "../contentApi/types";
import { createTenant } from "./Tenant";
import exhaustiveFixture from "./__fixtures__/tenant_content_exhaustive";
import partialFixture from "./__fixtures__/tenant_content_partial";

jest.mock("../contentApi/retrieveContent");

const retrieveContentMock = retrieveContent as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("create a %s Tenant", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);
  const tenant = createTenant({ tenantId: "US_ND" });
  expect(tenant.name).toBe(fixture.name);
  expect(tenant.description).toBe(fixture.description);
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("tenant has %s Metrics", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  const expectedMetrics = Object.keys(fixture.metrics) as MetricTypeId[];
  expectedMetrics.forEach((metricId) =>
    expect(tenant.metrics.get(metricId)).toBeDefined()
  );
  expect(expectedMetrics.length).toBe(tenant.metrics.size);
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("tenant has %s Collections", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  const expectedCollections = Object.keys(
    fixture.collections
  ) as CollectionTypeId[];
  expectedCollections.forEach((id) => {
    const collection = tenant.collections.get(id);
    expect(collection).toBeDefined();
  });
  expect(expectedCollections.length).toBe(tenant.collections.size);
});
