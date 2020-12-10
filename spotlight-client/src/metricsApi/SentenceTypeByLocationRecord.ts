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

import { RawMetricData } from "./fetchMetrics";
import {
  DemographicFields,
  extractDemographicFields,
  LocalityFields,
} from "./utils";

export type SentenceTypeByLocationRecord = DemographicFields &
  LocalityFields & {
    dualSentenceCount: number;
    incarcerationCount: number;
    probationCount: number;
  };

export function sentenceTypesCurrent(
  rawRecords: RawMetricData
): SentenceTypeByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      dualSentenceCount: Number(record.dual_sentence_count),
      incarcerationCount: Number(record.incarceration_count),
      locality: record.district,
      probationCount: Number(record.probation_count),
      ...extractDemographicFields(record),
    };
  });
}
