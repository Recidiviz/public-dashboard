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
import { MetricTypeId, TenantId } from "../contentApi/types";
import { fetchMetrics, RawMetricData } from "../metricsApi";
import {
  DemographicFields,
  DemographicView,
  LocalityFields,
  NOFILTER_KEY,
  recordIsTotalByDimension,
} from "../metricsApi/utils";
import { AnyRecord, CollectionMap } from "./types";

type BaseMetricConstructorOptions<RecordFormat = AnyRecord> = {
  id: MetricTypeId;
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
export default abstract class Metric<RecordFormat = AnyRecord> {
  // metadata properties
  // TODO: do we actually need this property?
  readonly id: MetricTypeId;

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
    id,
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
    this.id = id;
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
      // TODO: TS can't figure out these subtypes and I have to manually cast them? can this be fixed?
      if (this.localityId && this.localityId !== NOFILTER_KEY) {
        recordsToReturn = recordsToReturn.filter(
          (record) =>
            ((record as unknown) as LocalityFields).locality === this.localityId
        );
      }

      if (this.demographicView) {
        const view = this.demographicView as DemographicView;
        if (view !== NOFILTER_KEY) {
          recordsToReturn = (((recordsToReturn as unknown) as DemographicFields[]).filter(
            recordIsTotalByDimension(view)
          ) as unknown) as RecordFormat[];
        }
      }
      return recordsToReturn;
    }
    if (!this.isLoading || !this.error) this.fetch();
    return undefined;
  }
}
