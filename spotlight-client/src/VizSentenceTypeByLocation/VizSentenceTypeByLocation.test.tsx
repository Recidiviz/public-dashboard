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
    expect(within(chart).getByText(label)).toBeInTheDocument();
  });

  const nodes = within(chart).getByRole("group", { name: "nodes" });
  expect(nodes).toBeInTheDocument();

  const edges = within(chart).getByRole("group", { name: "edges" });
  expect(edges).toBeInTheDocument();

  sentenceTypes.forEach((sentenceType) => {
    expect(
      // these are the only Semiotic labels we have to work with here
      within(nodes).getByRole("img", { name: `Node ${sentenceType}` })
    ).toBeInTheDocument();
    // label
    expect(within(chart).getByText(sentenceType)).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        within(edges).getByRole("img", {
          name: `connection from ${sentenceType} to ${category}`,
        })
      ).toBeInTheDocument();
      // label
      expect(within(chart).getByText(category)).toBeInTheDocument();
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
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("total chart", async () => {
  const categories = ["Total"];

  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  await verifySankey(categories, ["6,193", "3,399", "2,056"]);
});

test.each([
  ["Race or Ethnicity", "raceOrEthnicity"],
  ["Gender", "gender"],
  ["Age Group", "ageBucket"],
])("%s charts", async (demographicLabel, demographicView) => {
  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole("option", { name: demographicLabel }));

  verifySankey(
    metric
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .getDemographicCategories(demographicView as any)
      .map(({ label }) => label),
    ["6,193", "3,399", "2,056"]
  );
});

test("locality filter", async () => {
  renderWithStore(<VizSentenceTypeByLocation metric={metric} />);

  await when(() => !metric.isLoading);

  const menuButton = screen.queryByRole("button", {
    name: "Judicial District All Districts",
  });

  expect(menuButton).toBeNull(); // Jurisdiction Dropdowns should no longer exist as of February 2025
});
