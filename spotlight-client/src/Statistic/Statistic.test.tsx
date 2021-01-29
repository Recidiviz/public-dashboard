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

import { render, screen } from "@testing-library/react";
import React from "react";
import Statistic from "./Statistic";

const maxSize = 96;
const minSize = 32;

test("has value and label", () => {
  render(<Statistic value={10} label="things" {...{ maxSize, minSize }} />);
  expect(screen.getByRole("figure")).toHaveTextContent("10things");
});

test("has no label", () => {
  render(<Statistic value="99%" {...{ maxSize, minSize }} />);
  expect(screen.getByRole("figure")).toHaveTextContent("99%");
});

test("no data", () => {
  render(<Statistic {...{ maxSize, minSize }} />);
  expect(screen.getByRole("figure")).toHaveTextContent("No data");
});
