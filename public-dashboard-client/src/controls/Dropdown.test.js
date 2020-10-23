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

import userEvent from "@testing-library/user-event";
import React from "react";
import { render } from "../testUtils";
import Dropdown from "./Dropdown";

const testLabel = "Test Label";
const mockOnChange = jest.fn();
let testOptions;

beforeEach(() => {
  testOptions = [
    { id: "1", label: "option one" },
    { id: "2", label: "option two" },
    { id: "3", label: "option three" },
  ];

  jest.resetAllMocks();
});

test("does not explode", () => {
  const { getByRole } = render(
    <Dropdown label={testLabel} options={testOptions} onChange={mockOnChange} />
  );

  const menuButton = getByRole("button", { name: testLabel });
  expect(menuButton).toBeInTheDocument();

  userEvent.click(menuButton);

  testOptions.forEach((opt) => {
    expect(getByRole("menuitem", { name: opt.label })).toBeVisible();
  });
});

test("selects first option by default", () => {
  const { getAllByText } = render(
    <Dropdown label={testLabel} options={testOptions} onChange={mockOnChange} />
  );

  // the expectations here are unfortunately somewhat indirect:
  // the selected label appears twice; once in the menu,
  // and once in the button displaying the selected value
  expect(getAllByText(testOptions[0].label).length).toBe(2);
  // an unselected label appears only once, in the menu
  expect(getAllByText(testOptions[1].label).length).toBe(1);
});

test("passes selections to callback", () => {
  const { getByRole } = render(
    <Dropdown label={testLabel} options={testOptions} onChange={mockOnChange} />
  );
  expect(mockOnChange.mock.calls[0][0]).toBe(testOptions[0].id);

  const menuButton = getByRole("button", { name: testLabel });
  userEvent.click(menuButton);

  const newOption = getByRole("menuitem", { name: testOptions[2].label });
  userEvent.click(newOption);

  expect(mockOnChange.mock.calls[1][0]).toBe(testOptions[2].id);
});
