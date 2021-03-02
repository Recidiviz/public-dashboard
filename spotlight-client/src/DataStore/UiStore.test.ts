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

import { runInAction } from "mobx";
import { reactImmediately } from "../testUtils";
import RootStore from "./RootStore";
import type UiStore from "./UiStore";

let rootStore: RootStore;
let store: UiStore;

beforeEach(() => {
  rootStore = new RootStore();
  store = rootStore.uiStore;
});

test("set info panel contents", () => {
  reactImmediately(() => {
    expect(store.tooltipMobileData).toBeUndefined();
    expect(store.renderTooltipMobile).toBeUndefined();
  });

  const testData = { label: "test content", color: "black", value: 99 };
  const testRender = jest.fn();
  runInAction(() => {
    store.tooltipMobileData = testData;
    store.renderTooltipMobile = testRender;
  });

  reactImmediately(() => {
    if (store.renderTooltipMobile && store.tooltipMobileData)
      store.renderTooltipMobile(store.tooltipMobileData);
  });

  expect(testRender).toHaveBeenCalledWith(testData);

  store.clearTooltipMobile();

  reactImmediately(() => {
    expect(store.tooltipMobileData).toBeUndefined();
    expect(store.renderTooltipMobile).toBeUndefined();
  });
});

test("current page ID", () => {
  reactImmediately(() => {
    expect(store.currentPageId).toBe("");
  });

  runInAction(() => {
    rootStore.tenantStore.currentTenantId = "US_ND";
  });

  reactImmediately(() => {
    expect(store.currentPageId).toBe("US_ND");
  });

  runInAction(() => {
    rootStore.tenantStore.currentNarrativeTypeId = "Parole";
  });

  reactImmediately(() => {
    expect(store.currentPageId).toBe("US_ND::Parole");
  });

  runInAction(() => {
    rootStore.tenantStore.currentTenantId = undefined;
  });

  reactImmediately(() => {
    expect(store.currentPageId).toBe("");
  });

  expect.hasAssertions();
});
