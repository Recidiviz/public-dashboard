// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { ValuesType } from "utility-types";
import { callMetricsApi, DataFile } from "../metricsApi/metricsClient";
import { NamedEntity } from "./types";

export enum MetricTypes {
  SentencePopulationCurrent = "SentencePopulationCurrent",
  SentenceTypesCurrent = "SentenceTypesCurrent",
}

type MetricsContent = NamedEntity & { methodology: string };

type MetricFactoryOptionsBase = MetricsContent;

type TotalIdentifier = "ALL";
const TOTAL_KEY: TotalIdentifier = "ALL";

type DemographicView = "total" | "race" | "gender" | "age";

const DIMENSION_DATA_KEYS: Record<
  Exclude<DemographicView, "total">,
  keyof DemographicFields
> = {
  age: "ageBucket",
  gender: "gender",
  race: "raceOrEthnicity",
};

// TODO: should these be enums?
type RaceIdentifier =
  | TotalIdentifier
  | "AMERICAN_INDIAN_ALASKAN_NATIVE"
  | "ASIAN"
  | "BLACK"
  | "HISPANIC"
  | "NATIVE_HAWAIIAN_PACIFIC_ISLANDER"
  | "WHITE"
  | "OTHER";
type GenderIdentifier = TotalIdentifier | "FEMALE" | "MALE";
type AgeIdentifier =
  | TotalIdentifier
  | "<25"
  | "25-29"
  | "30-34"
  | "35-39"
  | "40<";

type BaseMetricFields = {
  stateCode: string;
};

type DemographicFields = {
  raceOrEthnicity: RaceIdentifier;
  gender: GenderIdentifier;
  ageBucket: AgeIdentifier;
};

type LocalityFields = {
  locality: string;
};

type RawRecord = Record<string, unknown>;

export type AnyMetric = Metric<RawRecord>;

type PopulationBreakdownByLocationRecord = BaseMetricFields &
  DemographicFields &
  LocalityFields & {
    population: number;
  };

// TODO: should these even be different types? why not just PopulationSnapshot?
type PopulationSnapshot = Metric<PopulationBreakdownByLocationRecord>;

type SentenceTypeByLocationRecord = BaseMetricFields &
  DemographicFields &
  LocalityFields & {
    dualSentenceCount: number;
    incarcerationCount: number;
    probationCount: number;
  };
type SentenceTypesCurrent = Metric<SentenceTypeByLocationRecord>;

type DataTransformer<RecordFormat> = (rawData: DataFile) => RecordFormat[];

type InitParams<RecordFormat> = {
  contentSource: MetricsContent;
  dataTransformer: DataTransformer<RecordFormat>;
  sourceFileName: string;
  // NOTE: these fields can only be populated if the RecordFormat contains the requisite fields;
  // however, they are not REQUIRED to be populated in those cases (e.g., population snapshots
  // contain demographic fields but do not need to support demographic filters).
  // I think this means it's possible to inadvertently break a filter by setting it to `undefined`
  // without triggering a compiler error. Maybe that can be fixed but I have not done so here
  defaultLocalityId?: RecordFormat extends LocalityFields ? string : undefined;
  defaultDemographicView?: RecordFormat extends DemographicFields
    ? DemographicView
    : undefined;
};

class Metric<RecordFormat extends RawRecord> {
  // metadata properties
  readonly description: string;

  readonly methodology: string;

  readonly name: string;

  // data properties
  private dataTransformer: DataTransformer<RecordFormat>;

  private sourceFileName: string;

  isLoading: boolean;

  private allRecords?: RecordFormat[];

  error?: Error;

  // filter properties
  localityId?: RecordFormat extends LocalityFields ? string : undefined;

  demographicView?: RecordFormat extends DemographicFields
    ? DemographicView
    : undefined;

  constructor({
    contentSource,
    dataTransformer,
    defaultLocalityId,
    defaultDemographicView,
    sourceFileName,
  }: InitParams<RecordFormat>) {
    // initialize metadata
    this.description = contentSource.description;
    this.methodology = contentSource.methodology;
    this.name = contentSource.name;

    // initialize data fetching
    this.isLoading = true;
    this.dataTransformer = dataTransformer;
    this.sourceFileName = sourceFileName;

    // initialize filters
    this.localityId = defaultLocalityId;
    this.demographicView = defaultDemographicView;
  }

