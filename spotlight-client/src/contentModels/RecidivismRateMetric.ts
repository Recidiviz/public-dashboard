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
import { computed, makeObservable, observable } from "mobx";
import {
  getDemographicCategories,
  recordIsTotalByDimension,
} from "../demographics";
import { RecidivismRateRecord } from "../metricsApi";
import { colors } from "../UiLibrary";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { DemographicCategoryRateRecords } from "./types";

export default class RecidivismRateMetric extends Metric<RecidivismRateRecord> {
  followUpYears?: number;

  constructor(
    props: BaseMetricConstructorOptions<RecidivismRateRecord> & {
      followUpYears?: number;
    }
  ) {
    super(props);

    this.followUpYears = props.followUpYears;

    makeObservable(this, {
      followUpYears: observable,
      singleFollowupDemographics: computed,
    });
  }

  get records(): RecidivismRateRecord[] | undefined {
    let recordsToReturn = this.getOrFetchRecords();
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );

    if (this.followUpYears !== undefined) {
      recordsToReturn = recordsToReturn.filter(
        (record) => record.followupYears === this.followUpYears
      );
    }

    return recordsToReturn;
  }

  get singleFollowupDemographics(): DemographicCategoryRateRecords[] | null {
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
          .sort((a, b) => ascending(a.releaseCohort, b.releaseCohort))
          .map((record, index) => {
            return {
              label: `${record.releaseCohort}`,
              color: colors.dataViz[0],
              value: record.rate,
              numerator: record.rateNumerator,
              denominator: record.rateDenominator,
            };
          }),
      };
    });
  }
}
