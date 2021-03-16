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

import {
  act,
  screen,
  ByRoleMatcher,
  ByRoleOptions,
  within,
  fireEvent,
} from "@testing-library/react";
import testContent from "./contentApi/sources/us_nd";
import { renderNavigableApp, segmentMock } from "./testUtils";

describe("navigation", () => {
  /**
   * Convenience method that verifies page contents when loading a url directly,
   * navigating away from it, then navigating to it
   */
  async function verifyWithNavigation({
    targetPath,
    lookupArgs,
  }: {
    targetPath: string;
    // this doesn't really need to be readonly, it just makes it easier
    // to construct the array safely using `as const`
    lookupArgs: readonly [ByRoleMatcher, ByRoleOptions | undefined];
  }) {
    const {
      history: { navigate },
    } = renderNavigableApp({ route: targetPath });
    expect(screen.getByRole(...lookupArgs)).toBeInTheDocument();

    await act(() => navigate("/"));
    expect(screen.queryByRole(...lookupArgs)).not.toBeInTheDocument();

    await act(() => navigate(targetPath));
    expect(screen.getByRole(...lookupArgs)).toBeInTheDocument();
  }

  test("site home", () => {
    renderNavigableApp();
    // This can be replaced with something more distinctive once the page is designed and built
    expect(
      screen.getByRole("heading", { name: /spotlight/i, level: 1 })
    ).toBeVisible();
  });

  test("tenant home", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd";
    const lookupArgs = ["heading", { name: /North Dakota/, level: 1 }] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("single narrative page", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd/collections/prison";
    const lookupArgs = [
      "heading",
      {
        name: testContent.systemNarratives.Prison?.title,
        level: 1,
      },
    ] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("racial disparities narrative page", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd/collections/racial-disparities";
    const lookupArgs = [
      "heading",
      {
        name: "Racial Disparities",
        level: 1,
      },
    ] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("links", async () => {
    const {
      history: { navigate },
    } = renderNavigableApp();
    const inNav = within(screen.getByRole("navigation"));

    await act(() => navigate("/us-nd"));
    const homeLink = inNav.getByRole("link", { name: "Spotlight" });
    const tenantLink = inNav.getByRole("link", { name: "North Dakota" });
    const sentencingLink = screen.getByRole("link", { name: "Sentencing" });

    fireEvent.click(sentencingLink);
    expect(
      await screen.findByRole("heading", { name: "Sentencing", level: 1 })
    ).toBeInTheDocument();

    fireEvent.click(tenantLink);
    expect(
      await screen.findByRole("heading", {
        name: "Explore correctional data from North Dakota.",
        level: 1,
      })
    ).toBeInTheDocument();

    const disparitiesLink = screen.getByRole("link", {
      name: "Racial Disparities",
    });
    fireEvent.click(disparitiesLink);
    expect(
      await screen.findByRole("heading", {
        name: "Racial Disparities",
        level: 1,
      })
    ).toBeInTheDocument();

    fireEvent.click(homeLink);
    expect(
      await screen.findByRole("heading", { name: "Spotlight", level: 1 })
    ).toBeInTheDocument();
  });

  test.only("pageview tracking", async () => {
    segmentMock.page.mockReset();

    const {
      history: { navigate },
    } = renderNavigableApp();

    expect(document.title).toBe("Spotlight by Recidiviz");
    expect(segmentMock.page).toHaveBeenCalledTimes(1);

    await act(() => navigate("/us-nd/collections/prison"));

    expect(document.title).toBe(
      "Prison — North Dakota — Spotlight by Recidiviz"
    );
    expect(segmentMock.page).toHaveBeenCalledTimes(2);

    // in-page navigation doesn't trigger additional pageviews
    await act(() => navigate("/us-nd/collections/prison/2"));
    expect(segmentMock.page).toHaveBeenCalledTimes(2);
  });
});
