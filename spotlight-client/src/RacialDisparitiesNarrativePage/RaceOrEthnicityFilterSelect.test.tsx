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

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { reactImmediately } from "../testUtils";
import RaceOrEthnicityFilterSelect from "./RaceOrEthnicityFilterSelect";

const expectedOptions = [
  { id: "AMERICAN_INDIAN_ALASKAN_NATIVE", label: "Native American" },
  { id: "BLACK", label: "Black" },
  { id: "HISPANIC", label: "Hispanic" },
  { id: "WHITE", label: "White" },
  { id: "OTHER", label: "Other" },
];

let narrative: RacialDisparitiesNarrative;

beforeEach(() => {
  narrative = RacialDisparitiesNarrative.build({
    tenantId: "US_ND",
    content: contentFixture.racialDisparitiesNarrative,
  });

  render(<RaceOrEthnicityFilterSelect narrative={narrative} />);
});

test("has expected options", () => {
  const menuButton = screen.getByRole("button", {
    name: "Race or Ethnicity Black",
  });
  fireEvent.click(menuButton);

  const options = screen.getAllByRole("option");

  expect(options.length).toBe(expectedOptions.length);

  options.forEach((option, index) =>
    expect(option).toHaveTextContent(expectedOptions[index].label)
  );
});

test("changes demographic filter", () => {
  const menuButton = screen.getByRole("button", {
    name: "Race or Ethnicity Black",
  });

  expectedOptions.forEach((expectedOption) => {
    // open the menu
    fireEvent.click(menuButton);

    const option = screen.getByRole("option", { name: expectedOption.label });
    fireEvent.click(option);

    reactImmediately(() => {
      expect(narrative.selectedCategory).toBe(expectedOption.id);
      expect(menuButton).toHaveTextContent(expectedOption.label);
    });
  });

  expect.hasAssertions();
});
