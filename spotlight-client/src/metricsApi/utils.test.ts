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

import {
  DemographicFields,
  DemographicView,
  LocalityFields,
  recordIsTotalByDimension,
  recordMatchesLocality,
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
    verifyFilter("race", testData.slice(1, 3));
  });

  test("returns gender categories", () => {
    verifyFilter("gender", testData.slice(3, 5));
  });

  test("returns age categories", () => {
    verifyFilter("age", testData.slice(5, 7));
  });
});

describe("recordMatchesLocality", () => {
  const testData = [
    { locality: "ALL", value: 1 },
    { locality: "ALL", value: 2 },
    { locality: "ALL", value: 3 },
    { locality: "District 1", value: 2 },
    { locality: "District 1", value: 3 },
    { locality: "District 7", value: 3 },
    { locality: "District 42", value: 4 },
  ];

  const verifyFilter = (locality: string, expected: LocalityFields[]) => {
    expect(testData.filter(recordMatchesLocality(locality))).toEqual(expected);
  };
  test("returns all records", () => {
    verifyFilter("nofilter", testData);
  });

  test("returns records for a single locality", () => {
    verifyFilter("ALL", testData.slice(0, 3));
    verifyFilter("District 1", testData.slice(3, 5));
  });
});
