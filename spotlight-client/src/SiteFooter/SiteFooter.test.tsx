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
import { runInAction } from "mobx";
import React from "react";
import retrieveContent from "../contentApi/retrieveContent";
import exhaustiveFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import DataStore from "../DataStore";
import { renderWithStore } from "../testUtils";
import SiteFooter from "./SiteFooter";

jest.mock("../contentApi/retrieveContent");

const retrieveContentMock = retrieveContent as jest.MockedFunction<
  typeof retrieveContent
>;

retrieveContentMock.mockReturnValue(exhaustiveFixture);

beforeEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = "US_ND";
  });
});

afterEach(() => {
  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
    DataStore.tenantStore.tenants.clear();
  });
});

test("displays DOC linking button", () => {
  renderWithStore(<SiteFooter />);

  expect(screen.getByText(exhaustiveFixture.docName)).toBeInTheDocument();

  runInAction(() => {
    DataStore.tenantStore.currentTenantId = undefined;
  });

  expect(
    screen.queryByText(exhaustiveFixture.coBrandingCopy)
  ).not.toBeInTheDocument();
});
