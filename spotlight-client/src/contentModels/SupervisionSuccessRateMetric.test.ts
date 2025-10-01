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

import { csvParse } from "d3-dsv";
import downloadjs from "downloadjs";
import { advanceTo, clear } from "jest-date-mock";
import JsZip from "jszip";
import { runInAction, when } from "mobx";
import { stripHtml } from "string-strip-html";
import {
  fetchAndTransformMetric,
  SupervisionSuccessRateMonthlyRecord,
} from "../metricsApi";
import { reactImmediately } from "../testUtils";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";
import createMetricMapping from "./createMetricMapping";
import SupervisionSuccessRateMetric from "./SupervisionSuccessRateMetric";

jest.mock("../metricsApi", () => {
  const actualModule = jest.requireActual("../metricsApi");
  const mockFetch = jest.fn(actualModule.fetchAndTransformMetric);
  return { ...actualModule, fetchAndTransformMetric: mockFetch };
});

const mockedFetchAndTransformMetric = fetchAndTransformMetric as jest.MockedFunction<
  typeof fetchAndTransformMetric
>;

jest.mock("downloadjs");
const downloadjsMock = downloadjs as jest.MockedFunction<typeof downloadjs>;

const testTenantId = "US_ND";
const testMetricId = "ProbationTerminationsHistorical";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
    demographicFilter: contentFixture.demographicCategories,
  }).get(testMetricId) as SupervisionSuccessRateMetric;
}

async function getPopulatedMetric() {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => !metric.isLoading && metric.error === undefined);

  return metric;
}

beforeEach(() => {
  // last month in data fixture
  advanceTo(new Date(2020, 6, 2));
});

afterEach(() => {
  clear();
});

describe("cohort data", () => {
  test("total", async () => {
    const metric = await getPopulatedMetric();

    reactImmediately(() => {
      expect(metric.cohortRecords).toMatchSnapshot();
      expect(metric.cohortRecords?.length).toBe(36);
    });

    expect.hasAssertions();
  });

  test("filtered by locality", async () => {
    const metric = await getPopulatedMetric();

    runInAction(() => {
      metric.localityId = contentFixture.localities.Probation.entries[0].id;
    });

    reactImmediately(() => {
      expect(metric.cohortRecords).toMatchSnapshot();
    });

    expect.hasAssertions();
  });

  test("not filtered by demographics", async () => {
    const metric = await getPopulatedMetric();
    const initialCohortRecords: typeof metric.cohortRecords = [];

    reactImmediately(() => {
      const totalRecords = metric.cohortRecords;
      if (totalRecords && totalRecords.length) {
        initialCohortRecords.push(...totalRecords);
      }
      expect(initialCohortRecords.length).toBeGreaterThan(0);
    });

    runInAction(() => {
      metric.demographicView = "raceOrEthnicity";
    });

    reactImmediately(() => {
      expect(metric.cohortRecords).toEqual(initialCohortRecords);
    });

    expect.hasAssertions();
  });

  test("imputes missing cohorts", async () => {
    mockedFetchAndTransformMetric.mockResolvedValueOnce([
      {
        year: 2019,
        month: 9,
        district: "ALL",
        rateNumerator: 2,
        rateDenominator: 2,
        rate: 1,
      },
    ]);

    const metric = await getPopulatedMetric();

    reactImmediately(() => {
      const cohortRecords = metric.cohortRecords as SupervisionSuccessRateMonthlyRecord[];
      expect(cohortRecords.length).toEqual(36);
      cohortRecords.forEach((record) => {
        if (record.year !== 2019 && record.month !== 9)
          expect(record).toEqual(
            expect.objectContaining({
              rate: 0,
              rateDenominator: 0,
              rateNumerator: 0,
            })
          );
      });

      // does not include current month, as set via jest date mock
      expect(cohortRecords).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ year: 2020, month: 7 }),
        ])
      );
      // as a result, the start should be shifted back a month
      expect(cohortRecords).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ year: 2017, month: 7 }),
        ])
      );
    });

    expect.hasAssertions();
  });

  test("imputes missing cohorts with current month", async () => {
    mockedFetchAndTransformMetric.mockResolvedValueOnce([
      {
        year: 2020,
        month: 7,
        district: "ALL",
        rateNumerator: 2,
        rateDenominator: 2,
        rate: 1,
      },
    ]);

    const metric = await getPopulatedMetric();

    reactImmediately(() => {
      const cohortRecords = metric.cohortRecords as SupervisionSuccessRateMonthlyRecord[];
      expect(cohortRecords.length).toEqual(36);
      cohortRecords.forEach((record) => {
        if (record.year !== 2020 && record.month !== 7)
          expect(record).toEqual(
            expect.objectContaining({
              rate: 0,
              rateDenominator: 0,
              rateNumerator: 0,
            })
          );
      });
      // includes current month, as set via jest date mock
      expect(cohortRecords).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ year: 2020, month: 7 }),
        ])
      );
      // as a result, the start is shifted forward a month
      expect(cohortRecords).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ year: 2017, month: 7 }),
        ])
      );
    });

    expect.hasAssertions();
  });
});

