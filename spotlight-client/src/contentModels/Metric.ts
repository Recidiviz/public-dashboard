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
import { DataSeries } from "../charts/types";
import { ERROR_MESSAGES } from "../constants";
import { TenantId } from "../contentApi/types";
import {
  fetchMetrics,
  RawMetricData,
  DemographicFields,
  DemographicView,
  LocalityFields,
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

  abstract get dataSeries(): DataSeries<RecordFormat>[] | null;

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
      demographicView: observable,
      error: observable,
      populateAllRecords: action,
      isLoading: observable,
      records: computed,
      dataSeries: computed,
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
   * Fetches the metric data from the server and transforms it.
   */
  protected async fetchAndTransform(): Promise<RecordFormat[]> {
    const apiResponse = await fetchMetrics({
      metricNames: [this.sourceFileName],
      tenantId: this.tenantId,
    });

    const rawData = apiResponse[this.sourceFileName];
    if (rawData) {
      return this.dataTransformer(rawData);
    }
    throw new Error(ERROR_MESSAGES.noMetricData);
  }

  /**
   * Fetches metric data and stores the result reactively on this Metric instance.
   */
  async populateAllRecords(): Promise<void> {
    this.isLoading = true;
    try {
      const fetchedData = await this.fetchAndTransform();
      runInAction(() => {
        this.allRecords = fetchedData;
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
  protected getOrFetchRecords(): RecordFormat[] | undefined {
    if (this.allRecords) return this.allRecords;
    if (!this.isLoading || !this.error) this.populateAllRecords();
    return undefined;
  }

  get records(): RecordFormat[] | undefined {
    return this.getOrFetchRecords();
  }
}
