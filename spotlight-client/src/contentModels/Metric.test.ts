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

import fetchMock from "jest-fetch-mock";
import { createMetricMapping } from "./Metric";
import retrieveContent from "../contentApi/retrieveContent";
import { MetricTypeId, MetricTypeIdList } from "../contentApi/types";

const testTenantId = "US_ND";
const testMetadataMapping = retrieveContent({ tenantId: testTenantId }).metrics;

const getTestMapping = () =>
  createMetricMapping({
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  });

let testMetricMapping: ReturnType<typeof createMetricMapping>;

function getTestMetric(testMetricId: MetricTypeId) {
  const metric = testMetricMapping[testMetricId];

  if (!metric) {
    throw new Error("expected instance of Metric");
  }

  return metric;
}

describe("metadata", () => {
  beforeAll(() => {
    testMetricMapping = getTestMapping();
  });

  test.each(MetricTypeIdList)("for metric %s", (metricId) => {
    const metric = getTestMetric(metricId);
    const testMetadata = testMetadataMapping[metricId];

    if (!testMetadata) {
      throw new Error("expected metadata for metric");
    }

    expect(metric.name).toBe(testMetadata.name);
    expect(metric.description).toBe(testMetadata.description);
    expect(metric.methodology).toBe(testMetadata.methodology);
  });
});

describe("data fetching", () => {
  beforeAll(() => {
    testMetricMapping = getTestMapping();
  });

  test.each(MetricTypeIdList)("for metric %s", async (metricId) => {
    const metric = getTestMetric(metricId);

    await metric.fetch();

    // Be advised, these snapshots are huge! However, the only expected failure cases here are:
    // 1. you intentionally changed the contents of the fixture in spotlight-api
    // 2. you intentionally changed the record format for this Metric type
    // Be especially careful inspecting snapshots for Metrics that filter their sources,
    // e.g. Parole/Probation metrics. Verify that they use the right rows!
    expect(metric.records).toMatchSnapshot();
  });
});

test("file loading state", async () => {
  testMetricMapping = getTestMapping();
  // not really necessary to test this once per type; we just pick one arbitrarily
  const metric = getTestMetric("ParoleSuccessHistorical");

  expect(metric.isLoading).toBeUndefined();

  const dataPromise = metric.fetch();
  expect(metric.isLoading).toBe(true);
  expect(metric.records).toBeUndefined();

  await dataPromise;
  expect(metric.isLoading).toBe(false);
  expect(metric.records).toBeDefined();
});

test("fetch error state", async () => {
  // mocking the backend for this test so we can simulate an error response
  fetchMock.doMock();

  testMetricMapping = getTestMapping();

  // not really necessary to test this once per type; we just pick one arbitrarily
  const metric = getTestMetric("PrisonStayLengthAggregate");

  fetchMock.mockResponse(JSON.stringify({ error: "test error message" }), {
    status: 500,
  });

  await expect(metric.fetch()).rejects.toThrow(
    "Metrics API responded with status 500. Error message: test error message"
  );

  fetchMock.resetMocks();
  // return the mock to its default inactive state
  fetchMock.dontMock();
});
