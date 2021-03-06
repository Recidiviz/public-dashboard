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

import { screen } from "@testing-library/react";
import mockContentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { renderNavigableApp } from "../testUtils";

jest.mock("../contentApi/sources/us_nd", () => mockContentFixture);

const narrativeContent = mockContentFixture.racialDisparitiesNarrative;

beforeEach(() => {
  renderNavigableApp({
    route: "/us-nd/collections/racial-disparities",
  });
});

test("renders all the sections", () => {
  expect(
    screen.getByRole("heading", { name: "Racial Disparities", level: 1 })
  ).toBeVisible();

  Object.values(narrativeContent.sections).forEach((section) => {
    expect(
      screen.getByRole("heading", { name: section.title })
    ).toBeInTheDocument();
  });
});

test("parses HTML in copy", async () => {
  expect(screen.getByRole("link", { name: "intro link" })).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: "conclusion body link" })
  ).toBeInTheDocument();
});

test.skip("renders dynamic text", () => {
  // refer to the fixture to see what variables are in the text
  expect(screen.getByText("introduction 81.0 26.9 23.1")).toBeVisible();
  //   sections: {
  //     beforeCorrections: {
  //       title: "beforeCorrections title",
  //       body: `beforeCorrections body {{ethnonym}} {{ethnonymCapitalized}}
  //       {{populationPctCurrent}} {{correctionsPctCurrent}}`,
  //     },
  // TODO: other sections
});
