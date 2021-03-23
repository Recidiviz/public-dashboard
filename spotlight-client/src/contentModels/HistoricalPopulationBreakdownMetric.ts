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

import { ascending, groups, sum } from "d3-array";
import { isSameDay, startOfMonth } from "date-fns";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { DataSeries } from "../charts";
import {
  DemographicViewList,
  recordIsTotalByDimension,
  getDemographicCategories,
  RaceIdentifier,
  GenderIdentifier,
  AgeIdentifier,
} from "../demographics";
import {
  DemographicFields,
  HistoricalPopulationBreakdownRecord,
} from "../metricsApi";
import { colors } from "../UiLibrary";
import { countUnknowns, hasUnknowns } from "./unknowns";
import getMissingMonths from "./getMissingMonths";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { UnknownsByDate } from "./types";

const EXPECTED_MONTHS = 240; // 20 years

function dataIncludesCurrentMonth(
  records: HistoricalPopulationBreakdownRecord[]
) {
  const thisMonth = startOfMonth(new Date());
  return records.some((record) => isSameDay(record.date, thisMonth));
}

/**
 * Returns records for any months that are expected but missing from the input data.
 * Any missing records are assumed to have a value of zero.
 * Operates on a single series only - meaning input data must be filtered to a single
 * demographic category for it to work as expected. The demographicFields prop
 * should reflect that category to ensure generated records have the correct shape.
 */
function getMissingMonthsForSeries({
  demographicFields,
  includeCurrentMonth,
  records,
}: {
  demographicFields: DemographicFields;
  includeCurrentMonth: boolean;
  records: HistoricalPopulationBreakdownRecord[];
}): HistoricalPopulationBreakdownRecord[] {
  const missingMonths = getMissingMonths({
    expectedMonths: EXPECTED_MONTHS,
    includeCurrentMonth,
    records: records.map(({ date }) => ({
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
    })),
  });

  return missingMonths.map(({ year, monthIndex }) => ({
    date: new Date(year, monthIndex),
    count: 0,
    ...demographicFields,
  }));
}

export default class HistoricalPopulationBreakdownMetric extends Metric<
  HistoricalPopulationBreakdownRecord
> {
  // UI needs to know this in order to configure proper viewing window
  dataIncludesCurrentMonth?: boolean;

  constructor(
    props: BaseMetricConstructorOptions<HistoricalPopulationBreakdownRecord>
  ) {
    super(props);

    makeObservable(this, {
      dataIncludesCurrentMonth: observable,
      dataSeries: computed,
      unknowns: computed,
    });
  }

  async fetchAndTransform(): Promise<HistoricalPopulationBreakdownRecord[]> {
    const transformedData = await super.fetchAndTransform();

    // if the current month is completely missing from data, we will assume it is
    // actually missing due to reporting lag. But if any record contains it, we will
    // assume that it should be replaced with an empty record when it is missing
    const includeCurrentMonth = dataIncludesCurrentMonth(transformedData);
    runInAction(() => {
      this.dataIncludesCurrentMonth = includeCurrentMonth;
    });

    const missingRecords: HistoricalPopulationBreakdownRecord[] = [];

    // isolate each data series and impute any missing records
    DemographicViewList.forEach((demographicView) => {
      if (demographicView === "nofilter") return;

      const recordsForDemographicView = transformedData.filter(
        recordIsTotalByDimension(demographicView)
      );

      const categories = getDemographicCategories(demographicView);
      categories.forEach(({ identifier }) => {
        let recordsForCategory;
        if (demographicView !== "total") {
          recordsForCategory = recordsForDemographicView.filter(
            (record) => record[demographicView] === identifier
          );
        } else {
          recordsForCategory = recordsForDemographicView;
        }
        missingRecords.push(
          ...getMissingMonthsForSeries({
            records: recordsForCategory,
            includeCurrentMonth,
            demographicFields: {
              raceOrEthnicity:
                demographicView === "raceOrEthnicity"
                  ? (identifier as RaceIdentifier)
                  : "ALL",
              gender:
                demographicView === "gender"
                  ? (identifier as GenderIdentifier)
                  : "ALL",
              ageBucket:
                demographicView === "ageBucket"
                  ? (identifier as AgeIdentifier)
                  : "ALL",
            },
          })
        );
      });
    });

    transformedData.push(...missingRecords);

    transformedData.sort((a, b) => ascending(a.date, b.date));

    return transformedData;
  }

  get records(): HistoricalPopulationBreakdownRecord[] | undefined {
    let recordsToReturn = this.allRecords;
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );
    return recordsToReturn;
  }

  get dataSeries(): DataSeries<HistoricalPopulationBreakdownRecord>[] | null {
    const { records, demographicView } = this;
    if (!records || demographicView === "nofilter") return null;

    const categories = getDemographicCategories(demographicView);

    return categories.map(({ identifier, label }, index) => ({
      label,
      color: colors.dataViz[index],
      coordinates:
        demographicView === "total"
          ? records
          : records.filter((record) => record[demographicView] === identifier),
    }));
  }

  get unknowns(): UnknownsByDate | undefined {
    const { allRecords } = this;

    if (!allRecords) return undefined;

    const countsByDate = groups(allRecords, (r) => r.date)
      .map(([date, records]) => ({
        date,
        unknowns: countUnknowns(records, (groupedRecords) =>
          sum(groupedRecords, (r) => r.count)
        ),
      }))
      .filter((item) => hasUnknowns(item.unknowns));

    return countsByDate.length ? countsByDate : undefined;
  }
}
