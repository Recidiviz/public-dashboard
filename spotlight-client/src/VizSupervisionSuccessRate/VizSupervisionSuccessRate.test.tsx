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
import { DemographicView, getDemographicViewLabel } from "../demographics";
import { reactImmediately, renderWithStore } from "../testUtils";
import VizSupervisionSuccessRate from "./VizSupervisionSuccessRate";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: SupervisionSuccessRateMetric;

let originalFilters: {
  demographicView: SupervisionSuccessRateMetric["demographicView"];
  localityId: SupervisionSuccessRateMetric["localityId"];
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
        localityId: metric.localityId,
      };
    }
  });
});

afterEach(() => {
  clear();

  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
    metric.demographicView = originalFilters.demographicView;
    metric.localityId = originalFilters.localityId;
  });
});

test("loading", () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("totals", async () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);

  const chart = await screen.findByRole("group", {
    name: "36 bars in a bar chart",
  });
  expect(chart).toBeInTheDocument();

  // spot check one bar
  expect(
    within(chart).getByRole("img", { name: "Oct 2017 bar value 75%" })
  ).toBeInTheDocument();

  // year boundaries should be labeled
  expect(screen.getByText("2018")).toBeInTheDocument();
  expect(screen.getByText("2019")).toBeInTheDocument();
  expect(screen.getByText("2020")).toBeInTheDocument();

  const stat = screen.getByRole("figure", { name: "Total" });
  expect(within(stat).getByText("58%")).toBeInTheDocument();
});

test("locality filter", async () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);

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
    await screen.findByRole("img", { name: "Oct 2017 bar value 67%" })
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === "figure" &&
        element?.textContent === "58%Total"
    )
  ).toBeInTheDocument();
});

test("demographic filter", async () => {
  renderWithStore(<VizSupervisionSuccessRate metric={metric} />);

  const menuButton = await screen.findByRole("button", {
    name: "View Total",
  });

  (["raceOrEthnicity", "gender", "ageBucket"] as Exclude<
    DemographicView,
    "nofilter"
  >[]).forEach((demographicView) => {
    fireEvent.click(menuButton);
    fireEvent.click(
      screen.getByRole("option", {
        name: getDemographicViewLabel(demographicView),
      })
    );

    metric.getDemographicCategories(demographicView).forEach(({ label }) => {
      const stat = screen.getByRole("figure", { name: label });
      expect(within(stat).getByText(/\d+%/)).toBeInTheDocument();
    });
  });
});
