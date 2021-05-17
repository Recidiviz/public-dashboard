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
import { DemographicCategoryFilter } from "../contentApi/types";
import { DemographicFields, isDemographicFieldKey } from "../metricsApi";
import {
  AgeValue,
  DemographicView,
  DemographicViewList,
  GenderValue,
  NOFILTER_KEY,
  RaceOrEthnicityValue,
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

export type RaceOrEthnicityCategory = {
  label: string;
  identifier: RaceOrEthnicityValue;
};
const raceOrEthnicityCategories: RaceOrEthnicityCategory[] = [
  { identifier: "AMERICAN_INDIAN_ALASKAN_NATIVE", label: "Native American" },
  { identifier: "BLACK", label: "Black" },
  { identifier: "HISPANIC", label: "Hispanic" },
  { identifier: "WHITE", label: "White" },
  { identifier: "ASIAN", label: "Asian" },
  { identifier: "NATIVE_HAWAIIAN_PACIFIC_ISLANDER", label: "Pacific Islander" },
  { identifier: "OTHER", label: "Other" },
];

type GenderCategory = { label: string; identifier: GenderValue };
const genderCategories: GenderCategory[] = [
  { identifier: "MALE", label: "Male" },
  { identifier: "FEMALE", label: "Female" },
];

type AgeCategory = { label: string; identifier: AgeValue };
const ageBucketCategories: AgeCategory[] = [
  { identifier: "<25", label: "<25" },
  { identifier: "25-29", label: "25-29" },
  { identifier: "30-34", label: "30-34" },
  { identifier: "35-39", label: "35-39" },
  { identifier: "40<", label: "40+" },
];

export type DemographicCategories = {
  total: TotalCategory[];
  raceOrEthnicity: RaceOrEthnicityCategory[];
  gender: GenderCategory[];
  ageBucket: AgeCategory[];
};
export function createDemographicCategories(
  demographicFilter?: DemographicCategoryFilter
): DemographicCategories {
  return {
    total: totalCategories,
    // only applying filters if the keys are actually present
    raceOrEthnicity: raceOrEthnicityCategories.filter(
      ({ identifier }) =>
        demographicFilter?.raceOrEthnicity?.includes(identifier) ?? true
    ),
    gender: genderCategories.filter(
      ({ identifier }) =>
        demographicFilter?.gender?.includes(identifier) ?? true
    ),
    ageBucket: ageBucketCategories.filter(
      ({ identifier }) =>
        demographicFilter?.ageBucket?.includes(identifier) ?? true
    ),
  };
}

export function getDemographicCategoriesForView(
  view: Exclude<DemographicView, "nofilter">,
  categories: DemographicCategories
): (TotalCategory | RaceOrEthnicityCategory | GenderCategory | AgeCategory)[] {
  switch (view) {
    case "total":
      return categories.total;
    case "raceOrEthnicity":
      return categories.raceOrEthnicity;
    case "gender":
      return categories.gender;
    case "ageBucket":
      return categories.ageBucket;
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

/**
 * Inspects an array of records to report whether it contains breakdown records
 * or is made exclusively of total records.
 */
export function dataIncludesBreakdowns<RecordFormat extends DemographicFields>(
  data: RecordFormat[]
): boolean {
  return data.some(
    (record) =>
      record.ageBucket !== TOTAL_KEY ||
      record.gender !== TOTAL_KEY ||
      record.raceOrEthnicity !== TOTAL_KEY
  );
}
