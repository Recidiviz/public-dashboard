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
  renderNavigableApp({ route: "/us-nd/collections/parole" });

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

test("navigate to previous and next section", async () => {
  const { history } = renderNavigableApp({
    route: "/us-nd/collections/parole",
  });

  const nextLabel = "next section";
  const prevLabel = "previous section";

  const navRegion = screen.getByRole("navigation", { name: "page sections" });

  const nextLink = screen.getByRole("link", { name: nextLabel });

  // no previous on the first section
  expect(screen.queryByRole("link", { name: prevLabel })).toHaveAttribute(
    "aria-disabled",
    "true"
  );
  expect(nextLink).toBeInTheDocument();

  expect(within(navRegion).getByText("01")).toBeInTheDocument();

  // advance to section 2
  fireEvent.click(nextLink);

  await waitFor(() => {
    expect(within(navRegion).getByText("02")).toBeInTheDocument();
  });
  expect(history.location.pathname).toBe("/us-nd/collections/parole/2");

  const prevLink = screen.getByRole("link", { name: prevLabel });
  expect(prevLink).toBeInTheDocument();

  // return to section 1 again
  fireEvent.click(prevLink);
  await waitFor(() =>
    expect(within(navRegion).getByText("01")).toBeInTheDocument()
  );
  expect(screen.queryByRole("link", { name: prevLabel })).toHaveAttribute(
    "aria-disabled",
    "true"
  );

  // advance to the last section
  history.navigate(
    `/us-nd/collections/parole/${narrativeContent.sections.length + 1}`
  );

  await waitFor(() => {
    // both of the page numbers should be the same, e.g. 08/08
    expect(
      within(navRegion).getAllByText(`0${narrativeContent.sections.length + 1}`)
        .length
    ).toBe(2);
  });

  // no next on the last section
  expect(
    // the element referenced by nextLink is still present,
    // but it no longer has role=link
    screen.queryByRole("link", { name: nextLabel })
  ).toHaveAttribute("aria-disabled", "true");

  // JSDOM don't support layout features
  // so we can't really test anything related to scroll position :(
});

test("navigate directly to any section", async () => {
  const { history } = renderNavigableApp({
    route: "/us-nd/collections/parole",
  });

  const navRegion = screen.getByRole("navigation", { name: "page sections" });

  await Promise.all(
    narrativeContent.sections.map(async (section, index) => {
      const linkToSection = within(navRegion).getByRole("link", {
        name: section.title,
      });

      fireEvent.click(linkToSection);

      await waitFor(() =>
        expect(history.location.pathname).toBe(
          `/us-nd/collections/parole/${index + 2}`
        )
      );
    })
  );

  const introLink = within(navRegion).getByRole("link", {
    name: narrativeContent.title,
  });

  fireEvent.click(introLink);

  await waitFor(() =>
    expect(history.location.pathname).toBe("/us-nd/collections/parole/1")
  );
});

test("renders link tags in copy", async () => {
  // this fixture has links in the copy
  renderNavigableApp({ route: "/us-nd/collections/sentencing" });

  expect(screen.getByRole("link", { name: "intro link" })).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: "section copy link" })
  ).toBeInTheDocument();
});

test("includes links to other narratives", () => {
  renderNavigableApp({ route: "/us-nd/collections/parole" });

  const nav = screen.getByRole("navigation", { name: "collections" });

  const otherLink = within(nav).getByRole("link", {
    name: mockContentFixture.systemNarratives.Sentencing?.title,
  });

  expect(otherLink).toBeInTheDocument();
  expect(otherLink).toHaveAttribute("href", "/us-nd/collections/sentencing");

  expect(
    within(nav).queryByRole("link", { name: narrativeContent.title })
  ).not.toBeInTheDocument();

  expect(
    within(nav).getByRole("link", { name: "Back to Data Narratives" })
  ).toBeInTheDocument();
});
