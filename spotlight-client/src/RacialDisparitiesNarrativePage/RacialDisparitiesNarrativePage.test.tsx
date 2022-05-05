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

import { getDefaultNormalizer, screen } from "@testing-library/react";
import mockContentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { NarrativesSlug } from "../routerUtils/types";
import { renderNavigableApp } from "../testUtils";

jest.mock("../contentApi/sources/us_nd", () => mockContentFixture);
jest.mock("../MeasureWidth/MeasureWidth");

const narrativeContent = mockContentFixture.racialDisparitiesNarrative;

beforeEach(() => {
  renderNavigableApp({
    route: `/us-nd/${NarrativesSlug}/racial-disparities`,
  });
});

test("renders all the sections", async () => {
  expect(await screen.findByTestId("PageTitle")).toHaveTextContent(
    "Racial Disparities"
  );

  return Promise.all(
    Object.values(narrativeContent.sections).map(async (section) => {
      expect(
        await screen.findByRole("heading", {
          name: section.title,
          // include hidden because of crossfade animation
          hidden: true,
        })
      ).toBeInTheDocument();
    })
  );
});

test("renders dynamic text", async () => {
  // expanded templates are broken up with internal markup
  // that we will want to normalize away
  const normalizeContents = getDefaultNormalizer();

  // refer to the fixture to see what variables are in the text
  expect(
    await screen.findByText(
      (content, element) =>
        normalizeContents(element?.textContent || "") ===
        "introduction 81.0 26.9 23.1"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      (content, element) =>
        normalizeContents(element?.textContent || "") ===
        "beforeCorrections body People who are Black 1% 18%"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      (content, element) =>
        normalizeContents(element?.textContent || "") ===
        "sentencing body people who are Black 66% 36% 47% 56% greater"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      (content, element) =>
        normalizeContents(element?.textContent || "") ===
        "supervision body supervision 33% 47% 16% 19% 25% 27% 34% 35%"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      (content, element) =>
        normalizeContents(element?.textContent || "") ===
        "releasesToParole body 33% 8%"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      (content, element) =>
        normalizeContents(element?.textContent || "") ===
        "programming body 21% 11% greater"
    )
  ).toBeInTheDocument();
});

test("renders charts", async () => {
  const charts = await screen.findAllByRole("group", {
    name: /\d+ bars in a bar chart/,
  });
  expect(charts.length).toBe(12);
});
