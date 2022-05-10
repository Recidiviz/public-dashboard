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
  waitFor,
} from "@testing-library/react";
import { isTenantEnabled } from "./contentApi/isTenantEnabled";
import testContent from "./contentApi/sources/us_nd";
import { NarrativesSlug } from "./routerUtils/types";
import { renderNavigableApp, resetSegmentMock, segmentMock } from "./testUtils";

jest.mock("./contentApi/isTenantEnabled", () => ({
  isTenantEnabled: jest.fn(),
}));

const isTenantEnabledMock = isTenantEnabled as jest.MockedFunction<
  typeof isTenantEnabled
>;

beforeEach(() => {
  isTenantEnabledMock.mockReturnValue(true);
});

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

  test("site home", async () => {
    renderNavigableApp();
    expect(
      await screen.findByRole("heading", { name: /Spotlight/, level: 1 })
    ).toBeVisible();
  });

  test("tenant home", () => {
    expect.hasAssertions();
    const targetPath = "/us-nd";
    const lookupArgs = ["heading", { name: /DOCR/, level: 1 }] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("single narrative page", () => {
    expect.hasAssertions();
    const targetPath = `/us-nd/${NarrativesSlug}/prison`;
    const lookupArgs = [
      "heading",
      {
        name: testContent.systemNarratives.Prison?.title,
        level: 1,
      },
    ] as const;

    return verifyWithNavigation({ targetPath, lookupArgs });
  });

  test("racial disparities narrative page", async () => {
    expect.hasAssertions();
    const targetPath = `/us-nd/${NarrativesSlug}/racial-disparities`;
    const lookupArgs = [
      "heading",
      {
        name: "Racial Disparities",
        level: 1,
      },
    ] as const;

    // because of loading states this page is different than the others
    const {
      history: { navigate },
    } = renderNavigableApp({ route: targetPath });
    expect(await screen.findByRole(...lookupArgs)).toBeInTheDocument();

    await act(() => navigate("/"));
    expect(screen.queryByRole(...lookupArgs)).not.toBeInTheDocument();

    await act(() => navigate(targetPath));
    expect(screen.getByRole(...lookupArgs)).toBeInTheDocument();
  });

  test("links", async () => {
    renderNavigableApp({ route: "/us-nd" });

    const inNav = within(screen.getByRole("navigation"));

    const homeLink = inNav.getByRole("link", { name: "Spotlight" });
    const tenantLink = inNav.getByRole("link", {
      name: "North Dakota Department of Corrections and Rehabilitation",
    });
    const sentencingLink = await screen.findByRole("link", {
      name: "Explore Prison Data",
    });

    fireEvent.click(sentencingLink);
    // NOTE: *ByRole queries can be too expensive to run async with this much DOM,
    // so we are using *ByTestId queries here instead
    await waitFor(async () =>
      expect(await screen.findByTestId("PageTitle")).toHaveTextContent("Prison")
    );

    fireEvent.click(tenantLink);
    await waitFor(async () =>
      expect(await screen.findByTestId("PageTitle")).toHaveTextContent("DOCR")
    );

    expect(screen.queryByText("Sentencing Data")).not.toBeInTheDocument();

    fireEvent.click(homeLink);
    await waitFor(async () =>
      expect(await screen.findByTestId("PageTitle")).toHaveTextContent(
        "Spotlight"
      )
    );
  });

  test("pageview tracking", async () => {
    resetSegmentMock();

    const {
      history: { navigate },
    } = renderNavigableApp({ route: "/us-nd" });

    expect(document.title).toBe("North Dakota — Spotlight by Recidiviz");
    expect(segmentMock.page).toHaveBeenCalledTimes(1);

    await act(() => navigate(`/us-nd/${NarrativesSlug}/prison`));

    expect(document.title).toBe(
      "Prison — North Dakota — Spotlight by Recidiviz"
    );
    expect(segmentMock.page).toHaveBeenCalledTimes(2);

    await act(() => navigate(`/us-nd/${NarrativesSlug}/sentencing`));

    expect(document.title).toBe(
      "Sentencing — North Dakota — Spotlight by Recidiviz"
    );
    expect(segmentMock.page).toHaveBeenCalledTimes(3);
  });

  describe("invalid URLs", () => {
    const notFoundRoleArgs = [
      "heading",
      { name: /page not found/i, level: 1 },
    ] as [ByRoleMatcher, ByRoleOptions];

    test("invalid tenant", async () => {
      renderNavigableApp({ route: "/invalid" });

      expect(screen.getByRole(...notFoundRoleArgs)).toBeVisible();
      expect(document.title).toBe("Page not found — Spotlight by Recidiviz");

      fireEvent.click(screen.getByRole("link", { name: "Spotlight" }));

      await waitFor(() =>
        expect(screen.queryByRole(...notFoundRoleArgs)).not.toBeInTheDocument()
      );
    });

    test("valid tenant with invalid path", async () => {
      renderNavigableApp({ route: "/us-nd/invalid" });
      expect(screen.getByRole(...notFoundRoleArgs)).toBeVisible();
      expect(document.title).toBe(
        "Page not found — North Dakota — Spotlight by Recidiviz"
      );

      // navigation within the tenant should be available
      expect(
        screen.getByRole("button", { name: "Data Narratives" })
      ).toBeVisible();
      fireEvent.click(
        screen.getByRole("link", {
          name: "North Dakota Department of Corrections and Rehabilitation",
        })
      );

      await waitFor(() =>
        expect(screen.queryByRole(...notFoundRoleArgs)).not.toBeInTheDocument()
      );
    });

    test("invalid narrative", async () => {
      renderNavigableApp({ route: `/us-nd/${NarrativesSlug}/invalid` });
      expect(screen.getByRole(...notFoundRoleArgs)).toBeVisible();
      expect(document.title).toBe(
        "Page not found — North Dakota — Spotlight by Recidiviz"
      );

      // navigation within the tenant should be available
      expect(
        screen.getByRole("button", { name: "Data Narratives" })
      ).toBeVisible();
      fireEvent.click(
        screen.getByRole("link", {
          name: "North Dakota Department of Corrections and Rehabilitation",
        })
      );

      await waitFor(() =>
        expect(screen.queryByRole(...notFoundRoleArgs)).not.toBeInTheDocument()
      );
    });

    test("disabled tenant", async () => {
      isTenantEnabledMock.mockReturnValue(false);

      renderNavigableApp({ route: "/us-pa" });

      expect(screen.getByRole(...notFoundRoleArgs)).toBeVisible();
      expect(document.title).toBe("Page not found — Spotlight by Recidiviz");

      fireEvent.click(screen.getByRole("link", { name: "Spotlight" }));

      await waitFor(() =>
        expect(screen.queryByRole(...notFoundRoleArgs)).not.toBeInTheDocument()
      );
    });
  });
});
