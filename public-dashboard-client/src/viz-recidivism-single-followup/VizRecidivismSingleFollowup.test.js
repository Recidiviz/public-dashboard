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
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  DIMENSION_MAPPINGS,
  TOTAL_KEY,
} from "../constants";
import { getDataFixture, render, screen, within } from "../testUtils";
import { typecastRecidivismData } from "../utils";
import VizRecidivismSingleFollowup from ".";

const recidivismRates = getDataFixture(
  "recidivism_rates_by_cohort_by_year.json"
).map(typecastRecidivismData);

function getBarLabelData(records) {
  return records.map((record) => ({
    label: record.releaseCohort,
    pct: Math.round(record.recidivismRate * 100),
  }));
}
test("does not explode", () => {
  render(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 3, recidivismRates }}
      dimension="total"
    />
  );
  expect(screen.getByText("Total")).toBeVisible();
});

test("renders a single chart for totals", () => {
  render(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 3, recidivismRates }}
      dimension="total"
    />
  );
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizEl = screen.getByLabelText("8 bars in a bar chart");
  expect(vizEl).toBeVisible();
  // inspect the figure to determine what values the chart should reflect
  const totalRecords = recidivismRates
    .filter(
      // eslint-disable-next-line camelcase
      ({ gender, age_bucket, race_or_ethnicity }) =>
        // eslint-disable-next-line camelcase
        gender === "ALL" && age_bucket === "ALL" && race_or_ethnicity === "ALL"
    )
    .filter((record) => record.followupYears === 3);
  getBarLabelData(totalRecords).forEach((expectedValue) => {
    expect(
      within(vizEl).getByRole("img", {
        name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
      })
    );
  });
});

test("displays alternate followup periods of 1 and 5 years", () => {
  const totalRecords = recidivismRates.filter(
    // eslint-disable-next-line camelcase
    ({ gender, age_bucket, race_or_ethnicity }) =>
      // eslint-disable-next-line camelcase
      gender === "ALL" && age_bucket === "ALL" && race_or_ethnicity === "ALL"
  );

  const { rerender } = render(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 5, recidivismRates }}
      dimension="total"
    />
  );

  // inspect the figure to determine what values the chart should reflect
  let vizEl = screen.getByLabelText("6 bars in a bar chart");
  getBarLabelData(
    totalRecords.filter((record) => record.followupYears === 5)
  ).forEach((expectedValue) => {
    expect(
      within(vizEl).getByRole("img", {
        name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
      })
    );
  });

  // repeat for the remaining followup period
  rerender(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 1, recidivismRates }}
      dimension="total"
    />
  );

  vizEl = screen.getByLabelText("10 bars in a bar chart");

  getBarLabelData(
    totalRecords.filter((record) => record.followupYears === 1)
  ).forEach((expectedValue) => {
    expect(
      within(vizEl).getByRole("img", {
        name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
      })
    );
  });
});

test("renders one chart per race subgroup", () => {
  render(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 3, recidivismRates }}
      dimension={DIMENSION_KEYS.race}
    />
  );

  const subgroups = DIMENSION_MAPPINGS.get(DIMENSION_KEYS.race);
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizElList = screen.getAllByLabelText("8 bars in a bar chart");
  expect(vizElList.length).toBe(subgroups.size);

  const raceRecords = recidivismRates
    .filter((record) => record[DIMENSION_DATA_KEYS.race] !== TOTAL_KEY)
    .filter((record) => record.followupYears === 3);

  [...subgroups.keys()].forEach((groupId, index) => {
    getBarLabelData(
      raceRecords.filter(
        (record) => record[DIMENSION_DATA_KEYS.race] === groupId
      )
    ).forEach((expectedValue) => {
      expect(
        within(vizElList[index]).getByRole("img", {
          name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
        })
      );
    });
  });
});

test("renders one chart per gender subgroup", () => {
  render(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 3, recidivismRates }}
      dimension={DIMENSION_KEYS.gender}
    />
  );

  const subgroups = new Map(DIMENSION_MAPPINGS.get(DIMENSION_KEYS.gender));
  // unknowns are rare and usually errors, they don't get their own chart
  subgroups.delete(DEMOGRAPHIC_UNKNOWN);

  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizElList = screen.getAllByLabelText("8 bars in a bar chart");
  expect(vizElList.length).toBe(subgroups.size);

  const genderRecords = recidivismRates
    .filter((record) => record[DIMENSION_DATA_KEYS.race] !== TOTAL_KEY)
    .filter((record) => record.followupYears === 3);

  [...subgroups.keys()].forEach((groupId, index) => {
    getBarLabelData(
      genderRecords.filter(
        (record) => record[DIMENSION_DATA_KEYS.gender] === groupId
      )
    ).forEach((expectedValue) => {
      expect(
        within(vizElList[index]).getByRole("img", {
          name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
        })
      );
    });
  });
});

test("renders one chart per age subgroup", () => {
  render(
    <VizRecidivismSingleFollowup
      data={{ followupYears: 3, recidivismRates }}
      dimension={DIMENSION_KEYS.age}
    />
  );

  const subgroups = new Map(DIMENSION_MAPPINGS.get(DIMENSION_KEYS.age));
  // unknowns are rare and usually errors, they don't get their own chart
  subgroups.delete(DEMOGRAPHIC_UNKNOWN);
  // our chart library generates text labels for all its visual marks;
  // we can use this as a proxy for proper visual rendering
  const vizElList = screen.getAllByLabelText("8 bars in a bar chart");
  expect(vizElList.length).toBe(subgroups.size);

  const ageRecords = recidivismRates
    .filter((record) => record[DIMENSION_DATA_KEYS.age] !== TOTAL_KEY)
    .filter((record) => record.followupYears === 3);

  [...subgroups.keys()].forEach((groupId, index) => {
    getBarLabelData(
      ageRecords.filter((record) => record[DIMENSION_DATA_KEYS.age] === groupId)
    ).forEach((expectedValue) => {
      expect(
        within(vizElList[index]).getByRole("img", {
          name: `${expectedValue.label} bar value ${expectedValue.pct}%`,
        })
      );
    });
  });
});
