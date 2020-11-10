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
import useBreakpoint from "@w11r/use-breakpoint";
import React from "react";
import { act, render, within } from "../testUtils";
import CohortSelect from "./CohortSelect";

jest.mock("@w11r/use-breakpoint");

const mockOnChange = jest.fn();
const mockOnHighlight = jest.fn();
let testOptions;

beforeEach(() => {
  testOptions = [
    { id: "2009", label: "2009", color: "#C0FFEE" },
    { id: "2010", label: "2010", color: "#F4E192" },
    { id: "2011", label: "2011", color: "#AAF268" },
    { id: "2012", label: "2012", color: "#149E2B" },
    { id: "2013", label: "2013", color: "#7ACCD6" },
    { id: "2014", label: "2014", color: "#B54F01" },
    { id: "2015", label: "2015", color: "#8C0536" },
    { id: "2016", label: "2016", color: "#DDE03E" },
    { id: "2017", label: "2017", color: "#C5E276" },
    { id: "2018", label: "2018", color: "#8CFFED" },
  ];
  // mock breakpoint hook to simulate screen size (not natively supported by JSDOM)
  useBreakpoint.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

/**
 * Convenience function for opening the cohort menu,
 * which most tests need to do
 */
function openMenu() {
  const renderResult = render(
    <CohortSelect
      onChange={mockOnChange}
      onHighlight={mockOnHighlight}
      options={testOptions}
    />
  );
  const menuButton = renderResult.getByRole("button", { name: /cohort/i });
  act(() => userEvent.click(menuButton));
  // give callers access to all queries etc.
  return renderResult;
}

test("triggers menu from button", () => {
  const { getByRole } = render(
    <CohortSelect
      onChange={mockOnChange}
      onHighlight={mockOnHighlight}
      options={testOptions}
    />
  );
  const menuButton = getByRole("button", { name: /^cohort/i });
  expect(menuButton).toBeVisible();
  userEvent.click(menuButton);
  const menu = getByRole("listbox", { name: /cohort/i });
  expect(menu).toBeVisible();
  const { getByRole: getByRoleWithinMenu } = within(menu);
  testOptions.forEach((opt) => {
    expect(getByRoleWithinMenu("option", { name: opt.label })).toBeVisible();
  });
});

test("invisible menu on mobile", () => {
  // hook returns true on mobile
  useBreakpoint.mockReturnValue(true);

  const { getByRole } = render(
    <CohortSelect
      onChange={mockOnChange}
      onHighlight={mockOnHighlight}
      options={testOptions}
    />
  );
  // the listbox is always present but not visible (interacting with it will trigger native OS UI)
  const menu = getByRole("listbox", { name: /cohort/i });
  expect(menu).not.toBeVisible();
  const { getByRole: getByRoleWithinMenu } = within(menu);
  testOptions.forEach((opt) => {
    expect(
      getByRoleWithinMenu("option", { name: opt.label, selected: true })
    ).toBeInTheDocument();
  });
});

test("selects all by default", () => {
  const { getByRole } = openMenu();
  testOptions.forEach((opt) => {
    expect(
      getByRole("option", { name: opt.label, selected: true })
    ).toBeVisible();
  });
});

test("toggles selection", () => {
  const { getByRole } = openMenu();
  const firstOption = getByRole("option", { name: testOptions[0].label });
  act(() => userEvent.click(firstOption));
  expect(firstOption.getAttribute("aria-selected")).toBe("false");
  const menuButton = getByRole("button");
  expect(menuButton).toHaveTextContent(
    `${testOptions[1].label} and ${testOptions.length - 2} others`
  );
  act(() => userEvent.click(firstOption));
  expect(firstOption.getAttribute("aria-selected")).toBe("true");
  expect(menuButton).toHaveTextContent(
    `${testOptions[0].label} and ${testOptions.length - 1} others`
  );
});

test("toggles selection on mobile", () => {
  // hook returns true on mobile
  useBreakpoint.mockReturnValue(true);

  const { getByRole, getByText } = render(
    <CohortSelect
      onChange={mockOnChange}
      onHighlight={mockOnHighlight}
      options={testOptions}
    />
  );
  const menu = getByRole("listbox", { name: /cohort/i });
  const valueEl = getByText((content, element) => {
    // this pattern is permissive about spaces between words because textContent
    // concatenated from arbitrary children may have random line breaks, etc
    return new RegExp(
      String.raw`^${testOptions[0].label}\s+and\s+${
        testOptions.length - 1
      }\s+others$`
    ).test(element.textContent);
  });

  act(() => {
    userEvent.deselectOptions(menu, testOptions[0].id);
  });
  expect(valueEl).toHaveTextContent(
    `${testOptions[1].label} and ${testOptions.length - 2} others`
  );
  act(() => {
    userEvent.selectOptions(menu, testOptions[0].id);
  });
  expect(valueEl).toHaveTextContent(
    `${testOptions[0].label} and ${testOptions.length - 1} others`
  );
});

test("sends initial selection to callback", () => {
  render(
    <CohortSelect
      onChange={mockOnChange}
      onHighlight={mockOnHighlight}
      options={testOptions}
    />
  );
  expect(mockOnChange.mock.calls.length).toBe(1);
  // pass only the selected IDs, not the entire options object
  expect(mockOnChange.mock.calls[0][0]).toEqual(testOptions);
});

test("sends updated selections to callback", () => {
  const { getByRole } = openMenu();
  const firstOption = getByRole("option", { name: testOptions[0].label });
  act(() => userEvent.click(firstOption));
  expect(mockOnChange.mock.calls[1][0]).toEqual(testOptions.slice(1));
});

test("applies colors to selected items", () => {
  const { getByRole } = openMenu();
  testOptions.forEach((opt) => {
    expect(
      getByRole("option", { name: opt.label, selected: true })
    ).toHaveStyle(`background-color: ${opt.color}`);
  });
  const firstOption = getByRole("option", { name: testOptions[0].label });
  act(() => userEvent.click(firstOption));
  expect(firstOption).not.toHaveStyle(
    `background-color: ${testOptions[0].color}`
  );
});

test("passes highlighted option to callback", () => {
  const { getByRole } = openMenu();
  testOptions.forEach((opt) => {
    mockOnHighlight.mockClear();
    const menuItem = getByRole("option", { name: opt.label });
    act(() => userEvent.hover(menuItem));
    expect(mockOnHighlight.mock.calls[0][0]).toBe(opt);
  });
});

test("supports select-all", () => {
  const { getByRole } = openMenu();
  const selectAll = getByRole("option", { name: /select all/i });

  expect(selectAll).toHaveTextContent(/deselect all/i);
  act(() => userEvent.click(selectAll));

  // de-selects all
  testOptions.forEach((opt) => {
    expect(getByRole("option", { name: opt.label })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });
  expect(selectAll).toHaveTextContent(/(?<!de)select all/i);

  // click again to select all
  act(() => userEvent.click(selectAll));
  testOptions.forEach((opt) => {
    expect(getByRole("option", { name: opt.label })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
  expect(selectAll).toHaveTextContent(/deselect all/i);

  // now de-select some manually and try again
  testOptions.slice(2, 6).forEach((opt) => {
    act(() => userEvent.click(getByRole("option", { name: opt.label })));
    expect(getByRole("option", { name: opt.label })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  expect(selectAll).toHaveTextContent(/(?<!de)select all/i);

  act(() => userEvent.click(selectAll));
  // everything is selected again
  testOptions.forEach((opt) => {
    expect(getByRole("option", { name: opt.label })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
  expect(selectAll).toHaveTextContent(/deselect all/i);
});
