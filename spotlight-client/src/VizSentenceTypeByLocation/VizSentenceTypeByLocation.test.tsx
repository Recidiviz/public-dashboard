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
import { runInAction, when } from "mobx";
import React from "react";
import SentenceTypeByLocationMetric from "../contentModels/SentenceTypeByLocationMetric";
import DataStore from "../DataStore";
import { getDemographicCategories } from "../demographics";
import { reactImmediately, renderWithStore } from "../testUtils";
import VizSentenceTypeByLocation from "./VizSentenceTypeByLocation";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: SentenceTypeByLocationMetric;

let originalFilters: {
  demographicView: SentenceTypeByLocationMetric["demographicView"];
};

const sentenceTypes = ["Incarceration", "Probation", "Both"];

async function verifySankey(categories: string[], labels: string[]) {
  const chart = screen.getByRole("figure");

  labels.forEach((label) => {
    expect(within(chart).getByText(label)).toBeVisible();
  });

  const nodes = within(chart).getByRole("group", { name: "nodes" });
  expect(nodes).toBeVisible();

  const edges = within(chart).getByRole("group", { name: "edges" });
  expect(edges).toBeVisible();

  sentenceTypes.forEach((sentenceType) => {
    expect(
      // these are the only Semiotic labels we have to work with here
      within(nodes).getByRole("img", { name: `Node ${sentenceType}` })
    ).toBeVisible();
    // label
    expect(within(chart).getByText(sentenceType)).toBeVisible();

    categories.forEach((category) => {
      expect(
        within(edges).getByRole("img", {
          name: `connection from ${sentenceType} to ${category}`,
        })
      ).toBeVisible();
      // label
      expect(within(chart).getByText(category)).toBeVisible();
    });
  });
  // unfortunately there isn't really any sensible way to inspect the size of nodes within JSDOM
}

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get("SentenceTypesCurrent");
    // it will be
    if (metricToTest instanceof SentenceTypeByLocationMetric) {
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
  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("total chart", async () => {
  const categories = ["Total"];

  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  await verifySankey(categories, ["6,193", "3,399", "2,056"]);
});

test.each([
  ["Race or Ethnicity", getDemographicCategories("raceOrEthnicity")],
  ["Gender", getDemographicCategories("gender")],
  ["Age Group", getDemographicCategories("ageBucket")],
])("%s charts", async (demographicLabel, categories) => {
  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: demographicLabel }));

  verifySankey(
    categories.map(({ label }) => label),
    ["6,193", "3,399", "2,056"]
  );
});

test("locality filter", async () => {
  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.getByRole("button", {
    name: "Judicial District All Districts",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: "South Central" }));

  verifySankey(["Total"], ["1,340", "735", "445"]);
});
