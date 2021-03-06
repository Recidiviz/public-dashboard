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

import { sum } from "d3-array";

/**
 * Given a series of records, sums up their values and computes the value of each
 * as a percentage of that total. Returns a copy of the records with `pct` field
 * included as a number between 0 and 1.
 */
export default function calculatePct<RecordFormat extends { value: number }>(
  data: RecordFormat[]
): (RecordFormat & { pct: number })[] {
  // calculate percentages for display
  const totalValue = sum(data.map(({ value }) => value));
  return data.map((record) => ({
    ...record,
    // check denominator to avoid dividing by zero
    pct: totalValue ? record.value / totalValue : 0,
  }));
}
