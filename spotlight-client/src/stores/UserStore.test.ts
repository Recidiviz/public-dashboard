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

import { Auth0Client } from "@auth0/auth0-spa-js";
import { ERROR_MESSAGES } from "../constants";
import UserStore from "./UserStore";

const mockGetUser = jest.fn();
const mockHandleRedirectCallback = jest.fn();
const mockIsAuthenticated = jest.fn();
const mockLoginWithRedirect = jest.fn();

jest.mock("@auth0/auth0-spa-js", () => ({
  // mocking the Auth0 library because JSDOM doesn't support all the APIs it needs
  Auth0Client: jest.fn().mockImplementation(() => ({
    getUser: mockGetUser,
    handleRedirectCallback: mockHandleRedirectCallback,
    isAuthenticated: mockIsAuthenticated,
    loginWithRedirect: mockLoginWithRedirect,
  })),
}));

const MockAuth0Client = Auth0Client as jest.MockedClass<typeof Auth0Client>;

const testAuthSettings = {
  domain: "example.com",
  client_id: "abc123",
  redirect_url: window.location.href,
};

afterEach(() => {
  MockAuth0Client.mockClear();
});

test("immediately authorized when auth is not required", async () => {
  const store = new UserStore({ isAuthRequired: false });
  expect(store.isAuthorized).toBe(true);
  expect(store.isLoading).toBe(false);
});

test("authorization immediately pending when required", async () => {
  const store = new UserStore({ isAuthRequired: true });
  expect(store.isAuthorized).toBe(false);
  expect(store.isLoading).toBe(true);
});

test("authorize requires Auth0 client settings", async () => {
  const store = new UserStore({ isAuthRequired: true });
  const error = (await store.authorize()) as Error;
  expect(error.message).toMatch(ERROR_MESSAGES.auth0Configuration);
});

test("authorized when authenticated", async () => {
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true });

  const store = new UserStore({
    authSettings: testAuthSettings,
    isAuthRequired: true,
  });
  await store.authorize();
  expect(store.isAuthorized).toBe(true);
  expect(store.isLoading).toBe(false);
});

test("redirect to Auth0 when unauthenticated", async () => {
  mockIsAuthenticated.mockResolvedValue(false);
  expect(mockLoginWithRedirect.mock.calls.length).toBe(0);

  const store = new UserStore({
    authSettings: testAuthSettings,
    isAuthRequired: true,
  });
  await store.authorize();
  expect(mockLoginWithRedirect.mock.calls.length).toBe(1);
});

test("requires email verification", async () => {
  process.env.REACT_APP_AUTH_ENV = "development";

  mockGetUser.mockResolvedValue({ email_verified: false });
  mockIsAuthenticated.mockResolvedValue(true);

  const store = new UserStore({
    authSettings: testAuthSettings,
    isAuthRequired: true,
  });
  await store.authorize();

  expect(store.isAuthorized).toBe(false);
  expect(store.awaitingVerification).toBe(true);
});

test("handles Auth0 token params", async () => {
  const auth0LoginParams = "code=123456&state=abcdef";
  const urlWithToken = new URL(window.location.href);
  urlWithToken.search = `?${auth0LoginParams}`;
  window.history.pushState({}, "Test", urlWithToken.href);

  // sanity check on our initial url state
  expect(window.location.href).toMatch(auth0LoginParams);

  const store = new UserStore({
    authSettings: testAuthSettings,
    isAuthRequired: true,
  });
  await store.authorize();

  expect(mockHandleRedirectCallback.mock.calls.length).toBe(1);
  expect(window.location.href).not.toMatch(auth0LoginParams);
});
