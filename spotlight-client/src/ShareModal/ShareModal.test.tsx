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

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { runInAction } from "mobx";
import React from "react";
import DataStore from "../DataStore";
import { NarrativesSlug } from "../routerUtils/types";
import { renderWithStore } from "../testUtils";
import ShareModal from "./ShareModal";

const renderModal = () => {
  renderWithStore(<ShareModal isOpen onRequestClose={() => undefined} />);
};

afterEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
    DataStore.tenantStore.currentNarrativeTypeId = undefined;
    DataStore.tenantStore.currentSectionNumber = undefined;
  });
});

test("display url", () => {
  renderModal();
  expect(screen.getByText("localhost")).toBeVisible();

  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });

  expect(screen.getByText("localhost/us-nd")).toBeVisible();

  runInAction(() => {
    DataStore.tenantStore.currentNarrativeTypeId = "RacialDisparities";
  });

  expect(
    screen.getByText(`localhost/us-nd/${NarrativesSlug}/racial-disparities`)
  ).toBeVisible();
});

test("include narrative section in url", () => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
    DataStore.tenantStore.currentNarrativeTypeId = "RacialDisparities";
    DataStore.tenantStore.currentSectionNumber = 2;
  });

  renderModal();

  expect(
    screen.getByText(`localhost/us-nd/${NarrativesSlug}/racial-disparities`)
  ).toBeVisible();

  userEvent.click(screen.getByRole("checkbox"));

  expect(
    screen.getByText(`localhost/us-nd/${NarrativesSlug}/racial-disparities/2`)
  ).toBeVisible();

  userEvent.click(screen.getByRole("checkbox"));

  expect(
    screen.getByText(`localhost/us-nd/${NarrativesSlug}/racial-disparities`)
  ).toBeVisible();
});
