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

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { advanceTo, clear } from "jest-date-mock";
import { runInAction } from "mobx";
import React from "react";
import VizHistoricalPopulationBreakdown from ".";
import HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import DataStore from "../DataStore";
import { reactImmediately, renderWithStore } from "../testUtils";

let metric: HistoricalPopulationBreakdownMetric;

beforeEach(() => {
  // most recent month present in fixture
  advanceTo(new Date(2020, 7, 15));

  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "PrisonPopulationHistorical"
    );
    // it will be
    if (metricToTest instanceof HistoricalPopulationBreakdownMetric) {
      metric = metricToTest;
    }
  });
});

afterEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
  });
  clear();
});

test("loading", () => {
  renderWithStore(<VizHistoricalPopulationBreakdown metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("renders total", async () => {
  renderWithStore(<VizHistoricalPopulationBreakdown metric={metric} />);

  await waitFor(() => {
    expect(
      screen.getAllByRole("group", {
        name: "1 stacked areas in a stacked area chart",
      }).length
    ).toBe(2); // there are 2 because one is the minimap
  });

  expect(
    screen.getByRole("img", {
      // this text looks a little questionable, but that's because our test fixture
      // is not totally realistic (the real one has near-daily updates to keep moving
      // the 20-year window to the current month). It will include more than 240 points
      // if they are present in the data.
      name:
        "248 point stacked area starting value 961 at Jan 2000 ending value 1,321 at Aug 2020",
    })
  ).toBeVisible();
});

test("plots demographic categories", async () => {
  renderWithStore(<VizHistoricalPopulationBreakdown metric={metric} />);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);

  const raceOption = screen.getByRole("option", { name: "Race" });
  fireEvent.click(raceOption);

  // awaiting the first one because data may not have loaded yet
  await waitFor(() => {
    expect(
      screen.getAllByRole("group", {
        // 5 because there are 5 expected race categories
        name: "5 stacked areas in a stacked area chart",
      }).length
    ).toBe(2); // there are 2 because one is the minimap
  });

  fireEvent.click(menuButton);
  const genderOption = screen.getByRole("option", { name: "Gender" });
  fireEvent.click(genderOption);

  expect(
    screen.getAllByRole("group", {
      name: "2 stacked areas in a stacked area chart",
    }).length
  ).toBe(2);

  fireEvent.click(menuButton);

  const ageOption = screen.getByRole("option", { name: "Age" });
  fireEvent.click(ageOption);

  await waitFor(() => {
    expect(
      screen.getAllByRole("group", {
        name: "5 stacked areas in a stacked area chart",
      }).length
    ).toBe(2);
  });
});

// Unfortunately we can't test the time windowing by inspecting the markup,
// because it isn't reflected in any obvious way :(
