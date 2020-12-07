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

type TotalIdentifier = "ALL";

export type RaceIdentifier =
  | TotalIdentifier
  | "AMERICAN_INDIAN_ALASKAN_NATIVE"
  | "ASIAN"
  | "BLACK"
  | "HISPANIC"
  | "NATIVE_HAWAIIAN_PACIFIC_ISLANDER"
  | "WHITE"
  | "OTHER";
export type GenderIdentifier = TotalIdentifier | "FEMALE" | "MALE";
export type AgeIdentifier =
  | TotalIdentifier
  | "<25"
  | "25-29"
  | "30-34"
  | "35-39"
  | "40<";

export type BaseMetricFields = {
  tenantId: string;
};

export type DemographicFields = {
  raceOrEthnicity: RaceIdentifier;
  gender: GenderIdentifier;
  ageBucket: AgeIdentifier;
};

export type LocalityFields = {
  locality: string;
};

export type PopulationBreakdownByLocationRecord = BaseMetricFields &
  DemographicFields &
  LocalityFields & {
    population: number;
  };

export type SentenceTypeByLocationRecord = BaseMetricFields &
  DemographicFields &
  LocalityFields & {
    dualSentenceCount: number;
    incarcerationCount: number;
    probationCount: number;
  };

export type HistoricalPopulationBreakdownRecord = BaseMetricFields &
  DemographicFields & {
    date: string;
    count: number;
  };

export type ProgramParticipationCurrentRecord = BaseMetricFields &
  LocalityFields & {
    count: number;
  };

// TODO: the racial breakdowns for this one? they are kind of a separate metric
export type SupervisionSuccessRateMonthlyRecord = BaseMetricFields &
  LocalityFields & {
    // TODO: do we want month and year as separate fields? do we want them as numbers?
    actualCount: number;
    month: number;
    projectedCount: number;
    successRate: number;
    year: number;
  };

export type DemographicsByCategoryRecord = BaseMetricFields &
  DemographicFields & {
    category: string;
    count: number;
  };

// TODO: should "rate" types share common fields?
export type RecidivismRateRecord = BaseMetricFields &
  DemographicFields & {
    releaseCohort: number;
    followupYears: number;
    releaseCount: number;
    recidivatedCount: number;
    recidivismRate: number;
  };
