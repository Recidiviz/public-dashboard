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

import React from "react";
import { DIMENSION_KEYS } from "../constants";
import { render, screen, getDataFixture } from "../testUtils";
import { typecastRecidivismData } from "../utils";
import VizRecidivismRates from ".";

const recidivismRatesFixture = getDataFixture(
  "recidivism_rates_by_cohort_by_year.json"
).map(typecastRecidivismData);

const allCohorts = new Set(
  recidivismRatesFixture.map((record) => record.releaseCohort)
);
const allSelectedCohorts = [...allCohorts].map((year) => ({
  id: year,
  label: year,
}));

test("does not explode", () => {
  const dimension = DIMENSION_KEYS.total;

  render(
    <VizRecidivismRates
      data={{
        dimension,
        selectedCohorts: allSelectedCohorts,
        recidivismRates: recidivismRatesFixture,
      }}
    />
  );
  expect(screen.getByText("Cumulative Recidivism Rate")).toBeVisible();
});

/**
 * There are two Semiotic charts rendered due to our hover overlay workaround;
 * this convenience method applies the provided TextMatch to the main one, not the overlay
 */
function getMainByLabelText(TextMatch) {
  return screen.getAllByLabelText(TextMatch)[0];
}

test("renders one line per cohort", () => {
  const dimension = DIMENSION_KEYS.total;

  const { rerender } = render(
    <VizRecidivismRates
      data={{
        dimension,
        selectedCohorts: allSelectedCohorts,
        recidivismRates: recidivismRatesFixture,
      }}
    />
  );
  expect(getMainByLabelText("10 lines in a line chart")).toBeVisible();

  rerender(
    <VizRecidivismRates
      data={{
        dimension,
        selectedCohorts: allSelectedCohorts.slice(0, 7),
        recidivismRates: recidivismRatesFixture,
      }}
    />
  );

  expect(getMainByLabelText("7 lines in a line chart")).toBeVisible();
});

test("renders one line per demographic subgroup", () => {
  const dimension = DIMENSION_KEYS.race;
  render(
    <VizRecidivismRates
      data={{
        dimension,
        selectedCohorts: allSelectedCohorts.slice(0, 1),
        recidivismRates: recidivismRatesFixture,
      }}
    />
  );

  expect(getMainByLabelText("5 lines in a line chart")).toBeVisible();
});
