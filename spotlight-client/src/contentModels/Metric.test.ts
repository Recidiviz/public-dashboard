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

const testMetricId = "SentenceTypesCurrent";
const testMetadata = {
  name: "test metric",
  description: "this is a test metric",
  methodology: "test methodology description",
};
const testMetadataMapping = {
  [testMetricId]: testMetadata,
};

function getTestMetric() {
  const metric = createMetricMapping(testMetadataMapping)[testMetricId];

  if (!metric) {
    throw new Error("expected instance of Metric");
  }

  return metric;
}

test("base metadata", () => {
  const metric = getTestMetric();

  expect(metric.name).toBe(testMetadata.name);
  expect(metric.description).toBe(testMetadata.description);
  expect(metric.methodology).toBe(testMetadata.methodology);
});

test("fetches its data file", async () => {
  const metric = createMetricMapping(testMetadataMapping)[testMetricId];

  if (!metric) {
    throw new Error("expected instance of Metric");
  }

  await metric.fetch();
  // this is just a randomly chosen record from the fixture (transformed as needed)
  expect(metric.records).toEqual(
    expect.arrayContaining([
      {
        locality: "NORTH_CENTRAL",
        gender: "ALL",
        raceOrEthnicity: "BLACK",
        tenantId: "US_ND",
        ageBucket: "ALL",
        incarcerationCount: 29,
        probationCount: 45,
        dualSentenceCount: 17,
      },
    ])
  );
});

test("file loading state", async () => {
  const metric = getTestMetric();

  // TODO: probably this should not be expected until fetch has been called
  expect(metric.isLoading).toBe(true);

  await metric.fetch();
  expect(metric.isLoading).toBe(false);
});

test("fetch error state", async () => {
  fetchMock.doMock();

  const metric = getTestMetric();

  fetchMock.mockResponse(JSON.stringify({ error: "test error message" }), {
    status: 500,
  });

  await expect(metric.fetch()).rejects.toThrow(
    "Metrics API responded with status 500. Error message: test error message"
  );

  fetchMock.resetMocks();
  // resetting will activate the mocks, which are off by default.
  // return them to their default inactive state as well.
  fetchMock.dontMock();
});
