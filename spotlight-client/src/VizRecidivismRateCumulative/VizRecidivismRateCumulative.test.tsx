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
import VizRecidivismRateCumulative from "./VizRecidivismRateCumulative";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: RecidivismRateMetric;

let originalFilters: {
  demographicView: RecidivismRateMetric["demographicView"];
};

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "PrisonRecidivismRateHistorical"
    );
    // it will be
    if (metricToTest instanceof RecidivismRateMetric) {
      metric = metricToTest;
      originalFilters = {
        demographicView: metric.demographicView,
      };
    }
  });
});

afterEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
    metric.demographicView = originalFilters.demographicView;
  });
});

test("loading", () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("total chart", async () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);

  await when(() => !metric.isLoading);

  // there are multiple charts due to how interactions are implemented;
  // the first one should be the one we care about
  const chart = screen.getAllByRole("group", {
    name: "10 lines in a line chart",
  })[0];
  expect(chart).toBeVisible();
  // don't have to deeply inspect the values but let's make sure the lines have the proper shape
  for (let numPoints = 2; numPoints <= 11; numPoints += 1) {
    expect(
      within(chart).getByRole("img", {
        name: new RegExp(
          `^${numPoints} point line starting value 0% at 0 ending value \\d+% at ${
            numPoints - 1
          }`
        ),
      })
    ).toBeVisible();
  }
});
