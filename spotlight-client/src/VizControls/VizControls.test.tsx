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

import { fireEvent, screen, within } from "@testing-library/react";
import React from "react";
import { renderWithTheme } from "../testUtils";
import VizControls from "./VizControls";

const mockDownload = jest.fn();
const mockMethodology = "test methodology";

beforeEach(() => {
  renderWithTheme(
    <VizControls
      filters={[]}
      download={mockDownload}
      methodology={mockMethodology}
    />
  );
});

test("download button", () => {
  const download = screen.getByRole("button", { name: "Download Data" });
  expect(download).toBeVisible();
  fireEvent.click(download);

  expect(mockDownload).toHaveBeenCalled();
});

test("methodology modal", () => {
  const methodology = screen.getByRole("button", { name: "Methodology" });

  fireEvent.click(methodology);

  const modal = screen.getByRole("dialog");

  expect(modal).toBeVisible();
  expect(
    within(modal).getByRole("heading", { name: "Methodology" })
  ).toBeVisible();
  expect(within(modal).getByText(mockMethodology)).toBeVisible();
});
