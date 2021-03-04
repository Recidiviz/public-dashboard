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

import { camelCase, camelCaseTransformMerge } from "change-case";
import { upperCaseFirst } from "upper-case-first";
import { RaceIdentifier } from "../demographics";
import { RawMetricData } from "./fetchMetrics";
import { extractDemographicFields } from "./utils";

export const RevocationCountKeyList = [
  "absconsionCount36Mo",
  "newCrimeCount36Mo",
  "technicalCount36Mo",
  "unknownCount36Mo",
] as const;
const SupervisionTypeCountKeyList = [
  ...RevocationCountKeyList,
  "totalPopulation36Mo",
] as const;
type SupervisionTypeCountKey = typeof SupervisionTypeCountKeyList[number];

export type CountsForSupervisionType = {
  [key in SupervisionTypeCountKey]: number;
};

export type RacialDisparitiesRecord = {
  raceOrEthnicity: RaceIdentifier;
  currentDualSentenceCount: number;
  currentFtrParticipationCount: number;
  currentIncarcerationSentenceCount: number;
  currentProbationSentenceCount: number;
  currentSupervisionPopulation: number;
  currentTotalSentencedCount: number;
  supervision: CountsForSupervisionType;
  parole: CountsForSupervisionType & { releaseCount36Mo: number };
  probation: CountsForSupervisionType;
  totalIncarceratedPopulation36Mo: number;
  totalStatePopulation: number;
};

/**
 * Casts raw API data to typed records. Does NOT validate the raw data contents!
 * It assumes the input record has the expected keys (snake_case variations
 * of what the returned objects will look like)
 */
export function createRacialDisparitiesRecords(
  rawRecords: RawMetricData
): RacialDisparitiesRecord[] {
  return rawRecords.map((record) => {
    const { raceOrEthnicity } = extractDemographicFields(record);
    const transformed: Record<string, unknown> = { raceOrEthnicity };
    // we are trusting the API contract here; entries will be passed through blindly
    Object.entries(record).forEach(([key, value]) => {
      if (key === "race_or_ethnicity") return;
      const transformedKey = camelCase(key, {
        // this cryptic helper function removes underscore prefix from numbers
        transform: camelCaseTransformMerge,
      }) as keyof RacialDisparitiesRecord;
      transformed[transformedKey] = Number(value);
    });

    // nest the repeated supervision keys for easier programmatic access
    ["supervision", "parole", "probation"].forEach((supervisionType) => {
      const supervisionTypeCounts = {} as CountsForSupervisionType;

      SupervisionTypeCountKeyList.forEach((key) => {
        const transformedKey = `${supervisionType}${upperCaseFirst(key)}`;
        supervisionTypeCounts[key] = transformed[transformedKey] as number;
        delete transformed[transformedKey];
      });

      const populationKey = `total${upperCaseFirst(
        supervisionType
      )}Population36Mo`;
      supervisionTypeCounts.totalPopulation36Mo = transformed[
        populationKey
      ] as number;
      delete transformed[populationKey];

      transformed[supervisionType] = supervisionTypeCounts;
    });

    // the parole sub-object has an extra key
    (transformed.parole as RacialDisparitiesRecord["parole"]).releaseCount36Mo = transformed.paroleReleaseCount36Mo as number;
    delete transformed.paroleReleaseCount36Mo;

    return transformed as RacialDisparitiesRecord;
  });
}
