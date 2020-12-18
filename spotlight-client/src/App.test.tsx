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
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import {
  act,
  render,
  screen,
  ByRoleMatcher,
  ByRoleOptions,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import React from "react";
import App from "./App";
import testContent from "./contentApi/sources/us_nd";

function renderNavigableApp({ route = "/" } = {}) {
  const history = createHistory(createMemorySource(route));

  return {
    ...render(
      <LocationProvider history={history}>
        <App />
      </LocationProvider>
    ),
    // tests can use history object to simulate navigation in a browser
    history,
  };
}

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

  test("explore page", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd/explore";
    const lookupArgs = ["heading", { name: "Explore Data", level: 1 }] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("single metric page", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd/explore/prison-population-current";
    const lookupArgs = [
      "heading",
      {
        name: testContent.metrics.PrisonPopulationCurrent?.name,
        level: 1,
      },
    ] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("narratives page", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd/narratives";
    const lookupArgs = ["heading", { name: "Collections", level: 1 }] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("nav bar", async () => {
    const dataPortalLabel = "Explore";
    const narrativesLabel = "Collections";

    const {
      history: { navigate },
    } = renderNavigableApp();
    const inNav = within(screen.getByRole("navigation"));

    expect(
      inNav.queryByRole("link", { name: dataPortalLabel })
    ).not.toBeInTheDocument();
    expect(
      inNav.queryByRole("link", { name: narrativesLabel })
    ).not.toBeInTheDocument();

    await act(() => navigate("/us-nd"));
    const homeLink = inNav.getByRole("link", { name: "Spotlight" });
    const tenantLink = inNav.getByRole("link", { name: "North Dakota" });
    const portalLink = inNav.getByRole("link", { name: dataPortalLabel });
    const narrativesLink = inNav.getByRole("link", { name: narrativesLabel });

    const verifyNavLinks = () => {
      expect(homeLink).toBeInTheDocument();
      expect(tenantLink).toBeInTheDocument();
      expect(portalLink).toBeInTheDocument();
      expect(narrativesLink).toBeInTheDocument();
    };

    fireEvent.click(portalLink);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Explore Data", level: 1 })
      ).toBeInTheDocument()
    );
    verifyNavLinks();

    fireEvent.click(narrativesLink);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Collections", level: 1 })
      ).toBeInTheDocument()
    );
    verifyNavLinks();

    fireEvent.click(tenantLink);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "North Dakota", level: 1 })
      ).toBeInTheDocument()
    );

    fireEvent.click(homeLink);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Spotlight", level: 1 })
      ).toBeInTheDocument()
    );
  });
});
