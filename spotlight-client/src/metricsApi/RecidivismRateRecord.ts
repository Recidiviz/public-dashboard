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
  RateFields,
} from "./utils";

export type RecidivismRateRecord = DemographicFields &
  RateFields & {
    releaseCohort: number;
    followupYears: number;
  };

export function recidivismRateAllFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return rawRecords.map((record) => {
    return {
      followupYears: Number(record.followup_years),
      rateNumerator: Number(record.recidivated_releases),
      rate: Number(record.recidivism_rate),
      rateDenominator: Number(record.releases),
      releaseCohort: Number(record.release_cohort),
      ...extractDemographicFields(record),
    };
  });
}

export function recidivismRateConventionalFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return recidivismRateAllFollowup(rawRecords).filter(({ followupYears }) =>
    [1, 3, 5].includes(followupYears)
  );
}
