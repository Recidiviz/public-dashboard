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

/**
 * Functions for transforming raw metrics API response data
 * into the data types defined for their corresponding Metric objects
 * @module
 */

import { ValuesType } from "utility-types";
import { RawMetricData } from "../fetchMetrics";
import {
  AgeIdentifier,
  DemographicsByCategoryRecord,
  GenderIdentifier,
  HistoricalPopulationBreakdownRecord,
  PopulationBreakdownByLocationRecord,
  ProgramParticipationCurrentRecord,
  RaceIdentifier,
  RecidivismRateRecord,
  SentenceTypeByLocationRecord,
  SupervisionSuccessRateDemographicsRecord,
  SupervisionSuccessRateMonthlyRecord,
} from "./types";

function recordIsParole(record: ValuesType<RawMetricData>) {
  return record.supervision_type === "PAROLE";
}

function recordIsProbation(record: ValuesType<RawMetricData>) {
  return record.supervision_type === "PROBATION";
}

function extractDemographicFields(record: ValuesType<RawMetricData>) {
  return {
    // we are trusting the API to return valid strings here, not validating them
    raceOrEthnicity: record.race_or_ethnicity as RaceIdentifier,
    gender: record.gender as GenderIdentifier,
    ageBucket: record.age_bucket as AgeIdentifier,
  };
}

export function sentencePopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      locality: record.district,
      population: Number(record.total_population_count),
      ...extractDemographicFields(record),
    };
  });
}

export function prisonPopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      locality: record.facility,
      population: Number(record.total_population),
      ...extractDemographicFields(record),
    };
  });
}

function createSupervisionPopulationRecord(record: ValuesType<RawMetricData>) {
  return {
    locality: record.district,
    population: Number(record.total_supervision_count),
    ...extractDemographicFields(record),
  };
}

export function probationPopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionPopulationRecord);
}

export function parolePopulationCurrent(
  rawRecords: RawMetricData
): PopulationBreakdownByLocationRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionPopulationRecord);
}

function createHistoricalPopulationRecord(record: ValuesType<RawMetricData>) {
  return {
    date: record.population_date,
    count: Number(record.population_count),
    ...extractDemographicFields(record),
  };
}

export function prisonPopulationHistorical(
  rawRecords: RawMetricData
): HistoricalPopulationBreakdownRecord[] {
  return rawRecords.map(createHistoricalPopulationRecord);
}

export function probationPopulationHistorical(
  rawRecords: RawMetricData
): HistoricalPopulationBreakdownRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createHistoricalPopulationRecord);
}

export function parolePopulationHistorical(
  rawRecords: RawMetricData
): HistoricalPopulationBreakdownRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createHistoricalPopulationRecord);
}

export function sentenceTypesCurrent(
  rawRecords: RawMetricData
): SentenceTypeByLocationRecord[] {
  return rawRecords.map((record) => {
    return {
      dualSentenceCount: Number(record.dual_sentence_count),
      incarcerationCount: Number(record.incarceration_count),
      locality: record.district,
      probationCount: Number(record.probation_count),
      ...extractDemographicFields(record),
    };
  });
}

function createProgramParticipationRecord(record: ValuesType<RawMetricData>) {
  return {
    count: Number(record.participation_count),
    locality: record.region_id,
  };
}

export function probationProgramParticipationCurrent(
  rawRecords: RawMetricData
): ProgramParticipationCurrentRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createProgramParticipationRecord);
}

export function paroleProgramParticipationCurrent(
  rawRecords: RawMetricData
): ProgramParticipationCurrentRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createProgramParticipationRecord);
}

function createSupervisionSuccessRateMonthlyRecord(
  record: ValuesType<RawMetricData>
) {
  return {
    locality: record.district,
    year: Number(record.projected_year),
    month: Number(record.projected_month),
    rateNumerator: Number(record.successful_termination_count),
    rateDenominator: Number(record.projected_completion_count),
    rate: Number(record.success_rate),
  };
}

export function probationSuccessRateMonthly(
  rawRecords: RawMetricData
): SupervisionSuccessRateMonthlyRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionSuccessRateMonthlyRecord);
}

export function paroleSuccessRateMonthly(
  rawRecords: RawMetricData
): SupervisionSuccessRateMonthlyRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionSuccessRateMonthlyRecord);
}

