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

import {
  AgeIdentifier,
  DemographicView,
  GenderIdentifier,
  RaceIdentifier,
} from "../demographics/types";

export type DemographicFieldKey = Extract<
  DemographicView,
  "raceOrEthnicity" | "gender" | "ageBucket"
>;
export function isDemographicFieldKey(
  x: DemographicView
): x is DemographicFieldKey {
  return ["raceOrEthnicity", "gender", "ageBucket"].includes(x);
}

export type DemographicFields = {
  [key in DemographicFieldKey]: key extends "raceOrEthnicity"
    ? RaceIdentifier
    : key extends "gender"
    ? GenderIdentifier
    : AgeIdentifier;
};

export type LocalityFields = {
  locality: string;
};

export type RateFields = {
  rateDenominator: number;
  rateNumerator: number;
  rate: number;
};
export function isRateFields(
  record: Record<string, unknown>
): record is RateFields {
  return (
    typeof record.rate === "number" &&
    typeof record.rateNumerator === "number" &&
    typeof record.rateDenominator === "number"
  );
}