// This whole test suite fails because of this section. See the issue #589
//
// describe("demographic data", () => {
//   test("total", async () => {
//     const metric = await getPopulatedMetric();

//     reactImmediately(() => {
//       expect(metric.demographicRecords).toMatchSnapshot();
//     });

//     expect.hasAssertions();
//   });

//   test("filtered by locality", async () => {
//     const metric = await getPopulatedMetric();

//     runInAction(() => {
//       metric.localityId = contentFixture.localities.Probation.entries[0].id;
//     });

//     reactImmediately(() => {
//       expect(metric.demographicRecords).toMatchSnapshot();
//     });

//     expect.hasAssertions();
//   });

//   test.each([["raceOrEthnicity"], ["gender"], ["ageBucket"]] as [
//     Exclude<DemographicView, "nofilter">
//   ][])("%s data", async (demographicView) => {
//     const metric = await getPopulatedMetric();

//     runInAction(() => {
//       metric.demographicView = demographicView;
//     });

//     reactImmediately(() => {
//       expect(metric.demographicRecords).toMatchSnapshot();
//     });

//     expect.hasAssertions();
//   });
// });

test("data download", async (done) => {
  expect.hasAssertions();
  const metric = await getPopulatedMetric();

  await metric.download();

  expect(downloadjsMock).toHaveBeenCalled();

  const [content, filename] = downloadjsMock.mock.calls[0];
  const prefix = `${testTenantId} ${testMetricId} data`;
  expect(filename).toBe(`${prefix}.zip`);

  // if we read the data in the zip file we should be able to reverse it
  // into something resembling metric.allRecords; we will spot-check
  // the downloaded file by verifying that the first record matches the source
  const zip = await JsZip.loadAsync(content);
  reactImmediately(async () => {
    // expecting two files and their respective data sources
    const expectedFiles = [
      {
        name: `${prefix}/historical data.csv`,
        source: metric.allCohortRecords,
      },
      {
        name: `${prefix}/demographic aggregate data.csv`,
        source: metric.allDemographicRecords,
      },
    ];

    await Promise.all(
      expectedFiles.map(async ({ name, source }) => {
        const csvContents = await zip.file(name)?.async("string");

        if (csvContents) {
          const recordsFromCsv = csvParse(csvContents);

          // rather than try to re-typecast the CSV data,
          // we'll cast the real record value to strings for comparison
          const expectedRecord: Record<string, string> = {};

          // in practice, source should not be undefined once we've gotten this far
          Object.entries((source || [])[0]).forEach(([key, value]) => {
            expectedRecord[key] = String(value);
          });
          expect(recordsFromCsv[0]).toEqual(expectedRecord);
        } else {
          throw new Error("unable to retrieve CSV data from zip file");
        }
      })
    );

    const readmeContents = await zip
      .file(`${prefix}/README.txt`)
      ?.async("string");
    // the file in the archive is plain text but methodology can contain HTML tags
    expect(readmeContents).toBe(stripHtml(metric.methodology).result);

    done();
  });
});

test("no unknowns", async () => {
  const metric = getTestMetric();
  await metric.hydrate();

  reactImmediately(() => {
    expect(metric.unknowns).toBeUndefined();
  });

  expect.hasAssertions();
});

test("report unknowns", (done) => {
  const metric = getTestMetric();

  // cohort data, which we don't care about here
  mockedFetchAndTransformMetric.mockResolvedValueOnce([]);
  // demographic data
  mockedFetchAndTransformMetric.mockResolvedValueOnce([
    {
      locality: "ALL",
      raceOrEthnicity: "ALL",
      gender: "ALL",
      ageBucket: "EXTERNAL_UNKNOWN",
      rateNumerator: 1,
      rateDenominator: 2,
      rate: 0.5,
    },
    {
      locality: "test1",
      raceOrEthnicity: "ALL",
      gender: "ALL",
      ageBucket: "EXTERNAL_UNKNOWN",
      rateNumerator: 0,
      rateDenominator: 1,
      rate: 0,
    },
    {
      locality: "test2",
      raceOrEthnicity: "ALL",
      gender: "ALL",
      ageBucket: "EXTERNAL_UNKNOWN",
      rateNumerator: 1,
      rateDenominator: 1,
      rate: 1,
    },
  ]);

  metric.hydrate();

  when(
    () => metric.unknowns !== undefined,
    () => {
      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 0,
        gender: 0,
        ageBucket: 2,
      });

      runInAction(() => {
        metric.localityId = "test1";
      });
      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 0,
        gender: 0,
        ageBucket: 1,
      });

      // this filter should be ignored
      runInAction(() => {
        metric.demographicView = "raceOrEthnicity";
      });
      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 0,
        gender: 0,
        ageBucket: 1,
      });
      done();
    }
  );
});