function createSupervisionSuccessRateDemographicRecord(
  record: ValuesType<RawMetricData>
) {
  return {
    rate: Number(record.success_rate),
    rateDenominator: Number(record.projected_completion_count),
    rateNumerator: Number(record.successful_termination_count),
    locality: record.district,
    ...extractDemographicFields(record),
  };
}

export function probationSuccessRateDemographics(
  rawRecords: RawMetricData
): SupervisionSuccessRateDemographicsRecord[] {
  return rawRecords
    .filter(recordIsProbation)
    .map(createSupervisionSuccessRateDemographicRecord);
}

export function paroleSuccessRateDemographics(
  rawRecords: RawMetricData
): SupervisionSuccessRateDemographicsRecord[] {
  return rawRecords
    .filter(recordIsParole)
    .map(createSupervisionSuccessRateDemographicRecord);
}

function getCategoryTransposeFunction(
  fields: { fieldName: string; categoryLabel: string }[]
) {
  return (records: RawMetricData) => {
    // these come in as wide records that we need to transpose to long
    const recordsByCategory = records.map((record) => {
      return fields.map(({ fieldName, categoryLabel }) => {
        return {
          category: categoryLabel,
          count: Number(record[fieldName]),
          ...extractDemographicFields(record),
        };
      });
    });

    return recordsByCategory.flat();
  };
}

const revocationReasonFields = [
  { categoryLabel: "abscond", fieldName: "absconsion_count" },
  { categoryLabel: "offend", fieldName: "new_crime_count" },
  { categoryLabel: "technical", fieldName: "technical_count" },
  { categoryLabel: "unknown", fieldName: "unknown_count" },
];

export function probationRevocationReasons(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(revocationReasonFields)(
    rawRecords.filter(recordIsProbation)
  );
}

export function paroleRevocationReasons(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(revocationReasonFields)(
    rawRecords.filter(recordIsParole)
  );
}

const prisonAdmissionFields = [
  { categoryLabel: "newAdmission", fieldName: "new_admission_count" },
  { categoryLabel: "paroleRevoked", fieldName: "parole_revocation_count" },
  {
    categoryLabel: "probationRevoked",
    fieldName: "probation_revocation_count",
  },
  { categoryLabel: "other", fieldName: "other_count" },
];

export function prisonAdmissionReasons(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(prisonAdmissionFields)(rawRecords);
}

const prisonReleaseFields = [
  { categoryLabel: "transfer", fieldName: "external_transfer_count" },
  { categoryLabel: "completion", fieldName: "sentence_completion_count" },
  { categoryLabel: "parole", fieldName: "parole_count" },
  { categoryLabel: "probation", fieldName: "probation_count" },
  { categoryLabel: "death", fieldName: "death_count" },
];

export function prisonReleaseTypes(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(prisonReleaseFields)(rawRecords);
}

export function recidivismRateAllFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return rawRecords.map((record) => {
    return {
      followupYears: Number(record.followup_years),
      rateNumerator: Number(record.recidivated_releases),
      rate: Number(record.recidivism_rate),
      rateDenominator: Number(record.releases),
      releaseCohort: Number(record.release_cohort),
      ...extractDemographicFields(record),
    };
  });
}

export function recidivismRateConventionalFollowup(
  rawRecords: RawMetricData
): RecidivismRateRecord[] {
  return recidivismRateAllFollowup(rawRecords).filter(({ followupYears }) =>
    [1, 3, 5].includes(followupYears)
  );
}

const prisonStayLengthFields = [
  { categoryLabel: "lessThanOne", fieldName: "years_0_1" },
  { categoryLabel: "oneTwo", fieldName: "years_1_2" },
  { categoryLabel: "twoThree", fieldName: "years_2_3" },
  { categoryLabel: "threeFive", fieldName: "years_3_5" },
  { categoryLabel: "fiveTen", fieldName: "years_5_10" },
  { categoryLabel: "tenTwenty", fieldName: "years_10_20" },
  { categoryLabel: "moreThanTwenty", fieldName: "years_20_plus" },
];

export function prisonStayLengths(
  rawRecords: RawMetricData
): DemographicsByCategoryRecord[] {
  return getCategoryTransposeFunction(prisonStayLengthFields)(rawRecords);
}
