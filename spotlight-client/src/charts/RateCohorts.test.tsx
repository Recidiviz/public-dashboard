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

import { screen, within } from "@testing-library/react";
import React from "react";
import { renderWithStore } from "../testUtils";
import RateCohorts from "./RateCohorts";

jest.mock("../MeasureWidth/MeasureWidth");

const testData = [
  {
    rate: 0.25,
    rateNumerator: 1,
    rateDenominator: 4,
    label: "thing 1",
  },
  {
    rate: 0.4,
    rateNumerator: 2,
    rateDenominator: 5,
    label: "thing 2",
  },
];

test("plots one bar per cohort", () => {
  renderWithStore(<RateCohorts data={testData} />);

  const chart = screen.getByRole("group", {
    name: "2 bars in a bar chart",
  });
  expect(chart).toBeVisible();
  expect(
    within(chart).getByRole("img", {
      name: "thing 1 bar value 25%",
    })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", {
      name: "thing 2 bar value 40%",
    })
  ).toBeVisible();

  // X axis labels
  expect(screen.getByText("thing 1")).toBeVisible();
  expect(screen.getByText("thing 2")).toBeVisible();
});
