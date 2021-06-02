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
import { runInAction, when } from "mobx";
import {
  createDemographicCategories,
  DemographicViewList,
  getDemographicCategoriesForView,
} from "../demographics";
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
        const categories = getDemographicCategoriesForView(
          demographicView,
          createDemographicCategories()
        );
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

          // records are sorted and span 240 months
          expect(series[0].date).toEqual(new Date(2000, 10, 1));
          expect(series[series.length - 1].date).toEqual(new Date(2020, 9, 1));
        });
      }
    });
  });

  expect.hasAssertions();
});

test("no unknowns", async () => {
  const metric = await getMetric();

  reactImmediately(() => {
    expect(metric.unknowns).toBeUndefined();
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
