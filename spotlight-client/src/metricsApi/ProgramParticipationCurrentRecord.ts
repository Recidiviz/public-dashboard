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
import { LocalityFields, recordIsParole, recordIsProbation } from "./utils";

export type ProgramParticipationCurrentRecord = LocalityFields & {
  count: number;
};

function createProgramParticipationRecord(record: ValuesType<RawMetricData>) {
  return {
    count: Number(record.participation_count),
    locality: record.region_id,
  };
}

export function probationProgramParticipationCurrent(
  rawRecords: RawMetricData
): ProgramParticipationCurrentRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createProgramParticipationRecord);
}

export function paroleProgramParticipationCurrent(
  rawRecords: RawMetricData
): ProgramParticipationCurrentRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createProgramParticipationRecord);
}
