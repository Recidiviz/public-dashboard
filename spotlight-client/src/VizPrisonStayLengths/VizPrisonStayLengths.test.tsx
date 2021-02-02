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
import { colors } from "../UiLibrary";
import VizPrisonStayLengths from "./VizPrisonStayLengths";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: DemographicsByCategoryMetric;

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "PrisonStayLengthAggregate"
    );
    // it will be
    if (metricToTest instanceof DemographicsByCategoryMetric) {
      metric = metricToTest;
    }
  });
});

afterEach(() => {
  runInAction(() => {
    // reset data store
    metric.demographicView = "total";
    DataStore.tenantStore.currentTenantId = undefined;
  });
});

test("loading", () => {
  renderWithStore(<VizPrisonStayLengths metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("total chart", async () => {
  renderWithStore(<VizPrisonStayLengths metric={metric} />);

  await when(() => !metric.isLoading);

  const chart = screen.getByRole("group", { name: "7 bars in a bar chart" });
  expect(chart).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "<1 year bar value 15%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "1–2 bar value 1%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2–3 bar value 17%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "3–5 bar value 31%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "5–10 bar value 26%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "10–20 bar value 1%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "20+ bar value 9%" })
  ).toBeVisible();
});

test("demographic charts", async () => {
  renderWithStore(<VizPrisonStayLengths metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Race or Ethnicity" }));

  // pause for animated transition
  await waitFor(() => {
    expect(
      screen.getAllByRole("group", { name: "7 bars in a bar chart" }).length
    ).toBe(5);
  });

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Gender" }));

  // pause for animated transition
  await waitFor(() => {
    expect(
      screen.getAllByRole("group", { name: "7 bars in a bar chart" }).length
    ).toBe(2);
  });

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Age Group" }));

  // pause for animated transition
  await waitFor(() => {
    expect(
      screen.getAllByRole("group", { name: "7 bars in a bar chart" }).length
    ).toBe(5);
  });
});

test("all bars are the same color", async () => {
  renderWithStore(<VizPrisonStayLengths metric={metric} />);

  await when(() => !metric.isLoading);

  const chart = screen.getByRole("group", { name: "7 bars in a bar chart" });

  within(chart)
    .getAllByRole("img")
    .forEach((el) =>
      expect(el).toHaveStyle(`fill: ${colors.dataVizNamed.get("teal")}`)
    );

  expect.hasAssertions();
});
