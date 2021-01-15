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

import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { TenantId } from "../contentApi/types";
import {
  fetchMetrics,
  RawMetricData,
  DemographicFields,
  DemographicView,
  LocalityFields,
  recordIsTotalByDimension,
  recordMatchesLocality,
} from "../metricsApi";
import { MetricRecord, CollectionMap } from "./types";

type BaseMetricConstructorOptions<RecordFormat extends MetricRecord> = {
  name: string;
  description: string;
  methodology: string;
  tenantId: TenantId;
  sourceFileName: string;
  dataTransformer: (d: RawMetricData) => RecordFormat[];
  defaultDemographicView: RecordFormat extends DemographicFields
    ? DemographicView
    : undefined;
  defaultLocalityId: RecordFormat extends LocalityFields ? string : undefined;
};

/**
 * Represents a single dataset backed by our metrics API,
 * plus any applicable metadata.
 * This is an abstract class that cannot be instantiated directly!
 * See subclasses that narrow this base down to a specific metric format.
 * The preferred way to instantiate `Metric` subclasses is with the
 * `createMetricMapping` function, which is defined in its own module to
 * prevent cyclic dependencies in their respective class declarations.
 */
export default abstract class Metric<RecordFormat extends MetricRecord> {
  // metadata properties
  readonly description: string;

  readonly methodology: string;

  readonly name: string;

  // relationships
  collections: CollectionMap = new Map();

  // we don't really need the entire Tenant object,
  // only the ID for use in the API request
  readonly tenantId: TenantId;

  // data properties
  protected dataTransformer: (d: RawMetricData) => RecordFormat[];

  protected readonly sourceFileName: string;

  isLoading?: boolean;

  allRecords?: RecordFormat[];

  error?: Error;

  // filter properties
  localityId: RecordFormat extends LocalityFields ? string : undefined;

  demographicView: RecordFormat extends DemographicFields
    ? DemographicView
    : undefined;

  constructor({
    name,
    description,
    methodology,
    tenantId,
    sourceFileName,
    dataTransformer,
    defaultDemographicView,
    defaultLocalityId,
  }: BaseMetricConstructorOptions<RecordFormat>) {
    makeObservable(this, {
      allRecords: observable.ref,
      error: observable,
      fetch: action,
      isLoading: observable,
      records: computed,
    });

    // initialize metadata
    this.name = name;
    this.description = description;
    this.methodology = methodology;

    // initialize data fetching
    this.tenantId = tenantId;
    this.sourceFileName = sourceFileName;
    this.dataTransformer = dataTransformer;

    // initialize filters
    this.localityId = defaultLocalityId;
    this.demographicView = defaultDemographicView;
  }

  /**
   * Fetches the metric data from the server, transforms it,
   * and stores the result on this Metric instance.
   */
  async fetch(): Promise<void> {
    this.isLoading = true;
    try {
      const apiResponse = await fetchMetrics({
        metricNames: [this.sourceFileName],
        tenantId: this.tenantId,
      });
      runInAction(() => {
        const metricFileData = apiResponse[this.sourceFileName];
        if (metricFileData) {
          this.allRecords = this.dataTransformer(metricFileData);
        }
        this.isLoading = false;
      });
    } catch (e) {
      this.error = e;
    }
  }

  /**
   * Returns fetched, transformed, and (optionally) filtered data for this metric.
   * Will automatically initiate a fetch if necessary.
   */
  get records(): RecordFormat[] | undefined {
    let recordsToReturn = this.allRecords;
    if (recordsToReturn) {
      if (this.localityId) {
        recordsToReturn = recordsToReturn.filter(
          // TS can't seem to resolve this conditional type even after the conditional
          recordMatchesLocality(this.localityId as string)
        );
      }

      if (this.demographicView) {
        recordsToReturn = recordsToReturn.filter(
          // TS can't seem to resolve this conditional type even after the conditional
          recordIsTotalByDimension(this.demographicView as DemographicView)
        );
      }
      return recordsToReturn;
    }
    if (!this.isLoading || !this.error) this.fetch();
    return undefined;
  }
}
