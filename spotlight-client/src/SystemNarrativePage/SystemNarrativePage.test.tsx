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

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import mockContentFixture from "./__fixtures__/contentSource";
import { SystemNarrativeContent } from "../contentApi/types";
import { renderNavigableApp } from "../testUtils";

jest.mock("../contentApi/sources/us_nd", () => mockContentFixture);

const narrativeContent = mockContentFixture.systemNarratives
  .Parole as SystemNarrativeContent;

test("renders all the sections", () => {
  renderNavigableApp({ route: "/us_nd/collections/parole" });

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

test("navigation", async () => {
  renderNavigableApp({
    route: "/us_nd/collections/parole",
  });

  const nextLabel = "next section";
  const prevLabel = "previous section";

  const navRegion = screen.getByRole("navigation", { name: "page sections" });

  const nextLink = screen.getByRole("link", { name: nextLabel });

  // no previous on the first section
  expect(
    screen.queryByRole("link", { name: prevLabel })
  ).not.toBeInTheDocument();
  expect(nextLink).toBeInTheDocument();

  expect(within(navRegion).getByText("01")).toBeInTheDocument();

  // advance to section 2
  fireEvent.click(nextLink);
  await waitFor(() => {
    expect(within(navRegion).getByText("02")).toBeInTheDocument();
  });

  const prevLink = screen.getByRole("link", { name: prevLabel });
  expect(prevLink).toBeInTheDocument();

  // advance to the last section
  narrativeContent.sections.forEach(() => fireEvent.click(nextLink));

  // both of the page numbers should be the same, e.g. 08/08
  expect(
    within(navRegion).getAllByText(`0${narrativeContent.sections.length + 1}`)
      .length
  ).toBe(2);

  // no next on the last section
  expect(nextLink).not.toBeInTheDocument();

  // Jest/JSDOM don't support layout features
  // so we can't really test anything related to scroll position :(
  // (this also includes URL management because of how the page works)
});

test("renders link tags in copy", async () => {
  // this fixture has links in the copy
  renderNavigableApp({ route: "/us_nd/collections/sentencing" });

  expect(screen.getByRole("link", { name: "intro link" })).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: "section copy link" })
  ).toBeInTheDocument();
});
