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

import fetchMock from "jest-fetch-mock";
import { createMetric, MetricTypes } from "./Metric";

const metadataSource = {
  name: "test metric",
  description: "this is a test metric",
  methodology: "test methodology description",
};

afterEach(() => {
  fetchMock.resetMocks();
});

test("base metadata", () => {
  const metric = createMetric({
    metricType: MetricTypes.SentencePopulationCurrent,
    initOptions: metadataSource,
  });

  expect(metric.name).toBe(metadataSource.name);
  expect(metric.description).toBe(metadataSource.description);
  expect(metric.methodology).toBe(metadataSource.methodology);
});

test("fetches its data file", () => {
  const metric = createMetric({
    metricType: MetricTypes.SentencePopulationCurrent,
    initOptions: metadataSource,
  });

  metric.fetch();
  expect(fetchMock.mock.calls.length).toBe(1);
  const [requestUrl, config] = fetchMock.mock.calls[0];
  expect(requestUrl).toBe(`${process.env.REACT_APP_API_URL}/api/public`);
  if (typeof config?.body === "string") {
    expect(JSON.parse(config?.body)).toEqual({
      files: ["sentence_type_by_district_by_demographics.json"],
    });
  } else {
    throw new Error("unexpected request body type");
  }
});

test("file loading state", async () => {
  const metric = createMetric({
    metricType: MetricTypes.SentencePopulationCurrent,
    initOptions: metadataSource,
  });
  expect(metric.isLoading).toBe(true);

  fetchMock.once(
    JSON.stringify({ sentence_type_by_district_by_demographics: [] })
  );
  await metric.fetch();
  expect(metric.isLoading).toBe(false);
});

test.todo("fetch error state");

test("locality filter", async () => {
  const fileContents = [
    {
      district: "ALL",
      gender: "ALL",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "ALL",
      incarceration_count: "6193",
      probation_count: "3399",
      total_population_count: "11648",
      dual_sentence_count: "2056",
    },
    {
      district: "NORTHEAST",
      gender: "ALL",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "ALL",
      incarceration_count: "1318",
      probation_count: "722",
      total_population_count: "2478",
      dual_sentence_count: "438",
    },
    {
      district: "SOUTHEAST",
      gender: "ALL",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "ALL",
      incarceration_count: "689",
      probation_count: "378",
      total_population_count: "1296",
      dual_sentence_count: "229",
    },
  ];
  fetchMock.once(
    JSON.stringify({ sentence_type_by_district_by_demographics: fileContents })
  );

  const metric = createMetric({
    metricType: MetricTypes.SentencePopulationCurrent,
    initOptions: metadataSource,
  });

  await metric.fetch();
  // defaults to all localities
  expect(metric.records).toEqual([
    expect.objectContaining({ locality: fileContents[0].district }),
  ]);

  // set a filter
  metric.localityId = fileContents[1].district;
  expect(metric.records).toEqual([
    expect.objectContaining({ locality: fileContents[1].district }),
  ]);
});

test("demographic filter", async () => {
  const fileContents = [
    {
      district: "ALL",
      gender: "ALL",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "ALL",
      incarceration_count: "6193",
      probation_count: "3399",
      total_population_count: "11648",
      dual_sentence_count: "2056",
    },
    {
      district: "ALL",
      gender: "ALL",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "<25",
      incarceration_count: "1147",
      probation_count: "96",
      total_population_count: "1510",
      dual_sentence_count: "267",
    },
    {
      district: "ALL",
      gender: "ALL",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "25-29",
      incarceration_count: "1262",
      probation_count: "1248",
      total_population_count: "3048",
      dual_sentence_count: "538",
    },
    {
      district: "ALL",
      gender: "MALE",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "ALL",
      incarceration_count: "6034",
      probation_count: "3112",
      total_population_count: "11107",
      dual_sentence_count: "1961",
    },
    {
      district: "ALL",
      gender: "FEMALE",
      race_or_ethnicity: "ALL",
      state_code: "US_ND",
      age_bucket: "ALL",
      incarceration_count: "159",
      probation_count: "285",
      total_population_count: "540",
      dual_sentence_count: "96",
    },
  ];
  fetchMock.once(
    JSON.stringify({ sentence_type_by_district_by_demographics: fileContents })
  );

  const metric = createMetric({
    // NOTE: this is a different type than in the other tests!
    // the first metric type does not support demographic filtering
    metricType: MetricTypes.SentenceTypesCurrent,
    initOptions: metadataSource,
  });

  await metric.fetch();
  // defaults to total
  expect(metric.records).toEqual([
    expect.objectContaining({
      raceOrEthnicity: "ALL",
      gender: "ALL",
      ageBucket: "ALL",
    }),
  ]);

  metric.demographicView = "age";
  expect(metric.records.length).toBeGreaterThan(0);
  metric.records.forEach((record) => {
    expect(record).toEqual(
      expect.objectContaining({ raceOrEthnicity: "ALL", gender: "ALL" })
    );
    expect(["<25", "25-29", "30-34", "35-39", "40<"]).toContain(
      record.ageBucket
    );
  });
});
