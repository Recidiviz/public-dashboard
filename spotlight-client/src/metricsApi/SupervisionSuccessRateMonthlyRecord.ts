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
import {
  LocalityFields,
  RateFields,
  recordIsProbation,
  recordIsParole,
} from "./utils";

export type SupervisionSuccessRateMonthlyRecord = LocalityFields &
  RateFields & {
    month: number;
    year: number;
  };

function createSupervisionSuccessRateMonthlyRecord(
  record: ValuesType<RawMetricData>
) {
  return {
    locality: record.district,
    year: Number(record.projected_year),
    month: Number(record.projected_month),
    rateNumerator: Number(record.successful_termination_count),
    rateDenominator: Number(record.projected_completion_count),
    rate: Number(record.success_rate),
  };
}

export function probationSuccessRateMonthly(
  rawRecords: RawMetricData
): SupervisionSuccessRateMonthlyRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionSuccessRateMonthlyRecord);
}

export function paroleSuccessRateMonthly(
  rawRecords: RawMetricData
): SupervisionSuccessRateMonthlyRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionSuccessRateMonthlyRecord);
}
