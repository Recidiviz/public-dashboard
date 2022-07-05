// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
import { computed, makeObservable } from "mobx";
import { pipe, groupBy, values } from "lodash/fp";
import { recordIsTotalByDimension } from "../demographics";
import { DemographicsByCategoryRecord } from "../metricsApi";
import { colors } from "../UiLibrary";
import calculatePct from "./calculatePct";
import { countUnknowns, hasUnknowns } from "./unknowns";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { DemographicCategoryRecords, UnknownCounts } from "./types";

export default class CategoriesByDemographicMetric extends Metric<DemographicsByCategoryRecord> {
  // consumers can override to make all records the same color
  private readonly color?: string;

  constructor(
    props: BaseMetricConstructorOptions<DemographicsByCategoryRecord> & {
      color?: string;
    }
  ) {
    super(props);

    this.color = props.color;

    makeObservable(this, { dataSeries: computed });
  }

  get records(): DemographicsByCategoryRecord[] | undefined {
    let recordsToReturn = this.allRecords;
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );
    return recordsToReturn;
  }

  get dataSeries(): DemographicCategoryRecords[] | null {
    const { color, demographicView, records, getDemographicCategories } = this;
    if (!records || demographicView === "nofilter") return null;

    const categories = getDemographicCategories(demographicView);

    const filteredRecordsByCategory = pipe(
      groupBy((d: DemographicsByCategoryRecord) => d.category),
      values
    )(records);

    return filteredRecordsByCategory.map(
      (r: DemographicsByCategoryRecord[]) => {
        return {
          label: r[0].category,
          records: calculatePct(
            categories.map(({ label, identifier }, index) => {
              const filteredRecord = r.filter((record) =>
                demographicView === "total"
                  ? true
                  : record[demographicView] === identifier
              )[0];
              return {
                label,
                color: color || colors.dataViz[index],
                value: filteredRecord.count,
              };
            })
          ),
        };
      }
    );
  }

  get unknowns(): UnknownCounts | undefined {
    const { allRecords } = this;

    if (!allRecords) return undefined;

    const counts = countUnknowns(
      allRecords,
      (records: DemographicsByCategoryRecord[]) => sum(records, (r) => r.count)
    );

    return hasUnknowns(counts) ? counts : undefined;
  }
}
