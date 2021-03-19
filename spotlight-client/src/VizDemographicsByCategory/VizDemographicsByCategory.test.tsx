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

import { screen, waitFor, within } from "@testing-library/react";
import { runInAction, when } from "mobx";
import React from "react";
import DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import DataStore from "../DataStore";
import { reactImmediately, renderWithStore } from "../testUtils";
import VizDemographicsByCategory from "./VizDemographicsByCategory";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: DemographicsByCategoryMetric;

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "ProbationRevocationsAggregate"
    );
    // it will be
    if (metricToTest instanceof DemographicsByCategoryMetric) {
      metric = metricToTest;
    }
  });
});

afterEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
  });
});

test("loading", () => {
  renderWithStore(<VizDemographicsByCategory metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("total chart", async () => {
  renderWithStore(<VizDemographicsByCategory metric={metric} />);

  await when(() => !metric.isLoading);

  const bubbles = screen.getByRole("group", { name: "nodes" });
  expect(bubbles).toBeInTheDocument();
  expect(within(bubbles).getAllByRole("img", { name: /Node/ }).length).toBe(4);
});

// tests for demographic charts don't work because of inconsistent SVG support in JSDOM;
// see https://github.com/jsdom/jsdom/issues/2531 for a (not super helpful) explanation
// of the error that occurs
