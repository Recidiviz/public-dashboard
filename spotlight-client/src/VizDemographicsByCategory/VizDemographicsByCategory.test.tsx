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

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
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
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("total chart", async () => {
  renderWithStore(<VizDemographicsByCategory metric={metric} />);

  await when(() => !metric.isLoading);

  const bubbles = screen.getByRole("group", { name: "nodes" });
  expect(bubbles).toBeVisible();
  expect(within(bubbles).getAllByRole("img", { name: /Node/ }).length).toBe(4);
});

test("demographic charts", async () => {
  renderWithStore(<VizDemographicsByCategory metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Race or Ethnicity" }));

  // pause for animated transition
  await waitFor(() => {
    expect(
      screen.getByRole("figure", { name: "Native American" })
    ).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "Black" })).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: "Hispanic" })
    ).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "White" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "Other" })).toBeInTheDocument();

    expect(
      screen.getAllByRole("group", { name: "4 bars in a bar chart" }).length
    ).toBe(5);
  });

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Gender" }));

  // pause for animated transition
  await waitFor(() => {
    expect(screen.getByRole("figure", { name: "Male" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "Female" })).toBeInTheDocument();

    expect(
      screen.getAllByRole("group", { name: "4 bars in a bar chart" }).length
    ).toBe(2);
  });

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Age Group" }));

  // pause for animated transition
  await waitFor(() => {
    expect(screen.getByRole("figure", { name: "<25" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "25-29" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "30-34" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "35-39" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "40<" })).toBeInTheDocument();

    expect(
      screen.getAllByRole("group", { name: "4 bars in a bar chart" }).length
    ).toBe(5);
  });
});
