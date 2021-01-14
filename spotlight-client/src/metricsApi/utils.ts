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

import { ValuesType } from "utility-types";
import { RawMetricData } from "./fetchMetrics";

type TotalIdentifier = "ALL";

type NoFilterIdentifier = "nofilter";

type RaceIdentifier =
  | TotalIdentifier
  | "AMERICAN_INDIAN_ALASKAN_NATIVE"
  | "ASIAN"
  | "BLACK"
  | "HISPANIC"
  | "NATIVE_HAWAIIAN_PACIFIC_ISLANDER"
  | "WHITE"
  | "OTHER";
type GenderIdentifier = TotalIdentifier | "FEMALE" | "MALE";
type AgeIdentifier =
  | TotalIdentifier
  | "<25"
  | "25-29"
  | "30-34"
  | "35-39"
  | "40<";

export type DemographicFields = {
  raceOrEthnicity: RaceIdentifier;
  gender: GenderIdentifier;
  ageBucket: AgeIdentifier;
};

export type LocalityFields = {
  locality: string;
};

export type RateFields = {
  rateDenominator: number;
  rateNumerator: number;
  rate: number;
};

export function extractDemographicFields(
  record: ValuesType<RawMetricData>
): DemographicFields {
  return {
    // we are trusting the API to return valid strings here, not validating them
    raceOrEthnicity: record.race_or_ethnicity as RaceIdentifier,
    gender: record.gender as GenderIdentifier,
    ageBucket: record.age_bucket as AgeIdentifier,
  };
}

export function recordIsParole(record: ValuesType<RawMetricData>): boolean {
  return record.supervision_type === "PAROLE";
}

export function recordIsProbation(record: ValuesType<RawMetricData>): boolean {
  return record.supervision_type === "PROBATION";
}

export type DemographicView =
  | "total"
  | "race"
  | "gender"
  | "age"
  | NoFilterIdentifier;

const DIMENSION_DATA_KEYS: Record<
  Exclude<DemographicView, "total" | NoFilterIdentifier>,
  keyof DemographicFields
> = {
  age: "ageBucket",
  gender: "gender",
  race: "raceOrEthnicity",
};

export const TOTAL_KEY: TotalIdentifier = "ALL";

export const NOFILTER_KEY: NoFilterIdentifier = "nofilter";

/**
 * Returns a filter predicate for the specified demographic view
 * that will exclude totals and breakdowns for all other views
 */
export function recordIsTotalByDimension(
  demographicView: Exclude<DemographicView, NoFilterIdentifier>
): (record: DemographicFields) => boolean {
  const keysEnum = { ...DIMENSION_DATA_KEYS };

  if (demographicView !== "total") {
    delete keysEnum[demographicView];
  }

  const otherDataKeys = Object.values(keysEnum);

  return (record) => {
    let match = true;
    if (demographicView !== "total") {
      // filter out totals
      match =
        match && record[DIMENSION_DATA_KEYS[demographicView]] !== TOTAL_KEY;
    }

    // filter out subset permutations
    match = match && otherDataKeys.every((key) => record[key] === TOTAL_KEY);

    return match;
  };
}
