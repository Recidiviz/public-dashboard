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

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { render } from "@testing-library/react";
import React from "react";
import App from "./App";
import { getAuthSettings, isAuthEnabled } from "./AuthWall/utils";

test("does not explode", () => {
  const { getByRole } = render(<App />);
  // seems like a pretty safe bet this word will always be there somewhere!
  const websiteName = getByRole("heading", { name: /spotlight/i });
  expect(websiteName).toBeInTheDocument();
});

jest.mock("./AuthWall/utils", () => ({
  getAuthSettings: jest.fn(),
  isAuthEnabled: jest.fn(),
}));
const getAuthSettingsMock = getAuthSettings as jest.MockedFunction<
  typeof getAuthSettings
>;

const isAuthEnabledMock = isAuthEnabled as jest.MockedFunction<
  typeof isAuthEnabled
>;

// Although mocking the Auth0 library is not necessarily a great practice,
// it has a number of side effects (e.g. issuing XHRs, navigating to new URLs)
// that are challenging to handle or even simulate in this test environment,
// so this seemed like the better solution here
jest.mock("@auth0/auth0-react", () => {
  return {
    Auth0Provider: jest.fn(),
    useAuth0: jest.fn(),
  };
});

describe("with auth required", () => {
  const MOCK_DOMAIN = "test.local";
  const MOCK_CLIENT_ID = "abcdef";

  beforeEach(() => {
    // mock the environment configuration to enable auth
    getAuthSettingsMock.mockReturnValue({
      domain: MOCK_DOMAIN,
      clientId: MOCK_CLIENT_ID,
    });
    isAuthEnabledMock.mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("require auth for the entire site", async () => {
    // mock the auth0 provider
    const PROVIDER_TEST_ID = "Auth0Provider";
    (Auth0Provider as jest.Mock).mockImplementation(({ children }) => {
      // here we mock just enough to verify that the context provider is being included;
      // we can use this as a proxy for the relationship between provider and hook.
      return <div data-testid={PROVIDER_TEST_ID}>{children}</div>;
    });

    // mock the auth0 hook
    const mockLoginWithRedirect = jest.fn();
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });

    const { queryByRole, getByRole, getByTestId } = render(<App />);

    // verify that we have included an Auth0Provider
    expect(getByTestId(PROVIDER_TEST_ID)).toBeInTheDocument();

    // verify that we supplied that provider with
    // the settings designated by our mock environment
    expect((Auth0Provider as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({ domain: MOCK_DOMAIN, clientId: MOCK_CLIENT_ID })
    );

    // verify that we have initiated an Auth0 login
    expect(mockLoginWithRedirect.mock.calls.length).toBe(1);

    // application contents should not have been rendered unauthed
    expect(queryByRole("heading", { name: /spotlight/i })).toBeNull();
    expect(getByRole("status", { name: /loading/i })).toBeInTheDocument();
  });

  test("require email verification for authed users", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        email_verified: false,
      },
    });

    const { getByRole, queryByRole } = render(<App />);
    // application contents should not have been rendered without verification
    expect(queryByRole("heading", { name: /spotlight/i })).toBeNull();
    // there should be a message about the verification requirement
    expect(getByRole("heading", { name: /verification/i })).toBeInTheDocument();
  });

  test("loading state", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    const { queryByRole, getByRole } = render(<App />);

    // application contents should not have been rendered while auth is pending
    expect(queryByRole("heading", { name: /spotlight/i })).toBeNull();
    expect(getByRole("status", { name: /loading/i })).toBeInTheDocument();
  });
});
