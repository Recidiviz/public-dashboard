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

import { AUTH0_APP_METADATA_KEY } from "./constants";

// we have to import everything dynamically to manipulate process.env,
// which is weird and Typescript doesn't like it, so silence these warnings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let waitFor: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cleanup: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let render: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let screen: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let React: any;

// this doesn't do anything but convince TypeScript this file is a module,
// since we don't have any top-level imports
export {};

// mocking the Auth0 library because JSDOM doesn't support all the APIs it needs
const mockGetUser = jest.fn();
const mockIsAuthenticated = jest.fn();
const mockLoginWithRedirect = jest.fn();
const mockGetIdTokenClaims = jest.fn();
jest.mock("@auth0/auth0-spa-js", () =>
  jest.fn().mockResolvedValue({
    getUser: mockGetUser,
    isAuthenticated: mockIsAuthenticated,
    loginWithRedirect: mockLoginWithRedirect,
    getIdTokenClaims: mockGetIdTokenClaims,
  })
);

/**
 * Convenience method for importing test module after updating environment
 */
async function getApp() {
  return (await import("./App")).default;
}

// mocking the node env is esoteric, see https://stackoverflow.com/a/48042799
const ORIGINAL_ENV = process.env;

const authenticatedTextMatch = /Spotlight/;

beforeEach(async () => {
  // make a copy that we can modify
  process.env = { ...ORIGINAL_ENV };

  jest.resetModules();
  // reimport all modules except the test module
  React = (await import("react")).default;
  const reactTestingLibrary = await import("@testing-library/react");
  render = reactTestingLibrary.render;
  screen = reactTestingLibrary.screen;
  cleanup = reactTestingLibrary.cleanup;
  waitFor = reactTestingLibrary.waitFor;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  // dynamic imports break auto cleanup so we have to do it manually
  cleanup();
});

test("no auth required", async () => {
  process.env.REACT_APP_AUTH_ENABLED = "false";

  const App = await getApp();
  render(<App />);
  // site home redirects to the ND home
  const websiteName = await screen.findByTestId("PageTitle");
  expect(websiteName).toHaveTextContent(authenticatedTextMatch);
  expect(websiteName).toBeInTheDocument();
});

test("requires authentication", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is not currently authenticated
  mockIsAuthenticated.mockResolvedValue(false);

  const App = await getApp();
  render(<App />);

  expect(
    screen.queryByRole("heading", { name: authenticatedTextMatch })
  ).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  await waitFor(() => {
    expect(mockLoginWithRedirect.mock.calls.length).toBe(1);
    // this should ... continue not being in the document
    expect(
      screen.queryByRole("heading", { name: authenticatedTextMatch })
    ).not.toBeInTheDocument();
  });
});

test("requires email verification", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is authenticated but not verified
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: false });
  mockGetIdTokenClaims.mockResolvedValue({});

  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    // application contents should not have been rendered without verification
    expect(screen.queryByTestId("PageTitle")).not.toBeInTheDocument();
    // there should be a message about the verification requirement
    expect(
      screen.getByRole("heading", { name: /verification/i, hidden: true })
    ).toBeInTheDocument();
  });
});

test("renders when authenticated and state_code is 'recidiviz'", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is authenticated and verified and assigned a valid state_code
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true });
  mockGetIdTokenClaims.mockResolvedValue({
    [AUTH0_APP_METADATA_KEY]: {
      state_code: "recidiviz",
    },
  });
  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    const websiteName = screen.getByRole("heading", {
      name: authenticatedTextMatch,
    });
    expect(websiteName).toBeInTheDocument();
  });
});

test("renders when authenticated and state_code is one of our tenants", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is authenticated and verified and assigned a valid state_code
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true });
  mockGetIdTokenClaims.mockResolvedValue({
    [AUTH0_APP_METADATA_KEY]: {
      state_code: "us_nd",
    },
  });
  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    const websiteName = screen.getAllByRole("heading", /North Dakota/i)?.[0];
    expect(websiteName).toBeInTheDocument();
  });
});

test("renders when authenticated and state_code is NOT one of our tenants", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is authenticated and verified and assigned a valid state_code
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true });
  mockGetIdTokenClaims.mockResolvedValue({
    [AUTH0_APP_METADATA_KEY]: {
      state_code: "invalid",
    },
  });
  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    const websiteName = screen.getByRole("heading", /Page Not Found/i);
    expect(websiteName).toBeInTheDocument();
  });
});

test("renders when authenticated and state_code is NOT set", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is authenticated and verified and assigned a valid state_code
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true });
  mockGetIdTokenClaims.mockResolvedValue({
    [AUTH0_APP_METADATA_KEY]: {},
  });
  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    const websiteName = screen.getByRole("heading", /Page Not Found/i);
    expect(websiteName).toBeInTheDocument();
  });
});

test("handles an Auth0 configuration error", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  // no config exists for this environment
  process.env.REACT_APP_AUTH_ENV = "production";
  mockIsAuthenticated.mockResolvedValue(false);

  const App = await getApp();
  render(<App />);

  await waitFor(() => {
    expect(
      screen.getByRole("heading", /an error occurred/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: authenticatedTextMatch })
    ).not.toBeInTheDocument();
  });
});
