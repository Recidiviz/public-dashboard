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
import ProportionalBar from "./ProportionalBar";

test("renders data", () => {
  const testData = [
    { label: "thing 1", color: "red", value: 10 },
    { label: "thing 2", color: "blue", value: 51 },
  ];
  const title = "Testing";

  renderWithStore(
    <ProportionalBar data={testData} height={100} title={title} />
  );

  const viz = screen.getByRole("group", {
    name: `${testData.length} bars in a bar chart`,
  });
  expect(viz).toBeVisible();

  testData.forEach((record) => {
    const mark = within(viz).getByRole("img", {
      // TODO: what would happen if we used bar width instead? (probably ... something bad)
      // this label is not amazingly informative but it's what Semiotic gives us
      name: `${title} bar value ${record.value}`,
    });
    expect(mark).toBeVisible();
    expect(mark).toHaveStyle(`fill: ${record.color}`);
  });
});

test("chart with no data", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testData: any[] = [];
  const title = "Testing";

  renderWithStore(
    <ProportionalBar data={testData} height={100} title={title} />
  );

  expect(screen.getByText(`${title}, No Data`)).toBeVisible();
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});

test("highlighting", async () => {
  const testData = [
    { label: "thing 1", color: "red", value: 10 },
    { label: "thing 2", color: "blue", value: 51 },
  ];
  const title = "Testing";
  const mockHighlight = jest.fn();

  const { rerender } = renderWithStore(
    <ProportionalBar
      data={testData}
      height={100}
      title={title}
      setHighlighted={mockHighlight}
    />
  );

  // hovering over the legend should trigger the external highlight function
  fireEvent.mouseOver(screen.getByText(testData[0].label));
  expect(mockHighlight.mock.calls[0][0]).toEqual({ label: testData[0].label });

  // hovering over the chart should not
  fireEvent.mouseOver(
    screen.getByRole("img", { name: `${title} bar value ${testData[1].value}` })
  );
  expect(mockHighlight.mock.calls.length).toBe(1);

  // externally controlled highlight state
  const unHighlightedBar = screen.getByRole("img", {
    name: `${title} bar value ${testData[0].value}`,
  });
  expect(unHighlightedBar).toHaveStyle(`fill: ${testData[0].color}`);
  rerender(
    <ProportionalBar
      data={testData}
      height={100}
      title={title}
      setHighlighted={mockHighlight}
      highlighted={testData[1]}
    />
  );
  // color change is animated by JS
  await waitFor(() =>
    expect(unHighlightedBar).not.toHaveStyle(`fill: ${testData[0].color}`)
  );
});
