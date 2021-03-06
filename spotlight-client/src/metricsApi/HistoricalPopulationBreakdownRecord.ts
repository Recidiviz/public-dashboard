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

import { parseISO } from "date-fns";
import { ValuesType } from "utility-types";
import { RawMetricData } from "./fetchMetrics";
import { DemographicFields } from "./types";
import {
  extractDemographicFields,
  recordIsParole,
  recordIsProbation,
} from "./utils";

export type HistoricalPopulationBreakdownRecord = DemographicFields & {
  date: Date;
  count: number;
};

function createHistoricalPopulationRecord(record: ValuesType<RawMetricData>) {
  return {
    date: parseISO(record.population_date),
    count: Number(record.population_count),
    ...extractDemographicFields(record),
  };
}

export function prisonPopulationHistorical(
  rawRecords: RawMetricData
): HistoricalPopulationBreakdownRecord[] {
  return rawRecords.map(createHistoricalPopulationRecord);
}

export function probationPopulationHistorical(
  rawRecords: RawMetricData
): HistoricalPopulationBreakdownRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createHistoricalPopulationRecord);
}

export function parolePopulationHistorical(
  rawRecords: RawMetricData
): HistoricalPopulationBreakdownRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createHistoricalPopulationRecord);
}
