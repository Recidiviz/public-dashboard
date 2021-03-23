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
import { computed, makeObservable } from "mobx";
import {
  DemographicView,
  DemographicViewList,
  getDemographicCategories,
  getDemographicViewLabel,
  recordIsTotalByDimension,
} from "../demographics";
import {
  PopulationBreakdownByLocationRecord,
  recordMatchesLocality,
} from "../metricsApi";
import { colors } from "../UiLibrary";
import calculatePct from "./calculatePct";
import { countUnknowns, hasUnknowns } from "./unknowns";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { DemographicCategoryRecords, UnknownCounts } from "./types";

export default class PopulationBreakdownByLocationMetric extends Metric<
  PopulationBreakdownByLocationRecord
> {
  readonly totalLabel: string;

  constructor(
    props: BaseMetricConstructorOptions<PopulationBreakdownByLocationRecord> & {
      totalLabel: string;
    }
  ) {
    super(props);

    this.totalLabel = props.totalLabel;

    makeObservable(this, {
      dataSeries: computed,
      totalPopulation: computed,
      unknowns: computed,
    });
  }

  get records(): PopulationBreakdownByLocationRecord[] | undefined {
    let recordsToReturn = this.allRecords;
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordMatchesLocality(this.localityId)
    );

    return recordsToReturn;
  }

  get dataSeries(): DemographicCategoryRecords[] | null {
    const { records } = this;
    if (!records) return null;

    return DemographicViewList.filter(
      (view): view is Exclude<DemographicView, "total" | "nofilter"> =>
        view !== "total" && view !== "nofilter"
    ).map((demographicView) => {
      return {
        label: getDemographicViewLabel(demographicView),
        records: calculatePct(
          getDemographicCategories(demographicView).map(
            ({ identifier, label }, index) => {
              let value = 0;
              const matchingRecord = records.find(
                (record) => record[demographicView] === identifier
              );
              if (matchingRecord) {
                value = matchingRecord.population;
              }

              return {
                color: colors.dataViz[index],
                label,
                value,
              };
            }
          )
        ),
      };
    });
  }

  get totalPopulation(): number | undefined {
    const { records } = this;
    if (!records) return undefined;

    const totalRecord = records.find(recordIsTotalByDimension("total"));
    if (!totalRecord) return undefined;

    return totalRecord.population;
  }

  get unknowns(): UnknownCounts | undefined {
    const { records } = this;

    if (!records) return undefined;

    const counts = countUnknowns(
      records,
      (groupedRecords: PopulationBreakdownByLocationRecord[]) =>
        sum(groupedRecords, (r) => r.population)
    );

    return hasUnknowns(counts) ? counts : undefined;
  }
}
