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
import VizPopulationBreakdownByLocation from ".";
import PopulationBreakdownByLocationMetric from "../contentModels/PopulationBreakdownByLocationMetric";
import DataStore from "../DataStore";
import { reactImmediately, renderWithStore } from "../testUtils";
import { colors } from "../UiLibrary";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: PopulationBreakdownByLocationMetric;

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "PrisonPopulationCurrent"
    );
    // it will be
    if (metricToTest instanceof PopulationBreakdownByLocationMetric) {
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
  renderWithStore(<VizPopulationBreakdownByLocation metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("total counts", async () => {
  renderWithStore(<VizPopulationBreakdownByLocation metric={metric} />);

  await waitFor(() => {
    const stat = screen.getByLabelText("Total people in prison");
    expect(stat).toBeVisible();
    expect(within(stat).getByText("2,041")).toBeVisible();
  });

  const raceChart = screen.getByRole("figure", { name: "Race or Ethnicity" });
  expect(
    within(raceChart).getByRole("group", { name: "5 bars in a bar chart" })
  ).toBeVisible();
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 244",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[0]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 96",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[1]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 123",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[2]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 671",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[3]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 12",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[4]}`);

  const ageChart = screen.getByRole("figure", { name: "Age Group" });
  expect(
    within(ageChart).getByRole("group", { name: "7 bars in a bar chart" })
  ).toBeVisible();
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 146",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[0]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 284",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[1]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 376",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[2]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 45",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[3]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 66",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[4]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 104",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[5]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 51",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[6]}`);

  const genderChart = screen.getByRole("figure", { name: "Gender" });
  expect(
    within(genderChart).getByRole("group", { name: "2 bars in a bar chart" })
  ).toBeVisible();
  expect(
    within(genderChart).getByRole("img", {
      name: "Gender bar value 661",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[0]}`);
  expect(
    within(genderChart).getByRole("img", {
      name: "Gender bar value 67",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[1]}`);
});

test("counts filtered by locality", async () => {
  renderWithStore(<VizPopulationBreakdownByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  // locality filter
  const menuButton = screen.getByRole("button", {
    name: "Facility All Facilities",
  });
  fireEvent.click(menuButton);

  const option = screen.getByRole("option", {
    name: "North Dakota State Penitentiary",
  });
  fireEvent.click(option);

  await waitFor(() => {
    const stat = screen.getByLabelText("Total people in prison");
    expect(within(stat).getByText("413")).toBeVisible();
  });

  const raceChart = screen.getByRole("figure", { name: "Race or Ethnicity" });
  expect(
    within(raceChart).getByRole("group", { name: "5 bars in a bar chart" })
  ).toBeVisible();
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 99",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[0]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 124",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[1]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 71",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[2]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 299",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[3]}`);
  expect(
    within(raceChart).getByRole("img", {
      name: "Race or Ethnicity bar value 10",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[4]}`);

  const ageChart = screen.getByRole("figure", { name: "Age Group" });
  expect(
    within(ageChart).getByRole("group", { name: "7 bars in a bar chart" })
  ).toBeVisible();
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 58",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[0]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 82",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[1]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 249",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[2]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 172",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[3]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 15",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[4]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 26",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[5]}`);
  expect(
    within(ageChart).getByRole("img", {
      name: "Age Group bar value 23",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[6]}`);

  const genderChart = screen.getByRole("figure", { name: "Gender" });
  expect(
    within(genderChart).getByRole("group", { name: "2 bars in a bar chart" })
  ).toBeVisible();
  expect(
    within(genderChart).getByRole("img", {
      name: "Gender bar value 850",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[0]}`);
  expect(
    within(genderChart).getByRole("img", {
      name: "Gender bar value 1",
    })
  ).toHaveStyle(`fill: ${colors.dataViz[1]}`);
});
