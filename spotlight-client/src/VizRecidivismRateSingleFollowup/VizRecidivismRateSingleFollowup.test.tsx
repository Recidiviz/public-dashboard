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

import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { runInAction, when } from "mobx";
import React from "react";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import DataStore from "../DataStore";
import { reactImmediately, renderWithStore } from "../testUtils";
import VizRecidivismRateSingleFollowup from "./VizRecidivismRateSingleFollowup";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: RecidivismRateMetric;

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "PrisonRecidivismRateSingleFollowupHistorical"
    );
    // it will be
    if (metricToTest instanceof RecidivismRateMetric) {
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
  renderWithStore(<VizRecidivismRateSingleFollowup metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("total chart", async () => {
  renderWithStore(<VizRecidivismRateSingleFollowup metric={metric} />);

  await when(() => !metric.isLoading);

  const chart = screen.getByRole("group", { name: "8 bars in a bar chart" });
  expect(chart).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2009 bar value 27%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2010 bar value 57%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2011 bar value 39%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2012 bar value 38%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2013 bar value 40%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2014 bar value 37%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2015 bar value 30%" })
  ).toBeVisible();
  expect(
    within(chart).getByRole("img", { name: "2016 bar value 20%" })
  ).toBeVisible();
});

test("demographic charts", async () => {
  renderWithStore(<VizRecidivismRateSingleFollowup metric={metric} />);

  await when(() => !metric.isLoading);

  const totalChart = screen.getByRole("group", {
    name: "8 bars in a bar chart",
  });

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Race or Ethnicity" }));

  // pause for animated transition
  await waitForElementToBeRemoved(totalChart);

  const raceCharts = screen.getAllByRole("group", {
    name: "8 bars in a bar chart",
  });
  expect(raceCharts.length).toBe(5);

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Gender" }));

  // pause for animated transition
  await waitForElementToBeRemoved(raceCharts[0]);

  const genderCharts = screen.getAllByRole("group", {
    name: "8 bars in a bar chart",
  });
  expect(genderCharts.length).toBe(2);

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Age Group" }));

  // pause for animated transition
  await waitForElementToBeRemoved(genderCharts[0]);

  expect(
    screen.getAllByRole("group", { name: "8 bars in a bar chart" }).length
  ).toBe(5);
});

test("followup period filter", async () => {
  const menuButton = screen.getByRole("button", {
    name: "Follow-up Period 3 Years",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "1 Year" }));

  const threeYearChart = screen.getByRole("group", {
    name: "8 bars in a bar chart",
  });

  // pause for animated transition
  await waitForElementToBeRemoved(threeYearChart);

  const oneYearChart = screen.getByRole("group", {
    name: "10 bars in a bar chart",
  });
  expect(oneYearChart).toBeVisible();

  expect(menuButton).toHaveTextContent("Follow-up Period 1 Year");
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "5 Years" }));

  // pause for animated transition
  await waitForElementToBeRemoved(oneYearChart);

  expect(
    screen.getByRole("group", { name: "6 bars in a bar chart" })
  ).toBeVisible();
});
