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

import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import Dropdown from "./Dropdown";

const testLabel = "Test Label";
const mockOnChange = jest.fn();
const testOptions = [
  { id: "1", label: "option one" },
  { id: "2", label: "option two" },
  { id: "3", label: "option three" },
];

beforeEach(() => {
  jest.resetAllMocks();
});

test("select from menu", () => {
  render(
    <Dropdown
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      selectedId="1"
    />
  );

  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label}`,
  });

  screen
    .queryAllByRole("option")
    .forEach((option) => expect(option).not.toBeInTheDocument());

  fireEvent.click(menuButton);

  testOptions.forEach((opt) => {
    expect(screen.getByRole("option", { name: opt.label })).toBeVisible();
  });

  const newOption = screen.getByRole("option", { name: testOptions[2].label });
  fireEvent.click(newOption);

  expect(mockOnChange.mock.calls[0][0]).toBe(testOptions[2].id);
});

test("selection prop updates menu", () => {
  const { rerender } = render(
    <Dropdown
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      selectedId="1"
    />
  );

  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label}`,
  });

  rerender(
    <Dropdown
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      selectedId="2"
    />
  );

  expect(menuButton).toHaveTextContent(testOptions[1].label);
});

test("can be disabled", () => {
  render(
    <Dropdown
      label={testLabel}
      options={testOptions}
      onChange={mockOnChange}
      selectedId="1"
      disabled
    />
  );
  const menuButton = screen.getByRole("button", {
    name: `${testLabel} ${testOptions[0].label}`,
  });
  expect(menuButton).toBeDisabled();

  fireEvent.click(menuButton);
  screen
    .queryAllByRole("option")
    .forEach((option) => expect(option).not.toBeInTheDocument());
});
