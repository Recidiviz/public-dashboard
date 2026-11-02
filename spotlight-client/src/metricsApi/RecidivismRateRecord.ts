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
import { DemographicFields, RateFields } from "./types";
import {
  extractDemographicFields,
  recordIsParole,
  recordIsProbation,
} from "./utils";

export const ReturnTypeList = ["ALL", "INCARCERATION", "SUPERVISION"] as const;
export type ReturnType = typeof ReturnTypeList[number];
export function isReturnType(x: string): x is ReturnType {
  return ReturnTypeList.includes(x as ReturnType);
}

export type RecidivismRateRecord = DemographicFields &
  RateFields & {
    releaseCohort: number;
    followupYears: number;
    // only present for supervision recidivism, where a return can be to
    // incarceration or to supervision
    returnType?: ReturnType;
  };

const CONVENTIONAL_FOLLOWUP_YEARS = [1, 3, 5];

function isConventionalFollowup({ followupYears }: RecidivismRateRecord) {
  return CONVENTIONAL_FOLLOWUP_YEARS.includes(followupYears);
}

function createRecidivismRateRecord(
  record: ValuesType<RawMetricData>
): RecidivismRateRecord {
  return {
    followupYears: Number(record.followup_years),
    rateNumerator: Number(record.recidivated_releases),
    rate: Number(record.recidivism_rate),
    rateDenominator: Number(record.releases),
    releaseCohort: Number(record.release_cohort),
    ...extractDemographicFields(record),
  };
}

function createSupervisionRecidivismRateRecord(
  record: ValuesType<RawMetricData>
): RecidivismRateRecord {
  return {
    ...createRecidivismRateRecord(record),
    // we are trusting the API to return valid strings here, not validating them
    returnType: record.return_type as ReturnType,
  };
}

export function recidivismRateAllFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return rawRecords.map(createRecidivismRateRecord);
}

export function recidivismRateConventionalFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return recidivismRateAllFollowup(rawRecords).filter(isConventionalFollowup);
}

export function paroleRecidivismRateAllFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionRecidivismRateRecord);
}

export function paroleRecidivismRateConventionalFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return paroleRecidivismRateAllFollowup(rawRecords).filter(
    isConventionalFollowup
  );
}

export function probationRecidivismRateAllFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionRecidivismRateRecord);
}

export function probationRecidivismRateConventionalFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return probationRecidivismRateAllFollowup(rawRecords).filter(
    isConventionalFollowup
  );
}
