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

import { navigate } from "@reach/router";
import { fireEvent, screen, within } from "@testing-library/react";
import useBreakpoint from "@w11r/use-breakpoint";
import { runInAction } from "mobx";
import React from "react";
import DataStore from "../DataStore";
import { renderWithStore } from "../testUtils";
import SiteNavigationContainer from ".";

jest.mock("@w11r/use-breakpoint");
const useBreakpointMock = useBreakpoint as jest.Mock;

jest.mock("@reach/router", () => ({
  ...jest.requireActual("@reach/router"),
  navigate: jest.fn().mockResolvedValue(undefined),
}));
const navigateMock = navigate as jest.MockedFunction<typeof navigate>;

afterEach(() => {
  useBreakpointMock.mockReset();
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
  });
});

describe("on large screens", () => {
  test("nav bar", async () => {
    const dataPortalLabel = "Explore";
    const narrativesLabel = "Collections";

    renderWithStore(<SiteNavigationContainer />);

    const inNav = within(screen.getByRole("navigation"));

    expect(
      inNav.queryByRole("link", { name: dataPortalLabel })
    ).not.toBeInTheDocument();
    expect(
      inNav.queryByRole("link", { name: narrativesLabel })
    ).not.toBeInTheDocument();
    expect(
      inNav.queryByRole("button", { name: "Data Narratives" })
    ).not.toBeInTheDocument();

    runInAction(() => {
      DataStore.tenantStore.currentTenantId = "US_ND";
    });

    expect(inNav.getByRole("link", { name: "Spotlight" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(inNav.getByRole("link", { name: "North Dakota" })).toHaveAttribute(
      "href",
      "/us-nd"
    );
    expect(
      inNav.getByRole("button", { name: "Data Narratives" })
    ).toBeInTheDocument();
  });

  test("Narratives menu", () => {
    renderWithStore(<SiteNavigationContainer />);

    runInAction(() => {
      DataStore.tenantStore.currentTenantId = "US_ND";
    });

    const menuButton = screen.getByRole("button", { name: "Data Narratives" });
    fireEvent.click(menuButton);

    expect(screen.getByRole("option", { name: "Prison" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Probation" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Parole" })).toBeVisible();
    expect(
      screen.getByRole("option", { name: "Racial Disparities" })
    ).toBeVisible();

    fireEvent.click(screen.getByRole("option", { name: "Sentencing" }));

    expect(navigateMock).toHaveBeenCalledWith("/us-nd/collections/sentencing");
  });
});

describe("on small screens", () => {
  beforeEach(() => {
    useBreakpointMock.mockReturnValue(true);
    runInAction(() => {
      DataStore.tenantStore.currentTenantId = "US_ND";
    });
    renderWithStore(<SiteNavigationContainer />);
  });

  test("expandable mobile menu", () => {
    const nav = screen.getByRole("navigation");

    const menuButton = within(nav).getByRole("button", {
      name: "Toggle navigation menu",
    });
    expect(menuButton).toBeVisible();

    const menu = within(nav).getByTestId("NavMenu");
    // the library we use for the menu is animation-based so it doesn't totally work in JSDOM;
    // this attribute check is a decent proxy for its expand/collapse behavior though
    expect(menu).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(menuButton);

    expect(menu).toHaveAttribute("aria-hidden", "false");

    fireEvent.click(menuButton);

    expect(menu).toHaveAttribute("aria-hidden", "true");
  });

  test("menu contents", async () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: "Toggle navigation menu",
      })
    );
    const menu = screen.getByTestId("NavMenu");
    const navLinks = await within(menu).findAllByRole("link");

    expect(navLinks.length).toBe(7);

    expect(navLinks[0]).toHaveTextContent("Home");
    expect(navLinks[0]).toHaveAttribute("href", "/us-nd");

    expect(navLinks[1]).toHaveTextContent("Sentencing");
    expect(navLinks[1]).toHaveAttribute(
      "href",
      "/us-nd/collections/sentencing"
    );

    expect(navLinks[2]).toHaveTextContent("Prison");
    expect(navLinks[2]).toHaveAttribute("href", "/us-nd/collections/prison");

    expect(navLinks[3]).toHaveTextContent("Probation");
    expect(navLinks[3]).toHaveAttribute("href", "/us-nd/collections/probation");

    expect(navLinks[4]).toHaveTextContent("Parole");
    expect(navLinks[4]).toHaveAttribute("href", "/us-nd/collections/parole");

    expect(navLinks[5]).toHaveTextContent("Racial Disparities");
    expect(navLinks[5]).toHaveAttribute(
      "href",
      "/us-nd/collections/racial-disparities"
    );

    expect(navLinks[6]).toHaveTextContent("Feedback");
    expect(navLinks[6]).toHaveAttribute(
      "href",
      expect.stringContaining("docs.google.com/forms")
    );
  });

  test("menu closes after navigation", async () => {
    const menuButton = screen.getByRole("button", {
      name: "Toggle navigation menu",
    });
    fireEvent.click(menuButton);

    const menu = screen.getByTestId("NavMenu");
    const navLinks = await within(menu).findAllByRole("link");

    // exclude the last link because it doesn't navigate, it links out
    navLinks.slice(0, -2).forEach((linkEl) => {
      fireEvent.click(linkEl);
      expect(menu).toHaveAttribute("aria-hidden", "true");

      fireEvent.click(menuButton);
      expect(menu).toHaveAttribute("aria-hidden", "false");
    });

    fireEvent.click(screen.getByRole("link", { name: "Spotlight" }));
    expect(menu).toHaveAttribute("aria-hidden", "true");
  });
});
