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

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import { renderWithStore } from "../testUtils";
import BubbleChart from "./BubbleChart";

jest.mock("../MeasureWidth/MeasureWidth");

const testData = [
  { label: "thing 1", color: "red", value: 10 },
  { label: "thing 2", color: "blue", value: 50 },
  { label: "thing 3", color: "green", value: 32 },
];

test("renders bubbles for data", () => {
  renderWithStore(<BubbleChart height={400} data={testData} />);

  const chart = screen.getByRole("figure");
  const bubbles = within(chart).getByRole("group", { name: "nodes" });
  expect(bubbles).toBeVisible();
  testData.forEach((record) => {
    expect(
      // these are the only Semiotic labels we have to work with here
      within(bubbles).getByRole("img", { name: `Node ${record.label}` })
    ).toHaveStyle(`fill: ${record.color}`);
    // unfortunately there isn't really any sensible way to inspect the bubble size within JSDOM
  });

  // record values should be labeled as percentages
  expect(within(chart).getByText("11%")).toBeVisible();
  expect(within(chart).getByText("54%")).toBeVisible();
  expect(within(chart).getByText("35%")).toBeVisible();
});

test("highlight when hovering on legend", async () => {
  renderWithStore(<BubbleChart height={400} data={testData} />);
  const firstLegendItem = screen.getByText(testData[0].label);
  fireEvent.mouseOver(firstLegendItem);

  // wait for highlight animation
  await waitFor(() => {
    expect(
      screen.getByRole("img", { name: `Node ${testData[1].label}` })
    ).not.toHaveStyle(`fill: ${testData[1].color}`);
    expect(
      screen.getByRole("img", { name: `Node ${testData[2].label}` })
    ).not.toHaveStyle(`fill: ${testData[2].color}`);
  });
});