  async fetch(): Promise<void> {
    // TODO: map metric type to file name(s) in factory function?
    const apiResponse = await callMetricsApi({
      files: [this.sourceFileName],
    });
    // TODO: call the proper data transformation function for the metric type
    if (apiResponse) {
      const metricFileData = apiResponse[this.sourceFileName];
      if (metricFileData) {
        this.allRecords = this.dataTransformer(metricFileData);
      }
      this.isLoading = false;
    }
  }

  get records(): RecordFormat[] {
    let recordsToReturn = this.allRecords || [];

    if (this.localityId) {
      recordsToReturn = recordsToReturn.filter(
        (record) => record.locality === this.localityId
      );
    }

    if (this.demographicView) {
      recordsToReturn = recordsToReturn.filter(
        recordIsTotalByDimension(this.demographicView)
      );
    }

    return recordsToReturn;
  }
}

export default Metric;

/**
 * Returns a filter predicate for the specified demographic view
 * that will exclude totals and breakdowns for all other views
 */
function recordIsTotalByDimension(
  demographicView: DemographicView
): (record: RawRecord) => boolean {
  const keysEnum = { ...DIMENSION_DATA_KEYS };

  if (demographicView !== "total") {
    delete keysEnum[demographicView];
  }

  const otherDataKeys = Object.values(keysEnum);

  return (record) => {
    let match = true;
    if (demographicView !== "total") {
      // filter out totals
      match =
        match && record[DIMENSION_DATA_KEYS[demographicView]] !== TOTAL_KEY;
    }

    // filter out subset permutations
    match = match && otherDataKeys.every((key) => record[key] === TOTAL_KEY);

    return match;
  };
}

export type MetricsMapping = {
  [MetricTypes.SentencePopulationCurrent]?: PopulationSnapshot;
  [MetricTypes.SentenceTypesCurrent]?: SentenceTypesCurrent;
};

function extractBaseFields(record: ValuesType<DataFile>): BaseMetricFields {
  return {
    stateCode: record.state_code,
  };
}

function extractDemographicFields(
  record: ValuesType<DataFile>
): DemographicFields {
  return {
    // we are trusting the API to return valid strings here, not validating them
    raceOrEthnicity: record.race_or_ethnicity as RaceIdentifier,
    gender: record.gender as GenderIdentifier,
    ageBucket: record.age_bucket as AgeIdentifier,
  };
}

function transformSentencePopulationCurrent(
  rawRecords: DataFile
): PopulationBreakdownByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      locality: record.district,
      population: Number(record.total_population_count),
      ...extractBaseFields(record),
      ...extractDemographicFields(record),
    };
  });
}

function transformSentenceTypes(
  rawRecords: DataFile
): SentenceTypeByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      dualSentenceCount: Number(record.dual_sentence_count),
      incarcerationCount: Number(record.incarceration_count),
      locality: record.district,
      probationCount: Number(record.probation_count),
      ...extractBaseFields(record),
      ...extractDemographicFields(record),
    };
  });
}

export function createMetric(opts: {
  metricType: MetricTypes.SentencePopulationCurrent;
  initOptions: MetricFactoryOptionsBase;
}): PopulationSnapshot;
export function createMetric(opts: {
  metricType: MetricTypes.SentenceTypesCurrent;
  initOptions: MetricFactoryOptionsBase;
}): SentenceTypesCurrent;
// TODO: like 20 more overloads for all the different metric types -_-
/**
 * Factory function for creating Metric instances.
 * Returned Metric instance will be a the subtype of Metric
 * indicated by the metricType argument.
 */
export function createMetric({
  metricType,
  initOptions,
}: {
  metricType: keyof typeof MetricTypes;
  initOptions: MetricFactoryOptionsBase;
}): AnyMetric {
  switch (metricType) {
    case MetricTypes.SentencePopulationCurrent:
      return new Metric<PopulationBreakdownByLocationRecord>({
        contentSource: initOptions,
        dataTransformer: transformSentencePopulationCurrent,
        defaultLocalityId: "ALL",
        sourceFileName: "sentence_type_by_district_by_demographics",
      });
    case MetricTypes.SentenceTypesCurrent:
      return new Metric<SentenceTypeByLocationRecord>({
        contentSource: initOptions,
        dataTransformer: transformSentenceTypes,
        defaultLocalityId: "ALL",
        defaultDemographicView: "total",
        sourceFileName: "sentence_type_by_district_by_demographics",
      });
    default:
      throw new Error("unsupported metric type");
  }
}
