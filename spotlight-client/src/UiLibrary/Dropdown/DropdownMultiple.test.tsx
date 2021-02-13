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

import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import DropdownMultiple from "./DropdownMultiple";

const testLabel = "Test Label";
const mockOnChange = jest.fn();
const mockOnHighlight = jest.fn();
const testOptions = [
  { id: "1", label: "option one" },
  { id: "2", label: "option two" },
  { id: "3", label: "option three" },
];

beforeEach(() => {
  jest.resetAllMocks();
});

let rendered: ReturnType<typeof render>;

beforeEach(() => {
  rendered = render(
    <DropdownMultiple
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      onHighlight={mockOnHighlight}
      selectedIds={["1", "2", "3"]}
    />
  );
});

test("selects multiple", () => {
  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label} and 2 others`,
  });

  fireEvent.click(menuButton);

  testOptions.forEach((opt) => {
    expect(
      screen.getByRole("option", { name: opt.label, selected: true })
    ).toBeVisible();
  });
});

test("menu stays open after selection", async () => {
  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label} and 2 others`,
  });

  fireEvent.click(menuButton);

  fireEvent.click(screen.getByRole("option", { name: testOptions[0].label }));
  expect(mockOnChange).toHaveBeenLastCalledWith([
    testOptions[1].id,
    testOptions[2].id,
  ]);
  // update the controlled value to simulate real use
  rendered.rerender(
    <DropdownMultiple
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      selectedIds={["2", "3"]}
    />
  );

  // let's give the animation some time to run;
  // its duration is not entirely predictable but this should be enough time
  await new Promise((resolve) => setTimeout(resolve, 750));

  const option2 = screen.getByRole("option", { name: testOptions[1].label });
  expect(option2).toBeVisible();

  fireEvent.click(option2);
  expect(mockOnChange).toHaveBeenLastCalledWith([testOptions[2].id]);
});

test("select all", () => {
  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label} and 2 others`,
  });

  fireEvent.click(menuButton);

  const selectAll = screen.getByRole("option", { name: "Deselect all" });
  expect(selectAll).toBeVisible();

  fireEvent.click(selectAll);
  expect(mockOnChange).toHaveBeenLastCalledWith([]);

  // update the controlled value to simulate real use; none are selected
  rendered.rerender(
    <DropdownMultiple
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      selectedIds={[]}
    />
  );

  expect(selectAll).toHaveTextContent("Select all");
  expect(
    screen.queryByRole("option", { selected: true })
  ).not.toBeInTheDocument();

  fireEvent.click(selectAll);
  expect(mockOnChange).toHaveBeenLastCalledWith(
    testOptions.map(({ id }) => id)
  );
});

test("callback for highlighted item", async () => {
  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label} and 2 others`,
  });

  userEvent.click(menuButton);

  userEvent.hover(await screen.findByRole("option", { name: "Deselect all" }));
  // it does get called but indicates that nothing should be highlighted
  // (e.g. to clear an existing one)
  expect(mockOnHighlight).toHaveBeenLastCalledWith();

  userEvent.hover(screen.getByRole("option", { name: testOptions[0].label }));

  expect(mockOnHighlight).toHaveBeenLastCalledWith(testOptions[0].id);
});
