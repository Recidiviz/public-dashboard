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

import { render, screen, waitFor } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import VizHistoricalPopulationBreakdown from ".";
import HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import DataStore from "../DataStore";
import { InfoPanelProvider } from "../InfoPanel";

let metric: HistoricalPopulationBreakdownMetric;

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  const metricToTest = DataStore.tenant?.metrics.get(
    "PrisonPopulationHistorical"
  );
  // it will be
  if (metricToTest instanceof HistoricalPopulationBreakdownMetric) {
    metric = metricToTest;
  }
});

test("loading", () => {
  render(<VizHistoricalPopulationBreakdown metric={metric} />, {
    wrapper: InfoPanelProvider,
  });
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("renders total", async () => {
  render(<VizHistoricalPopulationBreakdown metric={metric} />, {
    wrapper: InfoPanelProvider,
  });

  await waitFor(() => {
    expect(
      screen.getAllByRole("group", {
        name: "1 stacked areas in a stacked area chart",
      }).length
    ).toBe(2); // there are 2 because one is the minimap
  });
  expect(
    screen.getByRole("img", {
      // TODO: this text seems ... questionable?
      name:
        "248 point stacked area starting value 961 at Jan 2000 ending value 1,321 at Aug 2020",
    })
  ).toBeVisible();
});
