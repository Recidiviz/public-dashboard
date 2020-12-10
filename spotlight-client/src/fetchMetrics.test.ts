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

import fetchMetrics from "./fetchMetrics";
import { waitForTestServer } from "./testUtils";

test("returns fetched metrics", async () => {
  await waitForTestServer();
  // these are arbitrarily chosen to spot-check the API, nothing special about them
  const metricNames = [
    "active_program_participation_by_region",
    "supervision_success_by_month",
  ];

  const tenantId = "US_ND";

  const response = await fetchMetrics({
    metricNames,
    tenantId,
  });

  expect(Object.keys(response)).toEqual(metricNames);

  // these are records chosen at random from the spotlight-api data fixtures
  expect(response.active_program_participation_by_region).toEqual(
    expect.arrayContaining([
      {
        supervision_type: "PAROLE",
        participation_count: "21",
        state_code: "US_ND",
        region_id: "6",
        race_or_ethnicity: "ALL",
      },
    ])
  );
  expect(response.supervision_success_by_month).toEqual(
    expect.arrayContaining([
      {
        state_code: "US_ND",
        projected_year: "2019",
        projected_month: "8",
        district: "SOUTH_CENTRAL",
        supervision_type: "PROBATION",
        successful_termination_count: "43",
        projected_completion_count: "95",
        success_rate: 0.45263157894736844,
      },
    ])
  );
});

test("handles error responses", async () => {
  expect.assertions(2);

  await waitForTestServer();

  try {
    await fetchMetrics({
      metricNames: ["this_file_does_not_exist"],
      tenantId: "US_ND",
    });
  } catch (e) {
    expect(e.message).toMatch("500");
    expect(e.message).toMatch("not registered");
  }
});
