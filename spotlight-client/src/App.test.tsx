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
jest.mock("@auth0/auth0-spa-js", () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    getUser: mockGetUser,
    isAuthenticated: mockIsAuthenticated,
    loginWithRedirect: mockLoginWithRedirect,
  })),
}));

/**
 * Convenience method for importing test module after updating environment
 */
async function getApp() {
  return (await import("./App")).default;
}

// mocking the node env is esoteric, see https://stackoverflow.com/a/48042799
const ORIGINAL_ENV = process.env;

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
  waitFor = (await import("@testing-library/dom")).waitFor;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  // dynamic imports break auto cleanup so we have to do it manually
  cleanup();
});

test("no auth required", async () => {
  const App = await getApp();
  render(<App />);
  // seems like a pretty safe bet this word will always be there somewhere!
  const websiteName = screen.getByRole("heading", { name: /spotlight/i });
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
    screen.queryByRole("heading", { name: /spotlight/i })
  ).not.toBeInTheDocument();
  expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
  await waitFor(() => {
    expect(mockLoginWithRedirect.mock.calls.length).toBe(1);
    // this should ... continue not being in the document
    expect(
      screen.queryByRole("heading", { name: /spotlight/i })
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

  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    // application contents should not have been rendered without verification
    expect(
      screen.queryByRole("heading", { name: /spotlight/i })
    ).not.toBeInTheDocument();
    // there should be a message about the verification requirement
    expect(
      screen.getByRole("heading", { name: /verification/i })
    ).toBeInTheDocument();
  });
});

test("renders when authenticated", async () => {
  // configure environment for valid authentication
  process.env.REACT_APP_AUTH_ENABLED = "true";
  process.env.REACT_APP_AUTH_ENV = "development";

  // user is authenticated and verified
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true });
  const App = await getApp();
  render(<App />);
  await waitFor(() => {
    const websiteName = screen.getByRole("heading", { name: /spotlight/i });
    expect(websiteName).toBeInTheDocument();
  });
});
