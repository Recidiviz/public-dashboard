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

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import useBreakpoint from "@w11r/use-breakpoint";
import React from "react";
import Dropdown from "./Dropdown";

jest.mock("@w11r/use-breakpoint");

const useBreakpointMock = useBreakpoint as jest.Mock;

const testLabel = "Test Label";
const mockOnChange = jest.fn();
const testOptions = [
  { id: "1", label: "option one" },
  { id: "2", label: "option two" },
  { id: "3", label: "option three" },
];

afterEach(() => {
  jest.resetAllMocks();
});

describe.each([["mobile", true], ["desktop"]])(
  "on %s:",
  (...[label, isMobile]) => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue(isMobile);
    });

    test("select from menu", async () => {
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

      const newOption = screen.getByRole("option", {
        name: testOptions[2].label,
      });
      fireEvent.click(newOption);

      expect(mockOnChange.mock.calls[0][0]).toBe(testOptions[2].id);

      // menu closes after selection is made; slight delay due to animation
      await waitFor(() =>
        screen.queryAllByRole("option").forEach((opt) => {
          expect(opt).not.toBeInTheDocument();
        })
      );
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

    test("options can be hidden", () => {
      const hiddenOption = { id: "4", label: "Hidden option", hidden: true };
      const testOptionsHidden = [...testOptions, hiddenOption];
      const { rerender } = render(
        <Dropdown
          label={testLabel}
          options={testOptionsHidden}
          onChange={mockOnChange}
          selectedId="1"
        />
      );

      const menuButton = screen.getByRole("button", {
        name: `${testLabel} ${testOptions[0].label}`,
      });

      fireEvent.click(menuButton);

      expect(
        screen.queryByRole("option", { name: hiddenOption.label })
      ).not.toBeInTheDocument();

      // can still be set by controlling component
      rerender(
        <Dropdown
          label={testLabel}
          options={testOptionsHidden}
          onChange={mockOnChange}
          selectedId={hiddenOption.id}
        />
      );

      expect(menuButton).toHaveTextContent(hiddenOption.label);
    });
  }
);
