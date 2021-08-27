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

import { screen, within } from "@testing-library/react";
import mockContentFixture from "./__fixtures__/contentSource";
import { SystemNarrativeContent } from "../contentApi/types";
import { renderNavigableApp } from "../testUtils";
import { NarrativesSlug } from "../routerUtils/types";

jest.mock("../contentApi/sources/us_nd", () => mockContentFixture);

const narrativeContent = mockContentFixture.systemNarratives
  .Parole as SystemNarrativeContent;

test("renders all the sections", () => {
  renderNavigableApp({ route: `/us-nd/${NarrativesSlug}/parole` });

  expect(
    screen.getByRole("heading", { name: narrativeContent.title, level: 1 })
  ).toBeVisible();
  expect(screen.getByText(narrativeContent.introduction)).toBeInTheDocument();

  narrativeContent.sections.forEach((section) => {
    expect(
      screen.getByRole("heading", { name: section.title })
    ).toBeInTheDocument();
    expect(screen.getByText(section.body)).toBeInTheDocument();
  });
});

test("renders link tags in copy", async () => {
  // this fixture has links in the copy
  renderNavigableApp({ route: `/us-nd/${NarrativesSlug}/sentencing` });

  expect(screen.getByRole("link", { name: "intro link" })).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: "section copy link" })
  ).toBeInTheDocument();
});

test("includes links to other narratives", () => {
  renderNavigableApp({ route: `/us-nd/${NarrativesSlug}/parole` });

  const nav = screen.getByRole("navigation", { name: "data narratives" });

  const otherLink = within(nav).getByRole("link", {
    name: `${mockContentFixture.systemNarratives.Sentencing?.title} Data`,
  });

  expect(otherLink).toBeInTheDocument();
  expect(otherLink).toHaveAttribute(
    "href",
    `/us-nd/${NarrativesSlug}/sentencing`
  );

  expect(
    within(nav).queryByRole("link", { name: narrativeContent.title })
  ).not.toBeInTheDocument();

  expect(
    within(nav).getByRole("link", { name: "Back to Data Narratives" })
  ).toBeInTheDocument();
});
