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

import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import React from "react";
import { render, within } from "../testUtils";
import CohortSelect from "./CohortSelect";

const mockOnChange = jest.fn();
let testOptions;

beforeEach(() => {
  testOptions = [
    { id: "2009", label: "2009", color: "#C0FFEE" },
    { id: "2010", label: "2010", color: "#C0FFEE" },
    { id: "2011", label: "2011", color: "#C0FFEE" },
    { id: "2012", label: "2012", color: "#C0FFEE" },
    { id: "2013", label: "2013", color: "#C0FFEE" },
    { id: "2014", label: "2014", color: "#C0FFEE" },
    { id: "2015", label: "2015", color: "#C0FFEE" },
    { id: "2016", label: "2016", color: "#C0FFEE" },
    { id: "2017", label: "2017", color: "#C0FFEE" },
    { id: "2018", label: "2018", color: "#C0FFEE" },
  ];

  jest.resetAllMocks();
});

/**
 * Convenience function for opening the cohort menu,
 * which most tests need to do
 */
function openMenu() {
  const renderResult = render(
    <CohortSelect onChange={mockOnChange} options={testOptions} />
  );
  const menuButton = renderResult.getByRole("button", { name: /cohort/i });
  userEvent.click(menuButton);
  // give callers access to all queries etc.
  return renderResult;
}

test("does not explode", () => {
  const { getByRole } = render(
    <CohortSelect onChange={mockOnChange} options={testOptions} />
  );
  const menuButton = getByRole("button", { name: /^cohort/i });
  expect(menuButton).toBeInTheDocument();
  userEvent.click(menuButton);
  const menu = getByRole("listbox", { name: /cohort/i });
  expect(menu).toBeInTheDocument();
  const { getByRole: getByRoleWithinMenu } = within(menu);
  testOptions.forEach((opt) => {
    expect(
      getByRoleWithinMenu("option", { name: opt.label })
    ).toBeInTheDocument();
  });
});

test("selects all by default", () => {
  const { getByRole } = openMenu();
  testOptions.forEach((opt) => {
    expect(
      getByRole("option", { name: opt.label, selected: true })
    ).toBeInTheDocument();
  });
});

test("toggles selection", async () => {
  const { getByRole } = openMenu();
  const firstOption = getByRole("option", { name: testOptions[0].label });
  userEvent.click(firstOption);
  await waitFor(() =>
    expect(firstOption.getAttribute("aria-selected")).toBe("false")
  );
  const menuButton = getByRole("button");
  expect(menuButton).toHaveTextContent(
    `${testOptions[1].label} and ${testOptions.length - 2} others`
  );
  userEvent.click(firstOption);
  await waitFor(() =>
    expect(firstOption.getAttribute("aria-selected")).toBe("true")
  );
  expect(menuButton).toHaveTextContent(
    `${testOptions[0].label} and ${testOptions.length - 1} others`
  );
});

test("sends initial selection to callback", () => {
  render(<CohortSelect onChange={mockOnChange} options={testOptions} />);
  expect(mockOnChange.mock.calls.length).toBe(1);
  // pass only the selected IDs, not the entire options object
  expect(mockOnChange.mock.calls[0][0]).toEqual(
    testOptions.map((opt) => opt.id)
  );
});

test("sends updated selections to callback", async () => {
  const { getByRole } = openMenu();
  const firstOption = getByRole("option", { name: testOptions[0].label });
  userEvent.click(firstOption);
  await waitFor(() =>
    expect(mockOnChange.mock.calls[1][0]).toEqual(
      testOptions.slice(1).map((opt) => opt.id)
    )
  );
});

test("applies colors to selected items", () => {
  const { getByRole } = openMenu();
  testOptions.forEach((opt) => {
    expect(
      getByRole("option", { name: opt.label, selected: true })
    ).toHaveStyle(`background-color: ${opt.color}`);
  });
  const firstOption = getByRole("option", { name: testOptions[0].label });
  userEvent.click(firstOption);
  expect(firstOption).not.toHaveStyle(
    `background-color: ${testOptions[0].color}`
  );
});
