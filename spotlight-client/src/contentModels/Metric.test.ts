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

import { csvParse } from "d3-dsv";
import { formatISO } from "date-fns";
import downloadjs from "downloadjs";
import { advanceTo, clear } from "jest-date-mock";
import fetchMock from "jest-fetch-mock";
import JsZip from "jszip";
import { when } from "mobx";
import { fromPromise } from "mobx-utils";
import { stripHtml } from "string-strip-html";
import allTestContent from "./__fixtures__/tenant_content_exhaustive";
import { MetricTypeId, MetricTypeIdList } from "../contentApi/types";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";

jest.mock("downloadjs");
const downloadjsMock = downloadjs as jest.MockedFunction<typeof downloadjs>;

const testTenantId = "US_ND";
const testMetadataMapping = allTestContent.metrics;

const getTestMapping = () =>
  createMetricMapping({
    localityLabelMapping: allTestContent.localities,
    metadataMapping: testMetadataMapping,
    topologyMapping: allTestContent.topologies,
    tenantId: testTenantId,
  });

let testMetricMapping: ReturnType<typeof createMetricMapping>;

function getTestMetric(testMetricId: MetricTypeId) {
  const metric = testMetricMapping.get(testMetricId);

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
    expect(metric.methodology).toBe(testMetadata.methodology);
  });
});

describe("data fetching", () => {
  beforeAll(() => {
    // most recent month present in fixture
    advanceTo(new Date(2020, 7, 15));
    testMetricMapping = getTestMapping();
  });

  afterAll(() => {
    clear();
  });

  test.each(
    MetricTypeIdList.filter(
      (id) =>
        // the `records` property is not supported for these metric types
        ![
          "ProbationSuccessHistorical",
          "ParoleSuccessHistorical",
          "ParoleTerminationsHistorical",
        ].includes(id)
    )
  )("for metric %s", (metricId, done) => {
    expect.hasAssertions();
    const metric = getTestMetric(metricId);

    metric.hydrate();

    when(
      () => metric.records !== undefined,
      () => {
        // Be advised, these snapshots are huge! However, the only expected failure cases here are:
        // 1. you intentionally changed the contents of the fixture in spotlight-api
        // 2. you intentionally changed the record format for this Metric type
        // 3. you intentionally changed the default filtering or sorting options for this Metric type
        // Be especially careful inspecting snapshots for Metrics that filter their sources,
        // e.g. Parole/Probation metrics. Verify that they use the right rows!
        expect(metric.records).toMatchSnapshot();
        // @ts-expect-error typedefs for `test.each` are wrong, `done` will be a function
        done();
      }
    );
  });
});

test("file loading state", (done) => {
  testMetricMapping = getTestMapping();
  // not really necessary to test this once per type; we just pick one arbitrarily
  const metric = getTestMetric("PrisonReleaseTypeAggregate");

  let dataPromise: ReturnType<typeof fromPromise>;

  // this should be the initial state of the metric instance
  when(
    () => metric.isLoading === undefined,
    () => {
      expect(metric.records).toBeUndefined();
      // the fetch is initiated here; this will trigger the reactions below
      dataPromise = fromPromise(metric.hydrate());
    }
  );

  when(
    () => dataPromise.state === "pending",
    () => {
      expect(metric.isLoading).toBe(true);
      expect(metric.records).toBeUndefined();
    }
  );

  when(
    () => dataPromise.state === "fulfilled",
    () => {
      expect(metric.isLoading).toBe(false);
      expect(metric.records).toBeDefined();
      done();
    }
  );

  expect.assertions(5);
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

  await metric.hydrate();

  reactImmediately(() => {
    expect(metric.error?.message).toBe(
      "Metrics API responded with status 500. Error message: test error message"
    );
  });

  expect.hasAssertions();

  fetchMock.resetMocks();
  // return the mock to its default inactive state
  fetchMock.dontMock();
});

describe("data download", () => {
  beforeAll(() => {
    // most recent month present in fixture
    advanceTo(new Date(2020, 7, 15));
    testMetricMapping = getTestMapping();
  });

  afterAll(() => {
    clear();
  });

  afterEach(() => {
    downloadjsMock.mockReset();
  });

  test.each(
    MetricTypeIdList.filter(
      (id) =>
        // these metric types have multiple data sources, so the files they download will be different;
        // see SupervisionSuccessRateMetric tests for coverage
        ![
          "ProbationSuccessHistorical",
          "ParoleSuccessHistorical",
          "ParoleTerminationsHistorical",
        ].includes(id)
    )
  )("for metric %s", async (metricId, done) => {
    const metric = getTestMetric(metricId);
    metric.hydrate();

    await metric.download();

    expect(downloadjsMock).toHaveBeenCalled();

    const [content, filename] = downloadjsMock.mock.calls[0];

    const zipPrefix = `${testTenantId} ${metricId} data`;
    expect(filename).toBe(`${zipPrefix}.zip`);

    // if we read the data in the zip file we should be able to reverse it
    // into something resembling metric.allRecords; we will spot-check
    // the downloaded file by verifying that the first record matches the source
    const zip = await JsZip.loadAsync(content);
    const readmeContents = await zip
      .file(`${zipPrefix}/README.txt`)
      ?.async("string");
    const csvContents = await zip
      .file(`${zipPrefix}/data.csv`)
      ?.async("string");

    reactImmediately(() => {
      if (csvContents && readmeContents) {
        const recordsFromCsv = csvParse(csvContents);

        // rather than try to re-typecast the CSV data,
        // we'll cast the real record value to strings for comparison
        const expectedRecord: Record<string, string> = {};

        // in practice, recordsUnfiltered should not be undefined once we've gotten this far
        Object.entries((metric.recordsUnfiltered || [])[0]).forEach(
          ([key, value]) => {
            let valueAsString = String(value);
            if (value instanceof Date) {
              // how the underlying CSV conversion function handles dates
              // (https://github.com/d3/d3-dsv#dsv_format)
              valueAsString = formatISO(value, { representation: "date" });
            }

            expectedRecord[key] = valueAsString;
          }
        );

        expect(recordsFromCsv[0]).toEqual(expectedRecord);

        // the file in the archive is plain text but methodology can contain HTML tags
        expect(readmeContents).toBe(
          stripHtml(metric.methodology).result.replace(/\s+/g, " ")
        );

        // @ts-expect-error typedefs for `test.each` are wrong, `done` will be a function
        done();
      }
    });
  });

  describe("demographic categories", () => {
    test("default", () => {
      testMetricMapping = getTestMapping();

      // arbitrary choice, they should all be the same
      const metric = getTestMetric("PrisonPopulationCurrent");

      expect(
        metric.getDemographicCategories("raceOrEthnicity")
      ).toMatchSnapshot();
    });

    test("customized", () => {
      createMetricMapping({
        localityLabelMapping: allTestContent.localities,
        metadataMapping: testMetadataMapping,
        topologyMapping: allTestContent.topologies,
        demographicFilter: allTestContent.demographicCategories,
        tenantId: testTenantId,
      });

      const metric = createMetricMapping({
        localityLabelMapping: allTestContent.localities,
        metadataMapping: testMetadataMapping,
        topologyMapping: allTestContent.topologies,
        demographicFilter: allTestContent.demographicCategories,
        tenantId: testTenantId,
        // arbitrary choice, they should all be the same
      }).get("PrisonPopulationCurrent");

      expect(
        metric?.getDemographicCategories("raceOrEthnicity")
      ).toMatchSnapshot();
    });
  });
});
