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
import { DataSeries } from "../charts/types";
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_DATA_KEYS,
  DIMENSION_MAPPINGS,
} from "../demographics";
import {
  HistoricalPopulationBreakdownRecord,
  recordIsTotalByDimension,
} from "../metricsApi";
import { colors } from "../UiLibrary";
import Metric from "./Metric";

export default class HistoricalPopulationBreakdownMetric extends Metric<
  HistoricalPopulationBreakdownRecord
> {
  async fetchAndTransform(): Promise<HistoricalPopulationBreakdownRecord[]> {
    const transformedData = await super.fetchAndTransform();

    // TODO(#278): add missing months to data

    // if the current month is completely missing from data, we will assume it is
    // actually missing due to reporting lag. But if any record contains it, we will
    // assume that it should be replaced with an empty record when it is missing
    // const includeCurrentMonth = dataIncludesCurrentMonth(transformedData);

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
        .filter(([value]) => value !== DEMOGRAPHIC_UNKNOWN)
        .map(([value, label], index) => ({
          label,
          color: colors.dataViz[index],
          coordinates:
            demographicView === "total"
              ? records
              : records.filter(
                  (record) =>
                    record[DIMENSION_DATA_KEYS[demographicView]] === value
                ),
        }))
    );
  }
}
