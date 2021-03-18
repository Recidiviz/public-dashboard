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
  when,
} from "mobx";
import { LocalityLabels, MetricTypeId, TenantId } from "../contentApi/types";
import { DemographicView } from "../demographics";
import {
  RawMetricData,
  DemographicFields,
  LocalityFields,
  SupervisionSuccessRateMonthlyRecord,
  fetchAndTransformMetric,
} from "../metricsApi";
import downloadData from "./downloadData";
import { MetricRecord, CollectionMap, Hydratable } from "./types";

export type BaseMetricConstructorOptions<RecordFormat extends MetricRecord> = {
  id: MetricTypeId;
  name: string;
  description: string;
  methodology: string;
  tenantId: TenantId;
  sourceFileName: string;
  dataTransformer: (d: RawMetricData) => RecordFormat[];
  defaultDemographicView: RecordFormat extends DemographicFields
    ? DemographicView
    : // special case: this metric supports demographics for an alternative record format
    RecordFormat extends SupervisionSuccessRateMonthlyRecord
    ? DemographicView
    : undefined;
  defaultLocalityId: RecordFormat extends LocalityFields ? string : undefined;
  localityLabels: RecordFormat extends LocalityFields
    ? LocalityLabels
    : undefined;
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
export default abstract class Metric<RecordFormat extends MetricRecord>
  implements Hydratable {
  // metadata properties
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

  protected allRecords?: RecordFormat[];

  error?: Error;

  // filter properties
  localityId: RecordFormat extends LocalityFields ? string : undefined;

  localityLabels: RecordFormat extends LocalityFields
    ? LocalityLabels
    : undefined;

  demographicView: RecordFormat extends DemographicFields
    ? DemographicView
    : // special case: this metric supports demographics for an alternative record format
    RecordFormat extends SupervisionSuccessRateMonthlyRecord
    ? DemographicView
    : undefined;

  constructor({
    name,
    description,
    methodology,
    id,
    tenantId,
    sourceFileName,
    dataTransformer,
    defaultDemographicView,
    defaultLocalityId,
    localityLabels,
  }: BaseMetricConstructorOptions<RecordFormat>) {
    makeObservable<Metric<RecordFormat>, "allRecords">(this, {
      allRecords: observable.ref,
      demographicView: observable,
      localityId: observable,
      error: observable,
      hydrate: action,
      isLoading: observable,
      records: computed,
    });

    // initialize metadata
    this.name = name;
    this.description = description;
    this.methodology = methodology;
    this.id = id;

    // initialize data fetching
    this.tenantId = tenantId;
    this.sourceFileName = sourceFileName;
    this.dataTransformer = dataTransformer;

    // initialize filters
    this.localityId = defaultLocalityId;
    this.localityLabels = localityLabels;
    this.demographicView = defaultDemographicView;
  }

  /**
   * Fetches the metric data from the server and transforms it.
   */
  protected async fetchAndTransform(): Promise<RecordFormat[]> {
    return fetchAndTransformMetric({
      sourceFileName: this.sourceFileName,
      tenantId: this.tenantId,
      transformFn: this.dataTransformer,
    });
  }

  /**
   * Fetches metric data and stores the result reactively on this Metric instance.
   */
  async hydrate(): Promise<void> {
    this.isLoading = true;
    try {
      const fetchedData = await this.fetchAndTransform();
      runInAction(() => {
        this.allRecords = fetchedData;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
        this.error = e;
      });
    }
  }

  /**
   * Returns fetched, transformed, and (optionally) filtered data for this metric.
   * Will automatically initiate a fetch if necessary.
   */
  protected getOrFetchRecords(): RecordFormat[] | undefined {
    if (this.allRecords) return this.allRecords;
    if (!this.isLoading || !this.error) this.hydrate();
    return undefined;
  }

  get records(): RecordFormat[] | undefined {
    return this.getOrFetchRecords();
  }

  get recordsUnfiltered(): RecordFormat[] | undefined {
    return this.allRecords;
  }

  /**
   * Creates a zip file of all this metric's data in CSV format and
   * initiates a download of that file in the user's browser.
   */
  async download(): Promise<void> {
    await when(() => this.allRecords !== undefined);

    // we don't really need a reaction here;
    // runInAction stops the Mobx linter from yelling at us
    return runInAction(() =>
      downloadData({
        archiveName: `${this.tenantId} ${this.id} data`,
        readmeContents: this.methodology,
        // allRecords won't be undefined because we just awaited it
        dataFiles: [{ name: "data", data: this.allRecords as RecordFormat[] }],
      })
    );
  }
}
