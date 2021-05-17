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

import { runInAction, when } from "mobx";
import { MetricTypeId } from "../contentApi/types";
import { DemographicView } from "../demographics";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import RecidivismRateMetric from "./RecidivismRateMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetadataMapping = contentFixture.metrics;

function getTestMetric(id: MetricTypeId) {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: {
      PrisonRecidivismRateHistorical:
        testMetadataMapping.PrisonRecidivismRateHistorical,
      PrisonRecidivismRateSingleFollowupHistorical:
        testMetadataMapping.PrisonRecidivismRateSingleFollowupHistorical,
    },
    tenantId: testTenantId,
    demographicFilter: contentFixture.demographicCategories,
  }).get(id) as RecidivismRateMetric;
}

async function getPopulatedMetric(id: MetricTypeId) {
  const metric = getTestMetric(id);

  metric.hydrate();

  await when(() => Boolean(metric.records));

  return metric;
}

describe("single followup period", () => {
  const testMetricId = "PrisonRecidivismRateSingleFollowupHistorical";

  test("total data", async () => {
    const metric = await getPopulatedMetric(testMetricId);

    reactImmediately(() => {
      expect(metric.singleFollowupDemographics).toMatchSnapshot();
    });

    expect.hasAssertions();
  });

  test.each([["raceOrEthnicity"], ["gender"], ["ageBucket"]] as [
    Exclude<DemographicView, "nofilter">
  ][])("%s data", async (demographicView) => {
    const metric = await getPopulatedMetric(testMetricId);

    runInAction(() => {
      metric.demographicView = demographicView;
    });

    reactImmediately(() => {
      expect(metric.singleFollowupDemographics).toMatchSnapshot();
    });

    expect.hasAssertions();
  });
});

describe("cohorts data series", () => {
  let metric: RecidivismRateMetric;

  const testMetricId = "PrisonRecidivismRateHistorical";

  afterEach(() => {
    metric.setSelectedCohorts(undefined);
  });

  test("all cohorts", async () => {
    metric = await getPopulatedMetric(testMetricId);

    reactImmediately(() => {
      expect(metric.cohortDataSeries).toMatchSnapshot();
    });

    expect.hasAssertions();
  });

  test("selected cohorts", async () => {
    metric = await getPopulatedMetric(testMetricId);

    metric.setSelectedCohorts([2017, 2018]);

    reactImmediately(() => {
      // this should be a subset of the all cohorts snapshot;
      // not only the records but also the series colors should be identical
      expect(metric.cohortDataSeries).toMatchSnapshot();
    });

    expect.hasAssertions();
  });

  test.each(["raceOrEthnicity", "gender", "ageBucket"] as const)(
    "single cohort with %s views",
    async (demographicView) => {
      metric = await getPopulatedMetric(testMetricId);

      metric.setSelectedCohorts([2017]);

      runInAction(() => {
        metric.demographicView = demographicView;
      });

      reactImmediately(() => {
        expect(metric.cohortDataSeries).toMatchSnapshot();
      });

      // reset demographics
      runInAction(() => {
        metric.demographicView = "total";
      });

      expect.hasAssertions();
    }
  );

  test("demographic view resets to total when multiple cohorts are selected", async () => {
    metric = await getPopulatedMetric(testMetricId);

    metric.setSelectedCohorts([2017]);

    runInAction(() => {
      metric.demographicView = "gender";
    });

    metric.setSelectedCohorts([2017, 2018]);

    reactImmediately(() => {
      expect(metric.demographicView).toBe("total");
    });

    expect.hasAssertions();
  });

  test("selection includes highlighted cohort", async () => {
    metric = await getPopulatedMetric(testMetricId);

    metric.setSelectedCohorts([2017]);

    metric.setHighlightedCohort({ label: "2018" });

    reactImmediately(() => {
      expect(metric.cohortDataSeries?.length).toBe(2);
    });

    expect.hasAssertions();
  });
});

test("no unknowns", async () => {
  const metric = await getPopulatedMetric("PrisonRecidivismRateHistorical");

  reactImmediately(() => {
    expect(metric.unknowns).toBeUndefined();
  });

  expect.hasAssertions();
});

test("report unknowns", async (done) => {
  // mock unknowns in response
  fetchMock.mockOnce(
    JSON.stringify({
      recidivism_rates_by_cohort_by_year: [
        {
          state_code: "US_DEMO",
          gender: "ALL",
          age_bucket: "ALL",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          releases: "10",
          release_cohort: "2018",
          followup_years: "1",
          recidivism_rate: "0.2",
          recidivated_releases: "2",
        },
        // counts are expected to be the same across followup periods;
        // this is here to make sure we aren't double-counting
        {
          state_code: "US_DEMO",
          gender: "ALL",
          age_bucket: "ALL",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          releases: "10",
          release_cohort: "2018",
          followup_years: "2",
          recidivism_rate: "0.3",
          recidivated_releases: "3",
        },
        {
          state_code: "US_DEMO",
          gender: "EXTERNAL_UNKNOWN",
          age_bucket: "ALL",
          race_or_ethnicity: "ALL",
          releases: "2",
          release_cohort: "2018",
          followup_years: "1",
          recidivism_rate: "0",
          recidivated_releases: "0",
        },
        {
          state_code: "US_DEMO",
          gender: "ALL",
          age_bucket: "EXTERNAL_UNKNOWN",
          race_or_ethnicity: "ALL",
          releases: "1",
          release_cohort: "2018",
          followup_years: "1",
          recidivism_rate: "1",
          recidivated_releases: "1",
        },
        {
          state_code: "US_DEMO",
          gender: "ALL",
          age_bucket: "ALL",
          race_or_ethnicity: "ALL",
          releases: "355",
          release_cohort: "2017",
          followup_years: "1",
          recidivism_rate: "0.2422535211",
          recidivated_releases: "86",
        },
      ],
    })
  );

  const metric = await getPopulatedMetric("PrisonRecidivismRateHistorical");

  when(
    () => metric.unknowns !== undefined,
    () => {
      expect(metric.unknowns).toEqual([
        {
          cohort: 2018,
          unknowns: {
            raceOrEthnicity: 10,
            gender: 2,
            ageBucket: 1,
          },
        },
      ]);
      done();
    }
  );
});

test("maxFollowupPeriod", async () => {
  fetchMock.mockOnce(
    JSON.stringify({
      recidivism_rates_by_cohort_by_year: [
        {
          state_code: "US_DEMO",
          gender: "ALL",
          age_bucket: "ALL",
          race_or_ethnicity: "ALL",
          releases: "10",
          release_cohort: "2018",
          followup_years: "1",
          recidivism_rate: "0.2",
          recidivated_releases: "2",
        },
        {
          state_code: "US_DEMO",
          gender: "ALL",
          age_bucket: "ALL",
          race_or_ethnicity: "ALL",
          releases: "10",
          release_cohort: "2018",
          followup_years: "3",
          recidivism_rate: "0.3",
          recidivated_releases: "3",
        },
      ],
    })
  );

  const metric = await getPopulatedMetric("PrisonRecidivismRateHistorical");

  reactImmediately(() => {
    expect(metric.maxFollowupPeriod).toBe(3);
  });

  expect.hasAssertions();
});
