// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import { render } from "@testing-library/react";
import React from "react";
import { autorun } from "mobx";
import waitForLocalhost from "wait-for-localhost";
import App from "./App";

export function waitForTestServer(): Promise<void> {
  return waitForLocalhost({ path: "/health", port: 3002 });
}

/**
 * Convenience method to run an immediate, one-time reactive effect
 */
export function reactImmediately(effect: () => void): void {
  // this will call the effect function immediately,
  // and then immediately call the disposer to tear down the reaction
  autorun(effect)();
}

/**
 * Renders the application in a URL history context
 * that can be manipulated and inspected for testing
 */
export function renderNavigableApp({ route = "/" } = {}): {
  history: ReturnType<typeof createHistory>;
  rendered: ReturnType<typeof render>;
} {
  const history = createHistory(createMemorySource(route));

  return {
    rendered: render(
      <LocationProvider history={history}>
        <App />
      </LocationProvider>
    ),
    // tests can use history object to simulate navigation in a browser
    history,
  };
}
