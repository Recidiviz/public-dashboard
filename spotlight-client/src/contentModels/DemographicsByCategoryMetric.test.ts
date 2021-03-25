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

import fetchMock from "jest-fetch-mock";
import { runInAction, when } from "mobx";
import { DemographicView } from "../demographics";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import DemographicsByCategoryMetric from "./DemographicsByCategoryMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetricId = "PrisonReleaseTypeAggregate";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as DemographicsByCategoryMetric;
}

test("total data", async () => {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => Boolean(metric.dataSeries));

  reactImmediately(() => {
    expect(metric.dataSeries).toMatchSnapshot();
  });

  expect.hasAssertions();
});

test.each([["raceOrEthnicity"], ["gender"], ["ageBucket"]] as [
  Exclude<DemographicView, "nofilter">
][])("%s data", async (demographicView) => {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => Boolean(metric.dataSeries));

  runInAction(() => {
    metric.demographicView = demographicView;
  });

  reactImmediately(() => {
    expect(metric.dataSeries).toMatchSnapshot();
  });

  expect.hasAssertions();
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

  // mock unknowns in response
  fetchMock.mockOnce(
    JSON.stringify({
      incarceration_releases_by_type_by_period: [
        {
          state_code: "US_ND",
          gender: "ALL",
          age_bucket: "ALL",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          total_release_count: "25",
          external_transfer_count: "5",
          sentence_completion_count: "0",
          parole_count: "10",
          probation_count: "5",
          death_count: "5",
          metric_period_months: "36",
        },
        {
          state_code: "US_ND",
          gender: "ALL",
          age_bucket: "EXTERNAL_UNKNOWN",
          race_or_ethnicity: "ALL",
          total_release_count: "1",
          external_transfer_count: "0",
          sentence_completion_count: "0",
          parole_count: "1",
          probation_count: "0",
          death_count: "0",
          metric_period_months: "36",
        },
      ],
    })
  );

  metric.hydrate();

  when(
    () => metric.unknowns !== undefined,
    () => {
      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 25,
        gender: 0,
        ageBucket: 1,
      });
      done();
    }
  );
});
