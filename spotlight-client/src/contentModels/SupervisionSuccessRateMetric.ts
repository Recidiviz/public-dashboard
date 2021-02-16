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

import { runInAction } from "mobx";
import {
  RawMetricData,
  SupervisionSuccessRateDemographicsRecord,
  SupervisionSuccessRateMonthlyRecord,
} from "../metricsApi";
import Metric, {
  BaseMetricConstructorOptions,
  fetchAndTransformMetric,
} from "./Metric";

/**
 * This metric is unique in that it combines data from two different source files,
 * both of which are required, that map to two different record formats. As a result
 * the core "records" property is not really useful and has been disabled.
 */
export default class SupervisionSuccessRateMetric extends Metric<
  SupervisionSuccessRateMonthlyRecord
> {
  private readonly demographicSourceFileName: string;

  private demographicDataTransformer: (
    d: RawMetricData
  ) => SupervisionSuccessRateDemographicsRecord[];

  private allCohortRecords?: SupervisionSuccessRateMonthlyRecord[];

  private allDemographicRecords?: SupervisionSuccessRateDemographicsRecord[];

  constructor(
    props: BaseMetricConstructorOptions<SupervisionSuccessRateMonthlyRecord> & {
      demographicSourceFileName: string;
      demographicDataTransformer: (
        d: RawMetricData
      ) => SupervisionSuccessRateDemographicsRecord[];
    }
  ) {
    super(props);

    this.demographicSourceFileName = props.demographicSourceFileName;
    this.demographicDataTransformer = props.demographicDataTransformer;
  }

  /**
   * Not supported. Use individual cohort or demographic record streams instead.
   */
  // eslint-disable-next-line class-methods-use-this
  protected getOrFetchRecords():
    | SupervisionSuccessRateMonthlyRecord[]
    | undefined {
    throw new Error(
      "Method not supported. Use cohortRecords or demographicRecords for a specific record stream."
    );
  }

  /**
   * Fetches data from both sources and stores the results reactively.
   */
  async populateAllRecords(): Promise<void> {
    this.isLoading = true;
    try {
      const [cohortData, demographicData] = await Promise.all([
        this.fetchAndTransform(),
        fetchAndTransformMetric({
          sourceFileName: this.demographicSourceFileName,
          tenantId: this.tenantId,
          transformFn: this.demographicDataTransformer,
        }),
      ]);

      runInAction(() => {
        this.allCohortRecords = cohortData;
        this.allDemographicRecords = demographicData;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.allCohortRecords = undefined;
        this.allDemographicRecords = undefined;
        this.isLoading = false;
        this.error = e;
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get records(): SupervisionSuccessRateMonthlyRecord[] | undefined {
    throw new Error(
      "Method not supported. Use cohortRecords or demographicRecords for a specific record stream."
    );
  }

  get cohortRecords(): SupervisionSuccessRateMonthlyRecord[] | undefined {
    if (this.allCohortRecords) return this.allCohortRecords;
    if (!this.isLoading || !this.error) this.populateAllRecords();
    return undefined;
  }

  get demographicRecords():
    | SupervisionSuccessRateDemographicsRecord[]
    | undefined {
    if (this.allDemographicRecords) return this.allDemographicRecords;
    if (!this.isLoading || !this.error) this.populateAllRecords();
    return undefined;
  }
}
