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
import PageSentencing from ".";

jest.mock("../hooks/useChartData");
useChartData.mockReturnValue({
  isLoading: false,
  apiData: {
    judicial_districts: getDataFixture("judicial_districts.json"),
    sentence_type_by_district_by_demographics: getDataFixture(
      "sentence_type_by_district_by_demographics.json"
    ),
  },
});

test("does not explode", () => {
  render(<PageSentencing />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Sentencing" })
  ).toBeVisible();
});

test("should have sections", () => {
  render(<PageSentencing />);
  Object.values(SECTION_TITLES[PATHS.sentencing]).forEach((sectionTitle) => {
    expect(
      screen.getByRole("heading", { level: 1, name: sectionTitle })
    ).toBeVisible();
  });
});
