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

import { DemographicFieldKey, DemographicView, TOTAL_KEY } from "./metricsApi";

export const DEMOGRAPHIC_UNKNOWN = "EXTERNAL_UNKNOWN";

const AGE_KEYS = {
  under25: "<25",
  "25_29": "25-29",
  "30_34": "30-34",
  "35_39": "35-39",
  over40: "40<",
};

const AGES = new Map([
  [AGE_KEYS.under25, "<25"],
  [AGE_KEYS["25_29"], "25-29"],
  [AGE_KEYS["30_34"], "30-34"],
  [AGE_KEYS["35_39"], "35-39"],
  [AGE_KEYS.over40, "40<"],
  [DEMOGRAPHIC_UNKNOWN, "Unknown"],
]);

const GENDERS = new Map([
  ["FEMALE", "Female"],
  ["MALE", "Male"],
  [DEMOGRAPHIC_UNKNOWN, "Unknown"],
]);

const RACES = {
  nativeAmerican: "AMERICAN_INDIAN_ALASKAN_NATIVE",
  black: "BLACK",
  hispanic: "HISPANIC",
  white: "WHITE",
  other: "OTHER",
};

// TODO: additional categories that weren't in ND?
const RACE_LABELS = new Map([
  [RACES.nativeAmerican, "Native American"],
  [RACES.black, "Black"],
  [RACES.hispanic, "Hispanic"],
  [RACES.white, "White"],
  [RACES.other, "Other"],
]);

export const DIMENSION_MAPPINGS = new Map<
  Exclude<DemographicView, "nofilter">,
  Map<string, string>
>([
  ["gender", GENDERS],
  ["age", AGES],
  ["race", RACE_LABELS],
  ["total", new Map([[TOTAL_KEY, "Total"]])],
]);

export const DIMENSION_DATA_KEYS: {
  [key in Extract<
    DemographicView,
    "race" | "gender" | "age" | "total"
  >]: DemographicFieldKey;
} = {
  race: "raceOrEthnicity",
  gender: "gender",
  age: "ageBucket",
  // TODO: this shouldn't ever happen but there is type weirdness
  total: "gender",
};
