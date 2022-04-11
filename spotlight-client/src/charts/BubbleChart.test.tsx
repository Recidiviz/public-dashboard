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
import { STATISTIC_THRESHOLD } from "../constants";
import { renderWithStore } from "../testUtils";
import BubbleChart from "./BubbleChart";
import { generateHatchFill } from "./utils";

jest.mock("../MeasureWidth/MeasureWidth");

const testData = [
  { label: "thing 1", color: "red", value: 10, pct: 0.1086956522 },
  { label: "thing 2", color: "blue", value: 50, pct: 0.5434782609 },
  { label: "thing 3", color: "green", value: 320, pct: 0.347826087 },
];

test("renders bubbles for data", () => {
  renderWithStore(<BubbleChart height={400} data={testData} />);

  const chart = screen.getByRole("figure");
  const bubbles = within(chart).getByRole("group", { name: "nodes" });
  expect(bubbles).toBeVisible();
  testData.forEach((record) => {
    if (record.value < STATISTIC_THRESHOLD) {
      expect(
        // these are the only Semiotic labels we have to work with here
        within(bubbles).getByRole("img", { name: `Node ${record.label}` })
      ).toHaveStyle(`fill: ${generateHatchFill(record.label)}`);
    } else {
      expect(
        within(bubbles).getByRole("img", { name: `Node ${record.label}` })
      ).toHaveStyle(`fill: ${record.color}`);
      // unfortunately there isn't really any sensible way to inspect the bubble size within JSDOM
    }
  });

  // record values should be labeled as percentages
  expect(within(chart).getByText("11%")).toBeVisible();
  expect(within(chart).getByText("54%")).toBeVisible();
  expect(within(chart).getByText("35%")).toBeVisible();
});
