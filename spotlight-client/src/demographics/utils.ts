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

import assertNever from "assert-never";
import { DemographicFields, isDemographicFieldKey } from "../metricsApi";
import {
  AgeIdentifier,
  DemographicView,
  DemographicViewList,
  GenderIdentifier,
  NOFILTER_KEY,
  RaceIdentifier,
  TOTAL_KEY,
} from "./types";

/**
 * Returns a filter predicate for the specified demographic view
 * that will exclude totals and breakdowns for all other views.
 * Respects a special bypass value (see `NOFILTER_KEY`)
 */
export function recordIsTotalByDimension(
  demographicView: DemographicView
): (record: DemographicFields) => boolean {
  if (demographicView === NOFILTER_KEY) return () => true;

  const keysToCheck = [...DemographicViewList].filter(isDemographicFieldKey);

  if (demographicView !== "total") {
    // exclude the view so we wind up with all categories in that view
    keysToCheck.splice(keysToCheck.indexOf(demographicView), 1);
  }

  return (record) => {
    let match = true;
    if (demographicView !== "total") {
      // filter out totals
      match = match && record[demographicView] !== TOTAL_KEY;
    }

    // filter out subset permutations
    match = match && keysToCheck.every((key) => record[key] === TOTAL_KEY);

    return match;
  };
}

type TotalCategory = { identifier: "ALL"; label: string };
const totalCategories: TotalCategory[] = [
  { identifier: TOTAL_KEY, label: "Total" },
];

type RaceOrEthnicityCategory = {
  label: string;
  identifier: RaceIdentifier;
};
const raceOrEthnicityCategories: RaceOrEthnicityCategory[] = [
  { identifier: "AMERICAN_INDIAN_ALASKAN_NATIVE", label: "Native American" },
  { identifier: "BLACK", label: "Black" },
  { identifier: "HISPANIC", label: "Hispanic" },
  { identifier: "WHITE", label: "White" },
  { identifier: "OTHER", label: "Other" },
  // TODO(#314): additional categories in RaceIdentifier that weren't in ND?
];

type GenderCategory = { label: string; identifier: GenderIdentifier };
const genderCategories: GenderCategory[] = [
  { identifier: "MALE", label: "Male" },
  { identifier: "FEMALE", label: "Female" },
];

type AgeCategory = { label: string; identifier: AgeIdentifier };
const ageBucketCategories: AgeCategory[] = [
  { identifier: "<25", label: "<25" },
  { identifier: "25-29", label: "25-29" },
  { identifier: "30-34", label: "30-34" },
  { identifier: "35-39", label: "35-39" },
  { identifier: "40<", label: "40+" },
];

export function getDemographicCategories(
  view: Exclude<DemographicView, "nofilter">
): (TotalCategory | RaceOrEthnicityCategory | GenderCategory | AgeCategory)[] {
  switch (view) {
    case "total":
      return totalCategories;
    case "raceOrEthnicity":
      return raceOrEthnicityCategories;
    case "gender":
      return genderCategories;
    case "ageBucket":
      return ageBucketCategories;
    default:
      assertNever(view);
  }
}

const demographicViewLabels: {
  [key in Exclude<DemographicView, "nofilter">]: string;
} = {
  gender: "Gender",
  ageBucket: "Age Group",
  raceOrEthnicity: "Race or Ethnicity",
  total: "Total",
};

export function getDemographicViewLabel(
  view: Exclude<DemographicView, "nofilter">
): string {
  return demographicViewLabels[view];
}
