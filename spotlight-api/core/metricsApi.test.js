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

const path = require("path");
const ReadLines = require("n-readlines");
const {
  fetchMetricsByName,
  fetchParoleMetrics,
  memoryCache,
} = require("./metricsApi");
const objectStorage = require("./objectStorage");

jest.mock("./objectStorage");

beforeEach(() => {
  // this should be the only method we care about here
  objectStorage.downloadFile.mockImplementation(
    (bucketName, tenantId, srcFilename) => {
      // this comes from an env var that we are not currently providing in the test env
      expect(bucketName).toBeUndefined();
      // this has to be transformed to uppercase or it won't match a GCS directory
      expect(tenantId).toBe("TEST_ID");
      return Promise.resolve({
        toString: jest
          .fn()
          .mockReturnValue(JSON.stringify({ test: srcFilename })),
      });
    }
  );
});

afterEach(() => {
  memoryCache.reset();
  jest.resetAllMocks();
});

/**
 * Parses and returns the first line of the JSONLines fixture,
 * for use as a proxy for correct filesystem data fetching
 */
function getFirstRecordFromFixture(metricName) {
  const lineReader = new ReadLines(
    path.resolve(__dirname, `./demo_data/${metricName}.json`)
  );
  return JSON.parse(lineReader.next().toString());
}

/**
 * Freezes metric names and returns a callback that verifies them
 * against a mock GCS client implementation.
 */
function getGCSCallback(metricNames, done) {
  const frozenNames = [...metricNames];
  return (err, response) => {
    try {
      frozenNames.forEach((metricName) => {
        expect(response[metricName]).toEqual([{ test: `${metricName}.json` }]);
      });
      if (done) done();
    } catch (e) {
      if (done) done(e);
    }
  };
}

/**
 * Freezes metric names and returns a callback that verifies them
 * against demo_data fixtures.
 */
function getFsCallback(metricNames, done) {
  const frozenNames = [...metricNames];
  return (err, response) => {
    try {
      frozenNames.forEach((metricName) => {
        expect(response[metricName]).toContainEqual(
          getFirstRecordFromFixture(metricName)
        );
      });
      if (done) done();
    } catch (e) {
      if (done) done(e);
    }
  };
}

const paroleMetrics = [
  "supervision_population_by_district_by_demographics",
  "supervision_population_by_month_by_demographics",
  "supervision_revocations_by_period_by_type_by_demographics",
  "supervision_success_by_month",
  "supervision_success_by_period_by_demographics",
];

test.each([["GCS"], ["filesystem"]])(
  "fetches parole files from %s",
  (source, done) => {
    expect.hasAssertions();

    let isDemo;
    let callback;

    if (source === "GCS") {
      isDemo = false;
      callback = getGCSCallback(paroleMetrics, done);
    } else if (source === "filesystem") {
      isDemo = true;
      callback = getFsCallback(paroleMetrics, done);
    }

    fetchParoleMetrics(isDemo, "test_id", callback);
  }
);

test.each([["GCS"], ["filesystem"]])(
  "fetches metrics by name from %s",
  async (source) => {
    expect.hasAssertions();

    let isDemo;
    let callbackGetter;

    if (source === "GCS") {
      isDemo = false;
      callbackGetter = getGCSCallback;
    } else if (source === "filesystem") {
      isDemo = true;
      callbackGetter = getFsCallback;
    }

    const singleName = ["recidivism_rates_by_cohort_by_year"];
    await fetchMetricsByName(
      "test_id",
      singleName,
      isDemo,
      // withholding "done" to avoid prematurely ending the test
      callbackGetter(singleName)
    );

    // (these are not all in the same metric group as defined by other fetch functions)
    const multipleNames = [
      "incarceration_releases_by_type_by_period",
      "supervision_success_by_month",
      "racial_disparities",
    ];
    await fetchMetricsByName(
      "test_id",
      multipleNames,
      isDemo,
      callbackGetter(multipleNames)
    );

    const namesWithInvalidMember = [
      "recidivism_rates_by_cohort_by_year",
      "this_file_does_not_exist",
    ];

    await expect(async () => {
      await fetchMetricsByName(
        "test_id",
        namesWithInvalidMember,
        isDemo,
        callbackGetter(namesWithInvalidMember)
      );
    }).rejects.toThrow("not registered");
  }
);
