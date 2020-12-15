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
