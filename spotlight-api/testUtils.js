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

const path = require("path");
const ReadLines = require("n-readlines");

/**
 * Parses and returns the first line of the JSONLines fixture,
 * for use as a proxy for correct filesystem data fetching
 */
function getFirstRecordFromFixture(metricName) {
  const lineReader = new ReadLines(
    path.resolve(__dirname, `./core/demo_data/${metricName}`)
  );
  return JSON.parse(lineReader.next().toString());
}

const expectedMetricsByGroup = {
  parole: [
    "active_program_participation_by_region",
    "site_offices",
    "supervision_population_by_district_by_demographics",
    "supervision_revocations_by_period_by_type_by_demographics",
    "supervision_success_by_month",
    "supervision_success_by_period_by_demographics",
    "supervision_population_by_month_by_demographics",
  ],
  prison: [
    "incarceration_facilities",
    "incarceration_population_by_admission_reason",
    "incarceration_population_by_facility_by_demographics",
    "incarceration_releases_by_type_by_period",
    "incarceration_lengths_by_demographics",
    "incarceration_population_by_month_by_demographics",
    "recidivism_rates_by_cohort_by_year",
  ],
  probation: [
    "active_program_participation_by_region",
    "judicial_districts",
    "supervision_population_by_district_by_demographics",
    "supervision_revocations_by_period_by_type_by_demographics",
    "supervision_success_by_month",
    "supervision_success_by_period_by_demographics",
    "supervision_population_by_month_by_demographics",
  ],
  race: ["racial_disparities"],
  sentencing: [
    "judicial_districts",
    "sentence_type_by_district_by_demographics",
  ],
};

module.exports = {
  getFirstRecordFromFixture,
  expectedMetricsByGroup,
};
