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
import { csvFormat } from "d3-dsv";
import downloadjs from "downloadjs";
import JsZip from "jszip";
import { computed, makeObservable, observable, runInAction, when } from "mobx";
import { stripHtml } from "string-strip-html";
import {
  DemographicView,
  getDemographicCategories,
  recordIsTotalByDimension,
  TOTAL_KEY,
} from "../demographics";
import {
  getCohortLabel,
  RateFields,
  RawMetricData,
  recordMatchesLocality,
  SupervisionSuccessRateDemographicsRecord,
  SupervisionSuccessRateMonthlyRecord,
} from "../metricsApi";
import getMissingMonths from "./getMissingMonths";
import Metric, {
  BaseMetricConstructorOptions,
  fetchAndTransformMetric,
} from "./Metric";

function dataIncludesCurrentMonth(
  records: SupervisionSuccessRateMonthlyRecord[]
): boolean {
  const now = new Date();
  const thisYear = now.getFullYear();
  // JS dates provide a month index, whereas records use calendar months
  const thisMonth = now.getMonth() + 1;

  return records.some(
    (record) => record.year === thisYear && record.month === thisMonth
  );
}

/**
 * This metric is unique in that it combines data from two different source files,
 * both of which are required, that map to two different record formats. As a result
 * the core "records" property is not really useful and has been disabled.
 */
export default class SupervisionSuccessRateMetric extends Metric<
  SupervisionSuccessRateMonthlyRecord
> {
  demographicView: DemographicView = "total";

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

    makeObservable<
      SupervisionSuccessRateMetric,
      "allCohortRecords" | "allDemographicRecords"
    >(this, {
      allDemographicRecords: observable.ref,
      allCohortRecords: observable.ref,
      cohortRecords: computed,
      demographicRecords: computed,
    });
  }

  /**
   * Not supported. Use individual cohort or demographic record streams instead.
   */
  // eslint-disable-next-line class-methods-use-this
  protected getOrFetchRecords(): undefined {
    throw new Error(
      "Method not supported. Use cohortRecords or demographicRecords for a specific record stream."
    );
  }

  /**
   * Returns unfiltered cohort records. Kicks off a fetch if necessary.
   */
  getOrFetchCohortRecords(): SupervisionSuccessRateMonthlyRecord[] | undefined {
    if (this.allCohortRecords) return this.allCohortRecords;
    if (!this.isLoading || !this.error) this.populateAllRecords();
    return undefined;
  }

  /**
   * Returns unfiltered demographic records. Kicks off a fetch if necessary.
   */
  getOrFetchDemographicRecords():
    | SupervisionSuccessRateDemographicsRecord[]
    | undefined {
    if (this.allDemographicRecords) return this.allDemographicRecords;
    if (!this.isLoading || !this.error) this.populateAllRecords();
    return undefined;
  }

  /**
   * Fetches cohort data from the server and transforms it.
   * Imputes any missing months in the expected range to zero.
   */
  protected async fetchAndTransform(): Promise<
    SupervisionSuccessRateMonthlyRecord[]
  > {
    const transformedData = await super.fetchAndTransform();

    // if the current month is completely missing from data, we will assume it is
    // actually missing due to reporting lag. But if any record contains it, we will
    // assume that it should be replaced with an empty record when it is missing
    const includeCurrentMonth = dataIncludesCurrentMonth(transformedData);

    const missingRecords: SupervisionSuccessRateMonthlyRecord[] = [];

    // isolate each locality and impute any missing records
    const localityIds = [
      ...this.localityLabels.entries.map(({ id }) => id),
      TOTAL_KEY,
    ];
    localityIds.forEach((localityId) => {
      const recordsForLocality = transformedData.filter(
        recordMatchesLocality(localityId)
      );

      const missingMonths = getMissingMonths({
        expectedMonths: 36,
        includeCurrentMonth,
        records: recordsForLocality.map(({ year, month }) => ({
          year,
          monthIndex: month - 1,
        })),
      });

      missingRecords.push(
        ...missingMonths.map(({ year, monthIndex }) => ({
          year,
          month: monthIndex + 1,
          label: getCohortLabel({ year, month: monthIndex + 1 }),
          locality: localityId,
          rate: 0,
          rateNumerator: 0,
          rateDenominator: 0,
        }))
      );
    });

    transformedData.push(...missingRecords);

    transformedData.sort(
      (a, b) => ascending(a.year, b.year) || ascending(a.month, b.month)
    );

    return transformedData;
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
    let recordsToReturn = this.getOrFetchCohortRecords();
    if (recordsToReturn === undefined) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordMatchesLocality(this.localityId)
    );

    return recordsToReturn;
  }

  get demographicRecords(): (RateFields & { label: string })[] | undefined {
    const allRecords = this.getOrFetchDemographicRecords();
    const { demographicView } = this;
    if (allRecords === undefined || demographicView === "nofilter")
      return undefined;

    const filteredRecords = allRecords
      .filter(recordMatchesLocality(this.localityId))
      .filter(recordIsTotalByDimension(demographicView));

    return getDemographicCategories(demographicView).map(
      ({ identifier, label }) => {
        let matchingRecord:
          | SupervisionSuccessRateDemographicsRecord
          | undefined;
        if (demographicView === "total") {
          // there should only be one!
          [matchingRecord] = filteredRecords;
        } else {
          matchingRecord = filteredRecords.find(
            (record) => record[demographicView] === identifier
          );
        }
        if (matchingRecord) {
          const { rate, rateDenominator, rateNumerator } = matchingRecord;
          return {
            label,
            rate,
            rateDenominator,
            rateNumerator,
          };
        }

        return { label, rate: 0, rateNumerator: 0, rateDenominator: 0 };
      }
    );
  }

  /**
   * Creates a zip file of all this metric's data in CSV format and
   * initiates a download of that file in the user's browser.
   */
  download(): Promise<void> {
    return new Promise((resolve, reject) => {
      when(
        () =>
          this.allCohortRecords !== undefined &&
          this.allDemographicRecords !== undefined,
        () => {
          const zip = new JsZip();
          const zipName = `${this.tenantId} ${this.id} data`;
          // these assertions are safe because we are waiting for them in the reaction above
          const cohortData = csvFormat(
            this.allCohortRecords as SupervisionSuccessRateMonthlyRecord[]
          );
          const demographicData = csvFormat(
            this
              .allDemographicRecords as SupervisionSuccessRateDemographicsRecord[]
          );
          zip
            .file(`${zipName}/historical data.csv`, cohortData)
            .file(`${zipName}/demographic aggregate data.csv`, demographicData)
            .file(`${zipName}/README.txt`, stripHtml(this.methodology).result);

          zip
            .generateAsync({ type: "blob" })
            .then((content) => {
              downloadjs(content, `${zipName}.zip`);
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  }
}
