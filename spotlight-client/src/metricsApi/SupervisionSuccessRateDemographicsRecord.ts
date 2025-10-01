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
import { DemographicFields, LocalityFields, RateFields } from "./types";
import {
  extractDemographicFields,
  recordIsParole,
  recordIsProbation,
} from "./utils";

export type SupervisionSuccessRateDemographicsRecord = DemographicFields &
  LocalityFields &
  RateFields;

function createSupervisionSuccessRateDemographicRecord(
  record: ValuesType<RawMetricData>
) {
  return {
    rate: Number(record.success_rate),
    rateDenominator: Number(record.projected_completion_count),
    rateNumerator: Number(record.successful_termination_count),
    locality: record.district,
    ...extractDemographicFields(record),
  };
}

function createSupervisionTerminationRateDemographicRecord(
  record: ValuesType<RawMetricData>
) {
  return {
    rate: Number(record.success_rate),
    rateDenominator: Number(record.termination_count),
    rateNumerator: Number(record.successful_termination_count),
    locality: record.district,
    ...extractDemographicFields(record),
  };
}

export function probationSuccessRateDemographics(
  rawRecords: RawMetricData
): SupervisionSuccessRateDemographicsRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionSuccessRateDemographicRecord);
}

export function paroleSuccessRateDemographics(
  rawRecords: RawMetricData
): SupervisionSuccessRateDemographicsRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionSuccessRateDemographicRecord);
}

export function probationTerminationRateDemographics(
  rawRecords: RawMetricData
): SupervisionSuccessRateDemographicsRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionTerminationRateDemographicRecord);
}

export function paroleTerminationRateDemographics(
  rawRecords: RawMetricData
): SupervisionSuccessRateDemographicsRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionTerminationRateDemographicRecord);
}
