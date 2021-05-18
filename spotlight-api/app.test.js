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

const request = require("supertest");
const { getFirstRecordFromFixture } = require("./testUtils");
const { app } = require("./app");

jest.mock("./utils/demoMode", () => {
  return {
    // use our filesystem data fixtures rather than hitting GCS
    isDemoMode: jest.fn().mockReturnValue(true),
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

test("/public endpoint", async () => {
  const response = await request(app)
    .post("/api/test_id/public")
    .send({
      metrics: ["racial_disparities", "incarceration_lengths_by_demographics"],
    });
  expect(response.status).toBe(200);
  expect(response.get("Content-Type")).toMatch("json");
  expect(response.body.racial_disparities).toContainEqual(
    getFirstRecordFromFixture("racial_disparities.json")
  );
  expect(response.body.incarceration_lengths_by_demographics).toContainEqual(
    getFirstRecordFromFixture("incarceration_lengths_by_demographics.json")
  );
});

test("cannot GET /public", async () => {
  const response = await request(app).get("/api/test_id/public");
  expect(response.status).toBe(404);
});

test("/public requires request format", async () => {
  // metrics must be included in body
  const responseMissing = await request(app).post("/api/test_id/public");
  expect(responseMissing.status).toBe(400);
  expect(responseMissing.body.error).toMatch("missing metrics");

  // metrics must be an array
  const responseWrongFormat = await request(app)
    .post("/api/test_id/public")
    .send({ metrics: "racial_disparities" });
  expect(responseWrongFormat.status).toBe(400);
  expect(responseWrongFormat.body.error).toMatch("missing metrics");
});

test("/public errors on nonexistent files", async () => {
  const response = await request(app)
    .post("/api/test_id/public")
    .send({
      metrics: ["racial_disparities", "this_file_does_not_exist"],
    });
  expect(response.status).toBe(500);
  expect(response.body.error).toMatch("not registered");
});
