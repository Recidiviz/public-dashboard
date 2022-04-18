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

import { getDefaultNormalizer, render, screen } from "@testing-library/react";
import React from "react";
import { UnknownsNote } from "./UnknownsNote";

test("format single unknowns", () => {
  render(
    <UnknownsNote
      download={() => {
        // empty
      }}
    />
  );

  const normalizeContents = getDefaultNormalizer();

  expect(
    screen.findByText(
      (content, element) =>
        normalizeContents(element.textContent || "") ===
        "This data includes some individuals for whom age, gender, or race/ethnicity is not reported. These individuals count toward the total but are excluded from demographic breakdown views. For more details, download the data and view the README.txt."
    )
  );
});
