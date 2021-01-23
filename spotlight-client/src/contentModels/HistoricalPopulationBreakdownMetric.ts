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

import { ascending } from "d3-array";
import { eachMonthOfInterval, format, startOfMonth, subMonths } from "date-fns";
import { makeObservable, observable, runInAction } from "mobx";
import { DataSeries } from "../charts/types";
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_DATA_KEYS,
  DIMENSION_MAPPINGS,
} from "../demographics";
import {
  AgeIdentifier,
  DemographicFields,
  GenderIdentifier,
  HistoricalPopulationBreakdownRecord,
  RaceIdentifier,
  recordIsTotalByDimension,
} from "../metricsApi";
import { colors } from "../UiLibrary";
import Metric, { BaseMetricConstructorOptions } from "./Metric";

const EXPECTED_MONTHS = 240; // 20 years

function dataIncludesCurrentMonth(
  records: HistoricalPopulationBreakdownRecord[]
) {
  const thisMonth = startOfMonth(new Date());
  return records.some((record) => record.date === thisMonth);
}

const getMonthString = (date: Date) => format(date, "yyyy-MM");

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
  // scan the data to see what months we have
  const representedMonths: { [key: string]: boolean } = {};
  records.forEach(({ date }) => {
    representedMonths[getMonthString(date)] = true;
  });
  const isMonthMissing = (date: Date) => {
    return !representedMonths[getMonthString(date)];
  };

  const newDataPoints: HistoricalPopulationBreakdownRecord[] = [];

  let end = new Date();
  if (!includeCurrentMonth) {
    // there may be a reporting lag for the current month; if it's missing,
    // instead of patching it we should just shift the entire window back one month
    if (isMonthMissing(end)) {
      end = subMonths(end, 1);
    }
  }
  const start = subMonths(end, EXPECTED_MONTHS - 1);
  eachMonthOfInterval({ start, end }).forEach((monthStart) => {
    if (isMonthMissing(monthStart)) {
      const monthData = {
        date: monthStart,
        count: 0,
        ...demographicFields,
      };
      newDataPoints.push(monthData);
    }
  });
  return newDataPoints;
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

    makeObservable(this, { dataIncludesCurrentMonth: observable });
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
    DIMENSION_MAPPINGS.forEach((categoryLabels, demographicView) => {
      const recordsForDemographicView = transformedData.filter(
        recordIsTotalByDimension(demographicView)
      );
      Array.from(categoryLabels.keys())
        // don't need to include unknown in this data;
        // they are minimal to nonexistent in historical data and make the legend confusing
        .filter((identifier) => identifier !== DEMOGRAPHIC_UNKNOWN)
        .forEach((identifier) => {
          let recordsForCategory;
          if (demographicView !== "total") {
            const categoryKey = DIMENSION_DATA_KEYS[demographicView];
            recordsForCategory = recordsForDemographicView.filter(
              (record) => record[categoryKey] === identifier
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
                  demographicView === "race"
                    ? (identifier as RaceIdentifier)
                    : "ALL",
                gender:
                  demographicView === "gender"
                    ? (identifier as GenderIdentifier)
                    : "ALL",
                ageBucket:
                  demographicView === "age"
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
    let recordsToReturn = this.getOrFetchRecords();
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );
    return recordsToReturn;
  }

  get dataSeries(): DataSeries<HistoricalPopulationBreakdownRecord>[] | null {
    const { records, demographicView } = this;
    if (!records || demographicView === "nofilter") return null;

    const labelsForDimension = DIMENSION_MAPPINGS.get(demographicView);
    // this should never happen, it's really just a type safety measure.
    //  if it does, something has gone catastrophically wrong
    if (!labelsForDimension)
      throw new Error("Unsupported demographic view. Unable to provide data.");

    return (
      Array.from(labelsForDimension)
        // don't need to include unknown in this data;
        // they are minimal to nonexistent in historical data and make the legend confusing
        .filter(([identifier]) => identifier !== DEMOGRAPHIC_UNKNOWN)
        .map(([identifier, label], index) => ({
          label,
          color: colors.dataViz[index],
          coordinates:
            demographicView === "total"
              ? records
              : records.filter(
                  (record) =>
                    record[DIMENSION_DATA_KEYS[demographicView]] === identifier
                ),
        }))
    );
  }
}
