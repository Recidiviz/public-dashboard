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
import SentenceTypeByLocationMetric from "./SentenceTypeByLocationMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetricId = "SentenceTypesCurrent";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as SentenceTypeByLocationMetric;
}

async function getPopulatedMetric() {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => Boolean(metric.records));

  return metric;
}

test("total data", async () => {
  const metric = await getPopulatedMetric();

  reactImmediately(() => {
    expect(metric.dataGraph).toMatchSnapshot();
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
    expect(metric.dataGraph).toMatchSnapshot();
  });

  expect.hasAssertions();
});

test("locality filter", async () => {
  const metric = await getPopulatedMetric();

  reactImmediately(() =>
    expect(metric.records?.every((record) => record.locality === "ALL")).toBe(
      true
    )
  );

  const facilityId = contentFixture.localities.Sentencing.entries[1].id;

  runInAction(() => {
    metric.localityId = facilityId;
  });

  reactImmediately(() => {
    expect(metric.records?.length).toBeGreaterThan(0);
    expect(
      metric.records?.every((record) => record.locality === facilityId)
    ).toBe(true);
  });

  expect.hasAssertions();
});

test("report unknowns for current locality", (done) => {
  const metric = getTestMetric();

  // mock unknowns in response
  fetchMock.mockOnce(
    JSON.stringify({
      sentence_type_by_district_by_demographics: [
        {
          district: "ALL",
          gender: "ALL",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          state_code: "US_ND",
          age_bucket: "ALL",
          incarceration_count: "8",
          probation_count: "0",
          total_population_count: "10",
          dual_sentence_count: "2",
        },
        {
          district: "ALL",
          gender: "EXTERNAL_UNKNOWN",
          race_or_ethnicity: "ALL",
          state_code: "US_ND",
          age_bucket: "ALL",
          incarceration_count: "4",
          probation_count: "12",
          total_population_count: "20",
          dual_sentence_count: "4",
        },
        {
          district: "ALL",
          gender: "ALL",
          race_or_ethnicity: "ALL",
          state_code: "US_ND",
          age_bucket: "EXTERNAL_UNKNOWN",
          incarceration_count: "29",
          probation_count: "1",
          total_population_count: "30",
          dual_sentence_count: "0",
        },
        {
          district: "test2",
          gender: "ALL",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          state_code: "US_ND",
          age_bucket: "ALL",
          incarceration_count: "8",
          probation_count: "0",
          total_population_count: "10",
          dual_sentence_count: "2",
        },
        {
          district: "test2",
          gender: "EXTERNAL_UNKNOWN",
          race_or_ethnicity: "ALL",
          state_code: "US_ND",
          age_bucket: "ALL",
          incarceration_count: "0",
          probation_count: "0",
          total_population_count: "0",
          dual_sentence_count: "0",
        },
        {
          district: "test2",
          gender: "ALL",
          race_or_ethnicity: "ALL",
          state_code: "US_ND",
          age_bucket: "EXTERNAL_UNKNOWN",
          incarceration_count: "3",
          probation_count: "2",
          total_population_count: "5",
          dual_sentence_count: "0",
        },
      ],
    })
  );

  metric.hydrate();

  when(
    () => metric.unknowns !== undefined,
    () => {
      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 10,
        gender: 20,
        ageBucket: 30,
      });

      runInAction(() => {
        metric.localityId = "test2";
      });

      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 10,
        gender: 0,
        ageBucket: 5,
      });

      // this filter should be ignored
      runInAction(() => {
        metric.demographicView = "gender";
      });

      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 10,
        gender: 0,
        ageBucket: 5,
      });
      done();
    }
  );
});
