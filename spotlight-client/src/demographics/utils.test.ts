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

import { DemographicFields } from "../metricsApi";
import { DemographicView } from "./types";
import {
  createDemographicCategories,
  dataIncludesBreakdowns,
  recordIsTotalByDimension,
} from "./utils";

describe("recordIsTotalByDimension", () => {
  const testData: Array<DemographicFields & { count: number }> = [
    { raceOrEthnicity: "ALL", gender: "ALL", ageBucket: "ALL", count: 1 },
    { raceOrEthnicity: "BLACK", gender: "ALL", ageBucket: "ALL", count: 2 },
    { raceOrEthnicity: "WHITE", gender: "ALL", ageBucket: "ALL", count: 3 },
    { raceOrEthnicity: "ALL", gender: "MALE", ageBucket: "ALL", count: 4 },
    { raceOrEthnicity: "ALL", gender: "FEMALE", ageBucket: "ALL", count: 5 },
    { raceOrEthnicity: "ALL", gender: "ALL", ageBucket: "<25", count: 6 },
    { raceOrEthnicity: "ALL", gender: "ALL", ageBucket: "25-29", count: 7 },
  ];

  const verifyFilter = (
    view: DemographicView,
    expected: DemographicFields[]
  ) => {
    expect(testData.filter(recordIsTotalByDimension(view))).toEqual(expected);
  };

  test("returns all records", () => {
    verifyFilter("nofilter", testData);
  });

  test("returns only totals", () => {
    verifyFilter("total", testData.slice(0, 1));
  });

  test("returns race/ethnicity categories", () => {
    verifyFilter("raceOrEthnicity", testData.slice(1, 3));
  });

  test("returns gender categories", () => {
    verifyFilter("gender", testData.slice(3, 5));
  });

  test("returns age categories", () => {
    verifyFilter("ageBucket", testData.slice(5, 7));
  });
});

describe("createDemographicCategories", () => {
  test("defaults", () => {
    const categories = createDemographicCategories();

    expect(categories.total).toEqual([{ identifier: "ALL", label: "Total" }]);

    expect(categories.raceOrEthnicity).toEqual([
      {
        identifier: "AMERICAN_INDIAN_ALASKAN_NATIVE",
        label: "Native American",
      },
      { identifier: "BLACK", label: "Black" },
      { identifier: "HISPANIC", label: "Hispanic" },
      { identifier: "WHITE", label: "White" },
      { identifier: "ASIAN", label: "Asian" },
      {
        identifier: "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
        label: "Pacific Islander",
      },
      { identifier: "OTHER", label: "Other" },
    ]);

    expect(categories.gender).toEqual([
      { identifier: "MALE", label: "Male" },
      { identifier: "FEMALE", label: "Female" },
    ]);

    expect(categories.ageBucket).toEqual([
      { identifier: "<25", label: "<25" },
      { identifier: "25-29", label: "25-29" },
      { identifier: "30-39", label: "30-39" },
      { identifier: "40-49", label: "40-49" },
      { identifier: "50-59", label: "50-59" },
      { identifier: "60-69", label: "60-69" },
      { identifier: "70<", label: "70+" },
    ]);
  });

  test("customized race/ethnicity", () => {
    const categories = createDemographicCategories({
      raceOrEthnicity: [
        "AMERICAN_INDIAN_ALASKAN_NATIVE",
        "BLACK",
        "HISPANIC",
        "WHITE",
        "OTHER",
      ],
    });

    expect(categories.raceOrEthnicity).toEqual([
      {
        identifier: "AMERICAN_INDIAN_ALASKAN_NATIVE",
        label: "Native American",
      },
      { identifier: "BLACK", label: "Black" },
      { identifier: "HISPANIC", label: "Hispanic" },
      { identifier: "WHITE", label: "White" },
      { identifier: "OTHER", label: "Other" },
    ]);
  });
});

test("dataIncludesBreakdowns", () => {
  expect(
    dataIncludesBreakdowns([
      {
        gender: "ALL",
        ageBucket: "ALL",
        raceOrEthnicity: "ALL",
        count: 10,
      },
      {
        gender: "ALL",
        ageBucket: "ALL",
        raceOrEthnicity: "ALL",
        count: 20,
      },
    ])
  ).toBe(false);

  expect(
    dataIncludesBreakdowns([
      {
        gender: "MALE",
        ageBucket: "ALL",
        raceOrEthnicity: "ALL",
        count: 10,
      },
      {
        gender: "ALL",
        ageBucket: "ALL",
        raceOrEthnicity: "ALL",
        count: 20,
      },
    ])
  ).toBe(true);
});
