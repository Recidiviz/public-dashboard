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

import { advanceTo, clear } from "jest-date-mock";
import { runInAction, when } from "mobx";
import { DemographicView } from "../demographics";
import {
  fetchMetrics,
  SupervisionSuccessRateMonthlyRecord,
} from "../metricsApi";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import SupervisionSuccessRateMetric from "./SupervisionSuccessRateMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

jest.mock("../metricsApi", () => {
  const actualModule = jest.requireActual("../metricsApi");
  const mockFetch = jest.fn(actualModule.fetchMetrics);
  return { ...actualModule, fetchMetrics: mockFetch };
});

const mockedFetchMetrics = fetchMetrics as jest.MockedFunction<
  typeof fetchMetrics
>;

const testTenantId = "US_ND";
const testMetricId = "ProbationSuccessHistorical";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as SupervisionSuccessRateMetric;
}

async function getPopulatedMetric() {
  const metric = getTestMetric();

  metric.populateAllRecords();

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
    mockedFetchMetrics.mockResolvedValueOnce({
      supervision_success_by_month: [
        {
          state_code: "US_ND",
          projected_year: "2019",
          projected_month: "9",
          district: "ALL",
          supervision_type: "PROBATION",
          successful_termination_count: "2",
          projected_completion_count: "2",
          success_rate: "1.0",
        },
      ],
      supervision_success_by_period_by_demographics: [],
    });

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
    mockedFetchMetrics.mockResolvedValueOnce({
      supervision_success_by_month: [
        {
          state_code: "US_ND",
          projected_year: "2020",
          projected_month: "7",
          district: "ALL",
          supervision_type: "PROBATION",
          successful_termination_count: "2",
          projected_completion_count: "2",
          success_rate: "1.0",
        },
      ],
      supervision_success_by_period_by_demographics: [],
    });

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

describe("demographic data", () => {
  test("total", async () => {
    const metric = await getPopulatedMetric();

    reactImmediately(() => {
      expect(metric.demographicRecords).toMatchSnapshot();
    });

    expect.hasAssertions();
  });

  test("filtered by locality", async () => {
    const metric = await getPopulatedMetric();

    runInAction(() => {
      metric.localityId = contentFixture.localities.Probation.entries[0].id;
    });

    reactImmediately(() => {
      expect(metric.demographicRecords).toMatchSnapshot();
    });

    expect.hasAssertions();
  });

  test.each([["raceOrEthnicity"], ["gender"], ["ageBucket"]] as [
    Exclude<DemographicView, "nofilter">
  ][])("%s data", async (demographicView) => {
    const metric = await getPopulatedMetric();

    runInAction(() => {
      metric.demographicView = demographicView;
    });

    reactImmediately(() => {
      expect(metric.demographicRecords).toMatchSnapshot();
    });

    expect.hasAssertions();
  });
});
