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

import { ascending, groups } from "d3-array";
import { action, computed, makeObservable, observable } from "mobx";
import { DataSeries, ItemToHighlight } from "../charts";
import {
  dataIncludesBreakdowns,
  recordIsTotalByDimension,
} from "../demographics";
import { RateFields, RecidivismRateRecord } from "../metricsApi";
import { colors } from "../UiLibrary";
import { countUnknowns } from "./unknowns";
import Metric, { BaseMetricConstructorOptions } from "./Metric";
import { DemographicCategoryRateRecords, UnknownsByCohort } from "./types";

type CohortDataSeries = DataSeries<RateFields & { followupYears: number }>;

/**
 * Adds a zero record for followup period zero to an array of records.
 * These are not in the raw data but the UI needs them.
 */
function prependZeroRecord(records: RecidivismRateRecord[]) {
  const zero = { ...records[0] };
  zero.rate = 0;
  zero.rateNumerator = 0;
  zero.followupYears = 0;
  records.unshift(zero);
}

export default class RecidivismRateMetric extends Metric<RecidivismRateRecord> {
  followUpYears?: number;

  private appliedCohortFilter?: number[];

  // this is not strictly a UI concern because it affects the cohort filter
  highlightedCohort?: number;

  constructor(
    props: BaseMetricConstructorOptions<RecidivismRateRecord> & {
      followUpYears?: number;
    }
  ) {
    super(props);

    this.followUpYears = props.followUpYears;

    makeObservable<
      RecidivismRateMetric,
      "appliedCohortFilter" | "allCohortDataSeries"
    >(this, {
      allCohortDataSeries: computed,
      allCohorts: computed,
      appliedCohortFilter: observable,
      cohortDataSeries: computed,
      followUpYears: observable,
      highlightedCohort: observable,
      includesDemographics: computed,
      maxFollowupPeriod: computed,
      selectedCohorts: computed,
      setHighlightedCohort: action,
      setSelectedCohorts: action,
      singleFollowupDemographics: computed,
      unknowns: computed,
    });
  }

  get records(): RecidivismRateRecord[] | undefined {
    let recordsToReturn = this.allRecords;
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
    const { demographicView, records, getDemographicCategories } = this;
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
          .map((record) => {
            return {
              label: `${record.releaseCohort}`,
              color: colors.dataViz[0],
              value: record.rateNumerator,
              pct: record.rate,
              denominator: record.rateDenominator,
            };
          }),
      };
    });
  }

  get allCohorts(): number[] | undefined {
    if (this.allRecords !== undefined) {
      return Array.from(
        new Set(this.allRecords.map((d) => d.releaseCohort))
      ).sort((a, b) => ascending(a, b));
    }
    // if we don't have records yet, provide nothing
    return undefined;
  }

  get selectedCohorts(): number[] | undefined {
    // if the underlying value has been set, use that
    if (this.appliedCohortFilter !== undefined) return this.appliedCohortFilter;
    // if not, provide a default value based on records
    return this.allCohorts;
  }

  setSelectedCohorts(cohorts: number[] | undefined): void {
    this.appliedCohortFilter = cohorts;

    // demographic views are not supported for multiple cohorts; reset
    if (cohorts === undefined || cohorts.length > 1) {
      this.demographicView = "total";
    }
  }

  /**
   * Translates conventional highlight state signature into cohort identifier
   * and updates the observable state.
   */
  setHighlightedCohort(item?: ItemToHighlight): void {
    if (item) {
      this.highlightedCohort = Number(item.label);
    } else {
      this.highlightedCohort = undefined;
    }
  }

  /**
   * A list of all possible cohort data series. We can filter this
   * for consumers while keeping color assignments stable.
   */
  private get allCohortDataSeries(): CohortDataSeries[] | undefined {
    const { allCohorts, records } = this;
    if (allCohorts === undefined || records === undefined) return undefined;

    return allCohorts.map((cohort, index) => {
      const coordinates = records
        .filter((record) => record.releaseCohort === cohort)
        .sort((a, b) => ascending(a.followupYears, b.followupYears));

      prependZeroRecord(coordinates);

      return {
        label: `${cohort}`,
        color: colors.dataViz[index],
        coordinates,
      };
    });
  }

  get cohortDataSeries(): CohortDataSeries[] | undefined {
    const {
      selectedCohorts,
      allCohortDataSeries,
      demographicView,
      records,
      getDemographicCategories,
    } = this;
    if (
      selectedCohorts === undefined ||
      records === undefined ||
      demographicView === "nofilter"
    )
      return undefined;

    // series for each cohort
    if (demographicView === "total") {
      return allCohortDataSeries?.filter((series) => {
        const cohort = Number(series.label);
        return (
          cohort === this.highlightedCohort || selectedCohorts.includes(cohort)
        );
      });
    }

    return getDemographicCategories(demographicView).map((category, index) => {
      const coordinates = records
        .filter(
          (record) =>
            record[demographicView] === category.identifier &&
            record.releaseCohort === selectedCohorts[0]
        )
        .sort((a, b) => ascending(a.followupYears, b.followupYears));

      prependZeroRecord(coordinates);

      return {
        label: category.label,
        color: colors.dataViz[index],
        coordinates,
      };
    });
  }

  get unknowns(): UnknownsByCohort | undefined {
    const { allRecords } = this;
    if (!allRecords) return undefined;

    const countsByCohort = groups(allRecords, (r) => r.releaseCohort)
      .map(([cohort, records]) => ({
        cohort,
        unknowns: countUnknowns(
          records,
          // count should be the same across followup periods so we just need one
          (groupedRecords) => groupedRecords[0].rateDenominator
        ),
      }))
      .filter((item) => Object.values(item.unknowns).some((val) => val));

    return countsByCohort.length ? countsByCohort : undefined;
  }

  /**
   * Maximum follow-up period present in data. Defaults to 10 when not hydrated.
   */
  get maxFollowupPeriod(): number {
    const { allRecords } = this;
    if (!allRecords) return 10;

    return Math.max(...allRecords.map((record) => record.followupYears));
  }

  get includesDemographics(): boolean | undefined {
    const { allRecords } = this;
    if (!allRecords) return undefined;

    return dataIncludesBreakdowns(allRecords);
  }
}
