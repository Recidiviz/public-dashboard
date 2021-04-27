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
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import PopulationBreakdownByLocationMetric from "./PopulationBreakdownByLocationMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetricId = "PrisonPopulationCurrent";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
    demographicFilter: contentFixture.demographicCategories,
  }).get(testMetricId) as PopulationBreakdownByLocationMetric;
}

test("locality filter", async () => {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => metric.records !== undefined);

  reactImmediately(() =>
    expect(metric.records?.every((record) => record.locality === "ALL")).toBe(
      true
    )
  );

  const facilityId = contentFixture.localities.Prison.entries[1].id;

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

test("demographic data series", async () => {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => Boolean(metric.dataSeries));

  reactImmediately(() => {
    expect(metric.dataSeries).toMatchSnapshot();
  });

  expect.hasAssertions();
});

test("total population", async () => {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => Boolean(metric.records));

  reactImmediately(() => expect(metric.totalPopulation).toBe(2041));

  const facilityId = contentFixture.localities.Prison.entries[1].id;

  runInAction(() => {
    metric.localityId = facilityId;
  });

  reactImmediately(() => expect(metric.totalPopulation).toBe(413));

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

test("report unknowns for current locality", (done) => {
  const metric = getTestMetric();

  // mock unknowns in response
  fetchMock.mockOnce(
    JSON.stringify({
      incarceration_population_by_facility_by_demographics: [
        {
          state_code: "US_ND",
          date_of_stay: "2020-07-23",
          facility: "ALL",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          gender: "ALL",
          age_bucket: "ALL",
          total_population: "25",
        },
        {
          state_code: "US_ND",
          date_of_stay: "2020-07-23",
          facility: "test1",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          gender: "ALL",
          age_bucket: "ALL",
          total_population: "20",
        },
        {
          state_code: "US_ND",
          date_of_stay: "2020-07-23",
          facility: "test2",
          race_or_ethnicity: "EXTERNAL_UNKNOWN",
          gender: "ALL",
          age_bucket: "ALL",
          total_population: "5",
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
        ageBucket: 0,
      });

      runInAction(() => {
        metric.localityId = "test2";
      });

      expect(metric.unknowns).toEqual({
        raceOrEthnicity: 5,
        gender: 0,
        ageBucket: 0,
      });
      done();
    }
  );
});
