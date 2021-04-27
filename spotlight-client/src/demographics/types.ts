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

export type TotalIdentifier = "ALL";
export const TOTAL_KEY: TotalIdentifier = "ALL";

type NoFilterIdentifier = "nofilter";
export const NOFILTER_KEY: NoFilterIdentifier = "nofilter";

export const UNKNOWN_KEY = "EXTERNAL_UNKNOWN";
type UnknownIdentifier = typeof UNKNOWN_KEY;

export const RaceOrEthnicityValueList = [
  "AMERICAN_INDIAN_ALASKAN_NATIVE",
  "BLACK",
  "HISPANIC",
  "WHITE",
  "ASIAN",
  "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
  "OTHER",
] as const;
export type RaceOrEthnicityValue = typeof RaceOrEthnicityValueList[number];
export type RaceIdentifier =
  | TotalIdentifier
  | UnknownIdentifier
  | RaceOrEthnicityValue;

export const GenderValueList = ["MALE", "FEMALE"] as const;
export type GenderValue = typeof GenderValueList[number];
export type GenderIdentifier =
  | TotalIdentifier
  | UnknownIdentifier
  | GenderValue;

export const AgeValueList = ["<25", "25-29", "30-34", "35-39", "40<"] as const;
export type AgeValue = typeof AgeValueList[number];
export type AgeIdentifier = TotalIdentifier | UnknownIdentifier | AgeValue;

export const DemographicViewList = [
  "total",
  "raceOrEthnicity",
  "gender",
  "ageBucket",
  "nofilter",
] as const;
export type DemographicView = typeof DemographicViewList[number];
export function isDemographicView(x: string): x is DemographicView {
  // because of how the array is typed, `includes` only accepts values
  // it already knows are in the array, which ... kind of defeats the purpose
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return DemographicViewList.includes(x as any);
}
