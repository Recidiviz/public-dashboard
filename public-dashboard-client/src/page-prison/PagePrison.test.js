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

import React from "react";
import { PATHS, SECTION_TITLES } from "../constants";
import useChartData from "../hooks/useChartData";
import { render, screen, getDataFixture } from "../testUtils";
import PagePrison from ".";

jest.mock("../hooks/useChartData");
useChartData.mockReturnValue({
  isLoading: false,
  apiData: {
    incarceration_facilities: getDataFixture("incarceration_facilities.json"),
    incarceration_population_by_admission_reason: getDataFixture(
      "incarceration_population_by_admission_reason.json"
    ),
    incarceration_population_by_facility_by_demographics: getDataFixture(
      "incarceration_population_by_facility_by_demographics.json"
    ),
    incarceration_releases_by_type_by_period: getDataFixture(
      "incarceration_releases_by_type_by_period.json"
    ),
    incarceration_lengths_by_demographics: getDataFixture(
      "incarceration_lengths_by_demographics.json"
    ),
    incarceration_population_by_month_by_demographics: getDataFixture(
      "incarceration_population_by_month_by_demographics.json"
    ),
    recidivism_rates_by_cohort_by_year: getDataFixture(
      "recidivism_rates_by_cohort_by_year.json"
    ),
  },
});

test("does not explode", () => {
  render(<PagePrison />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Prison" })
  ).toBeVisible();
});

test("should have sections", () => {
  render(<PagePrison />);
  Object.values(SECTION_TITLES[PATHS.prison]).forEach((sectionTitle) => {
    expect(
      screen.getByRole("heading", { level: 1, name: sectionTitle })
    ).toBeVisible();
  });
});
