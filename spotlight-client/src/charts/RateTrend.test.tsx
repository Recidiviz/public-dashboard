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
import RateTrend from "./RateTrend";

jest.mock("../MeasureWidth/MeasureWidth");

const testData = [
  {
    label: "Thing 1",
    color: "red",
    coordinates: [
      { rate: 0.2, rateNumerator: 2, rateDenominator: 10, time: 1 },
      { rate: 0.6, rateNumerator: 6, rateDenominator: 10, time: 2 },
    ],
  },
  {
    label: "Thing 2",
    color: "blue",
    coordinates: [
      { rate: 0.5, rateNumerator: 5, rateDenominator: 10, time: 1 },
      { rate: 0.3, rateNumerator: 3, rateDenominator: 10, time: 2 },
    ],
  },
];

test("plots one line per rate", () => {
  renderWithStore(<RateTrend data={testData} xAccessor="time" />);

  // there are two because of the hover overlay; the first one should have the actual lines
  const chart = screen.getAllByRole("group", {
    name: "2 lines in a line chart",
  })[0];
  expect(chart).toBeVisible();
  expect(
    within(chart).getByRole("img", {
      name: "2 point line starting value 20% at 1 ending value 60% at 2",
    })
  ).toHaveStyle("stroke: red");
  expect(
    within(chart).getByRole("img", {
      name: "2 point line starting value 50% at 1 ending value 30% at 2",
    })
  ).toHaveStyle("stroke: blue");
});

test("percentage axis", () => {
  renderWithStore(<RateTrend data={testData} xAccessor="time" />);
  expect(screen.getByLabelText("left axis from 0% to 100%")).toBeVisible();
});

test("labels", () => {
  renderWithStore(
    <RateTrend
      data={testData}
      xAccessor="time"
      title="Things Over Time"
      xLabel="Time Since Things Began"
    />
  );
  expect(screen.getByText("Things Over Time")).toBeVisible();
  expect(screen.getByText("Time Since Things Began")).toBeVisible();
});
