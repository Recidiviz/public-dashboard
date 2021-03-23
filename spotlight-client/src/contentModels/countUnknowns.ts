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

import { rollup } from "d3-array";
import { UNKNOWN_KEY } from "../demographics";
import { DemographicFields } from "../metricsApi";
import { UnknownCounts } from "./types";

export default function countUnknowns<Record extends DemographicFields>(
  allRecords: Record[],
  reducer: (records: Record[]) => number
): UnknownCounts {
  const unknownCounts = {
    raceOrEthnicity:
      rollup(allRecords, reducer, (r) => r.raceOrEthnicity).get(UNKNOWN_KEY) ||
      0,
    gender: rollup(allRecords, reducer, (r) => r.gender).get(UNKNOWN_KEY) || 0,
    ageBucket:
      rollup(allRecords, reducer, (r) => r.ageBucket).get(UNKNOWN_KEY) || 0,
  };

  return unknownCounts;
}
