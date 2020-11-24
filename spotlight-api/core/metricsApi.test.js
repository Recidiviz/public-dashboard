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

const {
  getFirstRecordFromFixture,
  expectedMetricsByGroup,
} = require("../testUtils");
const {
  fetchMetricsByName,
  fetchParoleMetrics,
  fetchPrisonMetrics,
  fetchProbationMetrics,
  fetchRaceMetrics,
  fetchSentencingMetrics,
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
          getFirstRecordFromFixture(`${metricName}.json`)
        );
      });
      if (done) done();
    } catch (e) {
      if (done) done(e);
    }
  };
}

const fileGroupMatrix = [
  [fetchParoleMetrics, "GCS", expectedMetricsByGroup.parole],
  [fetchParoleMetrics, "filesystem", expectedMetricsByGroup.parole],
  [fetchPrisonMetrics, "GCS", expectedMetricsByGroup.prison],
  [fetchPrisonMetrics, "filesystem", expectedMetricsByGroup.prison],
  [fetchProbationMetrics, "GCS", expectedMetricsByGroup.probation],
  [fetchProbationMetrics, "filesystem", expectedMetricsByGroup.probation],
  [fetchSentencingMetrics, "GCS", expectedMetricsByGroup.sentencing],
  [fetchSentencingMetrics, "filesystem", expectedMetricsByGroup.sentencing],
  [fetchRaceMetrics, "GCS", expectedMetricsByGroup.race],
  [fetchRaceMetrics, "filesystem", expectedMetricsByGroup.race],
];

test.each(fileGroupMatrix)(
  "%p fetches files from %s",
  (testFn, source, metricsList, done) => {
    expect.hasAssertions();

    let isDemo;
    let callback;

    if (source === "GCS") {
      isDemo = false;
      callback = getGCSCallback(metricsList, done);
    } else if (source === "filesystem") {
      isDemo = true;
      callback = getFsCallback(metricsList, done);
    }

    testFn(isDemo, "test_id", callback);
  }
);

test.each(["GCS", "filesystem"])(
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
