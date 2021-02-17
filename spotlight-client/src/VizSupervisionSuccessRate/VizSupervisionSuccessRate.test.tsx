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

import { fireEvent, screen, within } from "@testing-library/react";
import { advanceTo, clear } from "jest-date-mock";
import { runInAction } from "mobx";
import React from "react";
import SupervisionSuccessRateMetric from "../contentModels/SupervisionSuccessRateMetric";
import DataStore from "../DataStore";
import { reactImmediately, renderWithStore } from "../testUtils";
import VizSupervisionSuccessRate from "./VizSupervisionSuccessRate";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: SupervisionSuccessRateMetric;

let originalFilters: {
  demographicView: SupervisionSuccessRateMetric["demographicView"];
};

beforeEach(() => {
  // last month in data fixture
  advanceTo(new Date(2020, 6, 2));

  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "ParoleSuccessHistorical"
    );
    // it will be
    if (metricToTest instanceof SupervisionSuccessRateMetric) {
      metric = metricToTest;
      originalFilters = {
        demographicView: metric.demographicView,
      };
    }
  });
});

afterEach(() => {
  clear();

  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
    metric.demographicView = originalFilters.demographicView;
  });
});

test("loading", () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("totals", async () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);

  const chart = await screen.findByRole("group", {
    name: "36 bars in a bar chart",
  });
  expect(chart).toBeVisible();

  // spot check one bar
  expect(
    within(chart).getByRole("img", { name: "Oct 2017 bar value 75%" })
  ).toBeVisible();

  // year boundaries should be labeled
  expect(screen.getByText("2018")).toBeVisible();
  expect(screen.getByText("2019")).toBeVisible();
  expect(screen.getByText("2020")).toBeVisible();
});

test("locality filter", async () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);

  const chart = await screen.findByRole("group", {
    name: "36 bars in a bar chart",
  });

  // locality filter
  const menuButton = screen.getByRole("button", {
    name: "Office All Offices",
  });
  fireEvent.click(menuButton);

  const option = screen.getByRole("option", {
    name: "Grand Forks",
  });
  fireEvent.click(option);

  // spot check one bar
  expect(
    within(chart).getByRole("img", { name: "Oct 2017 bar value 67%" })
  ).toBeVisible();
});

test.todo("demographic filter");
