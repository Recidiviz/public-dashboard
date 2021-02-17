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

import { eachMonthOfInterval, format, subMonths } from "date-fns";
import { format as d3Format } from "d3-format";

const monthFromDate = (date: Date) => format(date, "yyyy-MM");

type MonthRecord = { year: number; monthIndex: number };

const monthFromRecord = (record: MonthRecord) =>
  `${record.year}-${d3Format("02")(record.monthIndex + 1)}`;

/**
 * Returns records for any months that are expected but missing from the input data.
 * Any missing records are assumed to have a value of zero.
 * Operates on a single series only - meaning input data must be filtered to a single
 * demographic category for it to work as expected. The demographicFields prop
 * should reflect that category to ensure generated records have the correct shape.
 */
export default function getMissingMonths({
  expectedMonths,
  includeCurrentMonth,
  records,
}: {
  expectedMonths: number;
  includeCurrentMonth: boolean;
  records: MonthRecord[];
}): MonthRecord[] {
  // scan the data to see what months we have
  const representedMonths: { [key: string]: boolean } = {};
  records.forEach((record) => {
    representedMonths[monthFromRecord(record)] = true;
  });

  const isMonthMissing = (date: Date) => {
    return !representedMonths[monthFromDate(date)];
  };

  const missingMonths: MonthRecord[] = [];

  let end = new Date();
  if (!includeCurrentMonth) {
    // there may be a reporting lag for the current month; if it's missing,
    // instead of patching it we should just shift the entire window back one month
    if (isMonthMissing(end)) {
      end = subMonths(end, 1);
    }
  }
  const start = subMonths(end, expectedMonths - 1);
  eachMonthOfInterval({ start, end }).forEach((monthStart) => {
    if (isMonthMissing(monthStart)) {
      missingMonths.push({
        year: monthStart.getFullYear(),
        monthIndex: monthStart.getMonth(),
      });
    }
  });

  return missingMonths;
}
