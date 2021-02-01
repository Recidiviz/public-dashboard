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

import { screen } from "@testing-library/react";
import React from "react";
import { renderWithStore } from "../testUtils";
import BarChartTrellis from "./BarChartTrellis";

const mockGetTooltipProps = jest.fn();
const mockSetTitle = jest.fn();
const testData = [
  {
    title: "Group 1",
    data: [
      { label: "Category A", color: "red", value: 30, pct: 0.3 },
      { label: "Category B", color: "blue", value: 70, pct: 0.7 },
    ],
  },
  {
    title: "Group 2",
    data: [
      { label: "Category A", color: "red", value: 80, pct: 0.4 },
      { label: "Category B", color: "blue", value: 120, pct: 0.6 },
    ],
  },
];

test("renders charts", () => {
  renderWithStore(
    <BarChartTrellis
      data={testData}
      getTooltipProps={mockGetTooltipProps}
      setSelectedChartTitle={mockSetTitle}
      width={500}
    />
  );

  expect(
    screen.getAllByRole("group", { name: "2 bars in a bar chart" }).length
  ).toBe(2);

  expect(
    screen.getByRole("img", { name: "Category A bar value 30%" })
  ).toHaveStyle("fill: red");
  expect(
    screen.getByRole("img", { name: "Category A bar value 40%" })
  ).toHaveStyle("fill: red");
  expect(
    screen.getByRole("img", { name: "Category B bar value 70%" })
  ).toHaveStyle("fill: blue");
  expect(
    screen.getByRole("img", { name: "Category B bar value 60%" })
  ).toHaveStyle("fill: blue");
});

test("all charts have same Y axis range", () => {
  renderWithStore(
    <BarChartTrellis
      data={testData}
      getTooltipProps={mockGetTooltipProps}
      setSelectedChartTitle={mockSetTitle}
      width={500}
    />
  );

  expect(screen.getAllByLabelText("left axis from 0% to 100%").length).toBe(2);
});
