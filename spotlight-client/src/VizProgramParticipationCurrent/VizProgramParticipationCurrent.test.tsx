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

import { screen, within } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import ProgramParticipationCurrentMetric from "../contentModels/ProgramParticipationCurrentMetric";
import DataStore from "../DataStore";
import { reactImmediately, renderWithStore } from "../testUtils";
import VizProgramParticipationCurrent from "./VizProgramParticipationCurrent";

jest.mock("../MeasureWidth/MeasureWidth");

let metric: ProgramParticipationCurrentMetric;

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
  reactImmediately(() => {
    const metricToTest = DataStore.tenant?.metrics.get(
      "ParoleProgrammingCurrent"
    );
    // it will be
    if (metricToTest instanceof ProgramParticipationCurrentMetric) {
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
  renderWithStore(<VizProgramParticipationCurrent metric={metric} />);
  expect(screen.getByText(/loading/i)).toBeVisible();
});

test("renders a map", async () => {
  renderWithStore(<VizProgramParticipationCurrent metric={metric} />);

  const map = await screen.findByRole("figure", { name: "Region map chart" });
  expect(map).toBeVisible();

  expect(
    within(map).getByRole("img", { name: "Region 1 value 7" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 2 value 47" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 3 value 50" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 4 value 25" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 5 value 51" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 6 value 21" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 7 value 106" })
  ).toBeVisible();
  expect(
    within(map).getByRole("img", { name: "Region 8 value 17" })
  ).toBeVisible();
});
