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
import { DemographicFields, LocalityFields } from ".";
import { RawMetricData } from "./fetchMetrics";
import {
  extractDemographicFields,
  recordIsParole,
  recordIsProbation,
} from "./utils";

export type PopulationBreakdownByLocationRecord = DemographicFields &
  LocalityFields & {
    population: number;
  };

export function sentencePopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      locality: record.district,
      population: Number(record.total_population_count),
      ...extractDemographicFields(record),
    };
  });
}

export function prisonPopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      locality: record.facility,
      population: Number(record.total_population),
      ...extractDemographicFields(record),
    };
  });
}

function createSupervisionPopulationRecord(record: ValuesType<RawMetricData>) {
  return {
    locality: record.district,
    population: Number(record.total_supervision_count),
    ...extractDemographicFields(record),
  };
}

export function probationPopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionPopulationRecord);
}

export function parolePopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionPopulationRecord);
}
