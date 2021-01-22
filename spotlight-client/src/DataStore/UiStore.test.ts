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

let store: UiStore;

beforeEach(() => {
  store = new RootStore().uiStore;
});

test("set info panel contents", () => {
  reactImmediately(() => {
    expect(store.infoPanelData).toBeUndefined();
    expect(store.renderInfoPanel).toBeUndefined();
  });

  const testData = { label: "test content", color: "black", value: 99 };
  const testRender = jest.fn();
  runInAction(() => {
    store.infoPanelData = testData;
    store.renderInfoPanel = testRender;
  });

  reactImmediately(() => {
    if (store.renderInfoPanel && store.infoPanelData)
      store.renderInfoPanel(store.infoPanelData);
  });

  expect(testRender).toHaveBeenCalledWith(testData);

  store.clearInfoPanel();

  reactImmediately(() => {
    expect(store.infoPanelData).toBeUndefined();
    expect(store.renderInfoPanel).toBeUndefined();
  });
});
