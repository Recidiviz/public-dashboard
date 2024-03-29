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

import { format } from "date-fns";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  when,
} from "mobx";
import {
  AllMetricsTypeId,
  DemographicCategoryFilter,
  LocalityLabels,
  TenantId,
} from "../contentApi/types";
import RootStore from "../DataStore/RootStore";
import {
  createDemographicCategories,
  DemographicCategories,
  DemographicView,
  getDemographicCategoriesForView,
  getDemographicViewLabel,
} from "../demographics";
import {
  RawMetricData,
  DemographicFields,
  LocalityFields,
  SupervisionSuccessRateMonthlyRecord,
  fetchAndTransformMetric,
  DemographicFieldKeyList,
} from "../metricsApi";
import { formatAsNumber } from "../utils";
import downloadData from "./downloadData";
import {
  MetricRecord,
  Hydratable,
  Unknowns,
  UnknownCounts,
  UnknownByDate,
  UnknownByCohort,
} from "./types";

function formatUnknownCounts(unknowns: UnknownCounts) {
  const parts: string[] = [];

  DemographicFieldKeyList.forEach((key) => {
    const value = unknowns[key];
    if (!value) return;

    parts.push(
      `${getDemographicViewLabel(key).toLowerCase()} (${formatAsNumber(value)})`
    );
  });

  return parts.join(", ");
}

export type BaseMetricConstructorOptions<RecordFormat extends MetricRecord> = {
  id: AllMetricsTypeId;
  name: string;
  methodology: string;
  tenantId: TenantId;
  sourceFileName: string;
  dataTransformer: (d: RawMetricData) => RecordFormat[];
  demographicFilter?: DemographicCategoryFilter;
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
  rootStore?: RootStore;
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
  readonly id: AllMetricsTypeId;

  readonly methodology: string;

  readonly name: string;

  // relationships
  // we don't really need the entire Tenant object,
  // only the ID for use in the API request
  readonly tenantId: TenantId;

  // data properties
  protected dataTransformer: (d: RawMetricData) => RecordFormat[];

  protected readonly sourceFileName: string;

  isLoading?: boolean;

  protected allRecords?: RecordFormat[];

  error?: Error;

  rootStore?: RootStore;

  // filter properties
  private readonly demographicCategories: DemographicCategories;

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
    methodology,
    id,
    tenantId,
    sourceFileName,
    dataTransformer,
    demographicFilter,
    defaultDemographicView,
    defaultLocalityId,
    localityLabels,
    rootStore,
  }: BaseMetricConstructorOptions<RecordFormat>) {
    makeObservable<Metric<RecordFormat>, "allRecords">(this, {
      allRecords: observable.ref,
      demographicView: observable,
      localityId: observable,
      error: observable,
      hydrate: action,
      isLoading: observable,
      records: computed,
      unknowns: computed,
      readme: computed,
    });

    // initialize metadata
    this.name = name;
    this.methodology = methodology.replace(/\s+/g, " ");
    this.id = id;

    // initialize data fetching
    this.tenantId = tenantId;
    this.sourceFileName = sourceFileName;
    this.dataTransformer = dataTransformer;
    this.rootStore = rootStore;

    // initialize filters
    this.demographicCategories = createDemographicCategories(demographicFilter);
    this.getDemographicCategories = this.getDemographicCategories.bind(this);
    this.localityId = defaultLocalityId;
    this.localityLabels = localityLabels;
    this.demographicView = defaultDemographicView;
  }

  /**
   * Fetches the metric data from the server and transforms it.
   */
  protected async fetchAndTransform(): Promise<RecordFormat[]> {
    const records = await fetchAndTransformMetric({
      sourceFileName: this.sourceFileName,
      tenantId: this.tenantId,
      transformFn: this.dataTransformer,
      rootStore: this.rootStore,
    });
    return records;
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

  get records(): RecordFormat[] | undefined {
    return this.allRecords;
  }

  get recordsUnfiltered(): RecordFormat[] | undefined {
    return this.allRecords;
  }

  // eslint-disable-next-line class-methods-use-this
  get unknowns(): Unknowns | undefined {
    return undefined;
  }

  get readme(): string {
    const { unknowns } = this;
    if (!unknowns) {
      return this.methodology;
    }
    let formattedUnknowns: string;
    if (Array.isArray(unknowns)) {
      formattedUnknowns = (unknowns as (UnknownByDate | UnknownByCohort)[])
        .map((entry) => {
          let formattedCounts: string;
          let label: string;

          if ("category" in entry.unknowns) {
            formattedCounts = `category (${formatAsNumber(
              entry.unknowns.category
            )})`;
          } else {
            formattedCounts = formatUnknownCounts(entry.unknowns);
          }

          if ("date" in entry) {
            label = format(entry.date, "MMM d y");
          } else {
            label = `the ${entry.cohort} cohort`;
          }

          return `${formattedCounts} for ${label}`;
        })
        .join("; ");
    } else {
      formattedUnknowns = formatUnknownCounts(unknowns);
    }
    return `${this.methodology}\n\nVISUALIZATION FOOTNOTES:\n\nValues that count towards the total but are excluded from demographic breakdown views: ${formattedUnknowns}`;
  }

  /**
   * Creates a zip file of all this metric's data in CSV format and
   * initiates a download of that file in the user's browser.
   */
  download = async (): Promise<void> => {
    await when(() => this.allRecords !== undefined);

    // we don't really need a reaction here;
    // runInAction stops the Mobx linter from yelling at us
    return runInAction(() =>
      downloadData({
        archiveName: `${this.tenantId} ${this.id} data`,
        readmeContents: this.readme,
        // allRecords won't be undefined because we just awaited it
        dataFiles: [{ name: "data", data: this.allRecords as RecordFormat[] }],
      })
    );
  };

  getDemographicCategories(
    view: Exclude<DemographicView, "nofilter">
  ): ReturnType<typeof getDemographicCategoriesForView> {
    return getDemographicCategoriesForView(view, this.demographicCategories);
  }
}
