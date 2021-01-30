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

import { computed, makeObservable } from "mobx";
import {
  getDemographicCategories,
  recordIsTotalByDimension,
} from "../demographics";
import { DemographicsByCategoryRecord } from "../metricsApi";
import { colors } from "../UiLibrary";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { DemographicCategoryRecords } from "./types";

export default class DemographicsByCategoryMetric extends Metric<
  DemographicsByCategoryRecord
> {
  constructor(
    props: BaseMetricConstructorOptions<DemographicsByCategoryRecord>
  ) {
    super(props);

    makeObservable(this, { dataSeries: computed });
  }

  get records(): DemographicsByCategoryRecord[] | undefined {
    let recordsToReturn = this.getOrFetchRecords();
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );
    return recordsToReturn;
  }

  get dataSeries(): DemographicCategoryRecords[] | null {
    const { demographicView, records } = this;
    if (!records || demographicView === "nofilter") return null;

    const categories = getDemographicCategories(demographicView);

    return categories.map(({ identifier, label }) => {
      return {
        label,
        records: records
          .filter((record) =>
            demographicView === "total"
              ? true
              : record[demographicView] === identifier
          )
          .map((record, index) => {
            return {
              label: record.category,
              color: colors.dataViz[index],
              value: record.count,
            };
          }),
      };
    });
  }
}
