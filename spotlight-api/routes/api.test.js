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

const { fetchMetricsByName } = require("../core/metricsApi");
const { metricsByName } = require("./api");

jest.mock("../core/metricsApi");

beforeEach(() => {
  fetchMetricsByName.mockImplementation(
    (tenantId, metrics, isDemoMode, responder) => {
      responder(undefined, "passed");
    }
  );
});

test("retrieves metrics if auth is disabled", async () => {
  process.env.AUTH_ENABLED = "false";
  const mockFn = jest.fn();
  metricsByName(
    {
      params: {
        tenantId: "US_ND",
      },
      body: {
        metrics: ["test_metric"],
      },
    },
    {
      send: mockFn,
    }
  );
  expect(mockFn).toHaveBeenCalledWith("passed");
});

test("returns 401 if there is no metrics array in the request body", async () => {
  process.env.AUTH_ENABLED = "false";
  const mockSendFn = jest.fn();
  const mockStatusFn = jest.fn();
  metricsByName(
    {
      params: {
        tenantId: "US_ND",
      },
      body: {},
    },
    {
      status: () => ({ json: mockStatusFn }),
      send: mockSendFn,
    }
  );
  expect(mockSendFn).not.toHaveBeenCalled();
  expect(mockStatusFn).toHaveBeenCalledWith({
    error: "request is missing metrics array parameter",
  });
});

test("retrieves metrics if auth is enabled and user state code is 'recidiviz'", async () => {
  process.env.AUTH_ENABLED = "true";
  process.env.AUTH0_APP_METADATA_KEY = "TEST_KEY";
  const mockFn = jest.fn();
  metricsByName(
    {
      params: {
        tenantId: "US_ND",
      },
      body: {
        metrics: ["test_metric"],
      },
      user: {
        [process.env.AUTH0_APP_METADATA_KEY]: {
          state_code: "recidiviz",
        },
      },
    },
    {
      send: mockFn,
    }
  );
  expect(mockFn).toHaveBeenCalledWith("passed");
});

test("retrieves metrics if auth is enabled and user state code matches the request param", async () => {
  process.env.AUTH_ENABLED = "true";
  process.env.AUTH0_APP_METADATA_KEY = "TEST_KEY";
  const mockFn = jest.fn();
  metricsByName(
    {
      params: {
        tenantId: "US_ND",
      },
      body: {
        metrics: ["test_metric"],
      },
      user: {
        [process.env.AUTH0_APP_METADATA_KEY]: {
          state_code: "us_nd",
        },
      },
    },
    {
      send: mockFn,
    }
  );
  expect(mockFn).toHaveBeenCalledWith("passed");
});

test("returns 401 if auth is enabled and user state code doesn't match the request param", async () => {
  process.env.AUTH_ENABLED = "true";
  process.env.AUTH0_APP_METADATA_KEY = "TEST_KEY";
  const mockStatusFn = jest.fn((number) => (json) => json);
  const mockSendFn = jest.fn();
  metricsByName(
    {
      params: {
        tenantId: "US_PA",
      },
      body: {
        metrics: ["test_metric"],
      },
      user: {
        [process.env.AUTH0_APP_METADATA_KEY]: {
          state_code: "us_nd",
        },
      },
    },
    {
      status: () => ({ json: mockStatusFn }),
      send: mockSendFn,
    }
  );
  expect(mockSendFn).not.toHaveBeenCalled();
  expect(mockStatusFn).toHaveBeenCalledWith({
    error: "User is not a member of the requested tenant US_PA",
  });
});
