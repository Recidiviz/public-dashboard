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
import userEvent from "@testing-library/user-event";
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
    metric.setSelectedCohorts(undefined);
  });
});

test("loading", () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("total chart", async () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);

  await when(() => !metric.isLoading);

  // there are multiple charts due to how interactions are implemented;
  // the first one should be the one we care about
  const chart = screen.getAllByRole("group", {
    name: "10 lines in a line chart",
  })[0];
  expect(chart).toBeInTheDocument();
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
    ).toBeInTheDocument();
  }
});

test("demographic charts", async () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });

  // must select a single cohort to enable this filter
  expect(menuButton).toBeDisabled();

  metric.setSelectedCohorts([2017]);

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Race or Ethnicity" }));

  let [lineChart] = screen.getAllByRole("group", {
    name: "5 lines in a line chart",
  });

  await waitFor(() => {
    expect(lineChart).toBeVisible();
  });

  expect(
    within(lineChart).getAllByRole("img", {
      name: /^3 point line starting value 0% at 0 ending value \d+% at 2/,
    }).length
  ).toBe(5);

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Gender" }));

  [lineChart] = await screen.findAllByRole("group", {
    name: "2 lines in a line chart",
  });

  await waitFor(() => {
    expect(lineChart).toBeVisible();
  });

  expect(
    within(lineChart).getAllByRole("img", {
      name: /^3 point line starting value 0% at 0 ending value \d+% at 2/,
    }).length
  ).toBe(2);

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "Age Group" }));

  await waitFor(() => {
    [lineChart] = screen.getAllByRole("group", {
      name: "5 lines in a line chart",
    });
  });

  expect(lineChart).toBeVisible();

  expect(
    within(lineChart).getAllByRole("img", {
      name: /^3 point line starting value 0% at 0 ending value \d+% at 2/,
    }).length
  ).toBe(5);
});

test("release cohorts filter", async () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);

  await when(() => !metric.isLoading);

  expect(
    screen.getAllByRole("group", {
      name: "10 lines in a line chart",
    }).length
  ).toBe(2);

  const menuButton = screen.getByRole("button", {
    name: "Cohort 2009 and 9 others",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "2012" }));

  expect(
    screen.getAllByRole("group", {
      name: "9 lines in a line chart",
    }).length
  ).toBe(2);
  expect(
    screen.getByRole("option", { name: "2012", selected: false })
  ).toBeVisible();

  fireEvent.click(screen.getByRole("option", { name: "2014" }));
  fireEvent.click(screen.getByRole("option", { name: "2015" }));

  expect(
    screen.getAllByRole("group", {
      name: "7 lines in a line chart",
    }).length
  ).toBe(2);
  expect(
    screen.getAllByRole("option", { name: /201[45]/, selected: false }).length
  ).toBe(2);

  fireEvent.click(screen.getByRole("option", { name: "2012" }));
  expect(
    screen.getAllByRole("group", {
      name: "8 lines in a line chart",
    }).length
  ).toBe(2);
  expect(
    screen.getByRole("option", { name: "2012", selected: true })
  ).toBeVisible();
});

test("highlight release cohort", async () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);

  await screen.findAllByRole("group", {
    name: "10 lines in a line chart",
  });

  const menuButton = screen.getByRole("button", {
    name: "Cohort 2009 and 9 others",
  });

  userEvent.click(menuButton);

  userEvent.hover(screen.getByRole("option", { name: "2012" }));

  await waitFor(() => {
    expect(screen.getByRole("group", { name: "points" })).toBeVisible();
  });

  expect(
    screen.getAllByRole("img", { name: /^Point at x \d and y 0\.\d+/ }).length
  ).toBe(7);
});

test("highlighted release cohorts are visible even if not selected", async () => {
  renderWithStore(<VizRecidivismRateCumulative metric={metric} />);

  const menuButton = screen.getByRole("button", {
    name: "Cohort 2009 and 9 others",
  });

  userEvent.click(menuButton);
  userEvent.click(screen.getByRole("option", { name: "2012" }));

  // still selected
  await screen.findAllByRole("group", {
    name: "10 lines in a line chart",
  });

  // move the mouse off
  userEvent.hover(screen.getByRole("option", { name: "2013" }));
  expect(
    (await screen.findAllByRole("group", { name: "9 lines in a line chart" }))
      .length
  ).toBe(2);

  // move the mouse back on
  userEvent.hover(screen.getByRole("option", { name: "2012" }));
  expect(
    screen.getAllByRole("group", { name: "10 lines in a line chart" }).length
  ).toBe(2);
});
