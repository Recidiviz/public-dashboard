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
import { runInAction, when } from "mobx";
import { DemographicViewList, getDemographicCategories } from "../demographics";
import {
  fetchAndTransformMetric,
  HistoricalPopulationBreakdownRecord,
} from "../metricsApi";
import { reactImmediately } from "../testUtils";
import HistoricalPopulationBreakdownMetric from "./HistoricalPopulationBreakdownMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

jest.mock("../metricsApi", () => ({
  ...jest.requireActual("../metricsApi"),
  fetchAndTransformMetric: jest.fn(),
}));

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

const mockedFetchAndTransformMetric = fetchAndTransformMetric as jest.MockedFunction<
  typeof fetchAndTransformMetric
>;
const mockSourceFileName = "test_metric_response";
// we are mocking this so it won't be called anyway
const mockTransformer = jest.fn();

beforeEach(() => {
  mockedFetchAndTransformMetric.mockResolvedValue([...mockData]);
});

afterEach(() => {
  clear();
});

const getMetric = async () => {
  const metric = new HistoricalPopulationBreakdownMetric({
    ...contentFixture.metrics.PrisonPopulationHistorical,
    id: "PrisonPopulationHistorical",
    tenantId: "US_ND",
    defaultDemographicView: "total",
    defaultLocalityId: undefined,
    localityLabels: undefined,
    dataTransformer: mockTransformer,
    sourceFileName: mockSourceFileName,
  });

  await metric.hydrate();

  return metric;
};

test("fills in missing data", async () => {
  const metric = await getMetric();

  DemographicViewList.forEach((demographicView) => {
    if (demographicView === "nofilter") return;

    runInAction(() => {
      metric.demographicView = demographicView;
    });

    reactImmediately(() => {
      const data = metric.dataSeries;
      if (data) {
        const categories = getDemographicCategories(demographicView);
        categories.forEach(({ identifier }, index) => {
          const series = data[index].coordinates;
          expect(series.length).toBe(240);

          const expectedRecordShape = { ...imputedRecordBase };
          if (demographicView !== "total") {
            expectedRecordShape[demographicView] = identifier;
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

    expect(metric.dataIncludesCurrentMonth).toBe(false);
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

    expect(metric.dataIncludesCurrentMonth).toBe(true);
  });
  expect.hasAssertions();
});

test("report unknowns", async (done) => {
  // mock unknowns in response
  mockedFetchAndTransformMetric.mockResolvedValue([
    {
      date: new Date(2020, 9, 1),
      count: 55,
      raceOrEthnicity: "ALL",
      gender: "EXTERNAL_UNKNOWN",
      ageBucket: "ALL",
    },
    {
      date: new Date(2020, 4, 1),
      count: 12,
      raceOrEthnicity: "ALL",
      gender: "ALL",
      ageBucket: "EXTERNAL_UNKNOWN",
    },
    {
      date: new Date(2020, 7, 1),
      count: 45,
      raceOrEthnicity: "ALL",
      gender: "EXTERNAL_UNKNOWN",
      ageBucket: "ALL",
    },
  ]);

  const metric = await getMetric();

  when(
    () => metric.unknowns !== undefined,
    () => {
      expect(metric.unknowns).toEqual([
        {
          date: new Date(2020, 4, 1),
          unknowns: {
            raceOrEthnicity: 0,
            gender: 0,
            ageBucket: 12,
          },
        },
        {
          date: new Date(2020, 7, 1),
          unknowns: {
            raceOrEthnicity: 0,
            gender: 45,
            ageBucket: 0,
          },
        },
        {
          date: new Date(2020, 9, 1),
          unknowns: {
            raceOrEthnicity: 0,
            gender: 55,
            ageBucket: 0,
          },
        },
      ]);
      done();
    }
  );
});
