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
import { recordIsTotalByDimension } from "../demographics";
import { RateByCategoryAndDemographicsRecord } from "../metricsApi";
import { countUnknowns, hasUnknowns } from "./unknowns";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { RateByCategoryAndDemographicsRecords, UnknownCounts } from "./types";

export default class RateByCategoryAndDemographicsMetric extends Metric<RateByCategoryAndDemographicsRecord> {
  constructor(
    props: BaseMetricConstructorOptions<RateByCategoryAndDemographicsRecord>
  ) {
    super(props);

    makeObservable(this, { dataSeries: computed });
  }

  get records(): RateByCategoryAndDemographicsRecord[] | undefined {
    let recordsToReturn = this.allRecords;
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );
    return recordsToReturn;
  }

  get dataSeries(): RateByCategoryAndDemographicsRecords[] | null {
    const { demographicView, records, getDemographicCategories } = this;
    if (
      !records ||
      demographicView === "nofilter" ||
      demographicView === "total"
    )
      return null;

    const categories = getDemographicCategories(demographicView);
    let pivotedData: RateByCategoryAndDemographicsRecords[] = [];

    //pivot and group data by category
    categories
      .map((category) => category.identifier)
      .forEach((item) => {
        pivotedData.push(
          records.reduce(
            (pivotedObj, obj: RateByCategoryAndDemographicsRecord) => {
              if (item === obj[demographicView]) {
                pivotedObj.label =
                  categories.find(
                    (category) => category.identifier === obj[demographicView]
                  )?.label ?? "Unknown";
                pivotedObj[obj.category] = obj.rate;
              }
              return pivotedObj;
            },
            {} as RateByCategoryAndDemographicsRecords
          )
        );
      });

    return pivotedData;
  }

  get unknowns(): UnknownCounts | undefined {
    const { allRecords } = this;

    if (!allRecords) return undefined;

    const rates = countUnknowns(
      allRecords,
      (records: RateByCategoryAndDemographicsRecord[]) =>
        sum(records, (r) => r.rate)
    );

    return hasUnknowns(rates) ? rates : undefined;
  }
}
