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

import { isEqual } from "date-fns";
import { advanceTo, clear } from "jest-date-mock";
import { runInAction } from "mobx";
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_DATA_KEYS,
  DIMENSION_MAPPINGS,
} from "../demographics";
import {
  fetchMetrics,
  HistoricalPopulationBreakdownRecord,
  RawMetricData,
} from "../metricsApi";
import { reactImmediately } from "../testUtils";
import HistoricalPopulationBreakdownMetric from "./HistoricalPopulationBreakdownMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

jest.mock("../metricsApi", () => ({
  ...jest.requireActual("../metricsApi"),
  fetchMetrics: jest.fn(),
}));

// we're not actually going to use this
const mockResponseData: RawMetricData = [{ test: "whatever" }];
// this has ... considerably less than 20 years of data
const mockData: HistoricalPopulationBreakdownRecord[] = [
  // data for totals
  {
    date: new Date(2020, 9, 1),
    count: 55,
    raceOrEthnicity: "ALL",
    gender: "ALL",
    ageBucket: "ALL",
  },
  {
    date: new Date(2020, 7, 1),
    count: 45,
    raceOrEthnicity: "ALL",
    gender: "ALL",
    ageBucket: "ALL",
  },
  // data for various demographic categories is completely missing; it should handle that too
];
const datesPresent = mockData.map(({ date }) => date);
const imputedRecordBase = {
  raceOrEthnicity: "ALL",
  gender: "ALL",
  ageBucket: "ALL",
  count: 0,
};

const mockedFetchMetrics = fetchMetrics as jest.MockedFunction<
  typeof fetchMetrics
>;
const mockSourceFileName = "test_metric_response";
// we're taking a shortcut by creating test data that doesn't need to be transformed
const mockTransformer = () => [...mockData];

beforeEach(() => {
  mockedFetchMetrics.mockResolvedValue({
    [mockSourceFileName]: mockResponseData,
  });
});

afterEach(() => {
  clear();
});

const getMetric = async () => {
  const metric = new HistoricalPopulationBreakdownMetric({
    ...contentFixture.metrics.PrisonPopulationHistorical,
    tenantId: "US_ND",
    defaultDemographicView: "total",
    defaultLocalityId: undefined,
    dataTransformer: mockTransformer,
    sourceFileName: mockSourceFileName,
  });

  await metric.populateAllRecords();

  return metric;
};

test("fills in missing data", async () => {
  const metric = await getMetric();

  DIMENSION_MAPPINGS.forEach((categoryLabels, demographicView) => {
    runInAction(() => {
      metric.demographicView = demographicView;
    });

    reactImmediately(() => {
      const data = metric.dataSeries;
      if (data) {
        Array.from(categoryLabels.keys()).forEach((identifier, index) => {
          if (identifier === DEMOGRAPHIC_UNKNOWN) return;
          const series = data[index].coordinates;
          expect(series.length).toBe(240);

          const expectedRecordShape = { ...imputedRecordBase };
          if (demographicView !== "total") {
            const categoryKey = DIMENSION_DATA_KEYS[demographicView];
            expectedRecordShape[categoryKey] = identifier;
          }
          series.forEach((record) => {
            // separate imputed records from existing records
            if (
              demographicView === "total" &&
              datesPresent.some((presentDate) =>
                isEqual(presentDate, record.date)
              )
            ) {
              expect(mockData).toContainEqual(record);
            } else {
              expect(record).toEqual(
                expect.objectContaining(expectedRecordShape)
              );
            }
          });
        });
      }
    });
  });

  expect.hasAssertions();
});

test("imputed data does not include the current month", async () => {
  // later than most recent month present in the fixture
  advanceTo(new Date(2020, 11, 10));
  const currentMonth = new Date(2020, 11, 1);

  const metric = await getMetric();

  reactImmediately(() => {
    const currentMonthRecords = metric.records?.filter((record) =>
      isEqual(record.date, currentMonth)
    );

    expect(currentMonthRecords?.length).toBe(0);
  });
  expect.hasAssertions();
});

test("imputed data includes current month", async () => {
  // most recent month present in the fixture
  advanceTo(new Date(2020, 9, 10));
  const currentMonth = new Date(2020, 9, 1);

  const metric = await getMetric();

  reactImmediately(() => {
    const currentMonthRecords = metric.records?.filter((record) =>
      isEqual(record.date, currentMonth)
    );

    expect(currentMonthRecords?.length).toBe(1);
  });
  expect.hasAssertions();
});
