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

import { CollectionTypeId } from "../contentApi/types";
import type Collection from "./Collection";
import type Metric from "./Metric";

// =======================================
// Collection types
// =======================================

export type CollectionMap = Map<CollectionTypeId, Collection | undefined>;

// =======================================
// Metric types
// =======================================

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

type DemographicFields = {
  raceOrEthnicity: RaceIdentifier;
  gender: GenderIdentifier;
  ageBucket: AgeIdentifier;
};

type LocalityFields = {
  locality: string;
};

type RateFields = {
  rateDenominator: number;
  rateNumerator: number;
  rate: number;
};

export type PopulationBreakdownByLocationRecord = DemographicFields &
  LocalityFields & {
    population: number;
  };

export type SentenceTypeByLocationRecord = DemographicFields &
  LocalityFields & {
    dualSentenceCount: number;
    incarcerationCount: number;
    probationCount: number;
  };

export type HistoricalPopulationBreakdownRecord = DemographicFields & {
  date: string;
  count: number;
};

export type ProgramParticipationCurrentRecord = LocalityFields & {
  count: number;
};

export type SupervisionSuccessRateDemographicsRecord = DemographicFields &
  LocalityFields &
  RateFields;

export type SupervisionSuccessRateMonthlyRecord = LocalityFields &
  RateFields & {
    month: number;
    year: number;
  };

export type DemographicsByCategoryRecord = DemographicFields & {
  category: string;
  count: number;
};

export type RecidivismRateRecord = DemographicFields &
  RateFields & {
    releaseCohort: number;
    followupYears: number;
  };

export type AnyRecord =
  | DemographicsByCategoryRecord
  | HistoricalPopulationBreakdownRecord
  | PopulationBreakdownByLocationRecord
  | ProgramParticipationCurrentRecord
  | RecidivismRateRecord
  | SentenceTypeByLocationRecord
  | SupervisionSuccessRateMonthlyRecord
  | SupervisionSuccessRateDemographicsRecord;

export type AnyMetric = Metric<AnyRecord>;

export type MetricMapping = {
  SentencePopulationCurrent?: Metric<PopulationBreakdownByLocationRecord>;
  SentenceTypesCurrent?: Metric<SentenceTypeByLocationRecord>;
  PrisonPopulationCurrent?: Metric<PopulationBreakdownByLocationRecord>;
  PrisonPopulationHistorical?: Metric<HistoricalPopulationBreakdownRecord>;
  PrisonAdmissionReasonsCurrent?: Metric<DemographicsByCategoryRecord>;
  PrisonStayLengthAggregate?: Metric<DemographicsByCategoryRecord>;
  PrisonReleaseTypeAggregate?: Metric<DemographicsByCategoryRecord>;
  PrisonRecidivismRateHistorical?: Metric<RecidivismRateRecord>;
  PrisonRecidivismRateSingleFollowupHistorical?: Metric<RecidivismRateRecord>;
  ProbationPopulationCurrent?: Metric<PopulationBreakdownByLocationRecord>;
  ProbationPopulationHistorical?: Metric<HistoricalPopulationBreakdownRecord>;
  ProbationSuccessHistorical?: Metric<SupervisionSuccessRateMonthlyRecord>;
  ProbationSuccessAggregate?: Metric<SupervisionSuccessRateDemographicsRecord>;
  ProbationRevocationsAggregate?: Metric<DemographicsByCategoryRecord>;
  ProbationProgrammingCurrent?: Metric<ProgramParticipationCurrentRecord>;
  ParolePopulationCurrent?: Metric<PopulationBreakdownByLocationRecord>;
  ParolePopulationHistorical?: Metric<HistoricalPopulationBreakdownRecord>;
  ParoleSuccessHistorical?: Metric<SupervisionSuccessRateMonthlyRecord>;
  ParoleSuccessAggregate?: Metric<SupervisionSuccessRateDemographicsRecord>;
  ParoleRevocationsAggregate?: Metric<DemographicsByCategoryRecord>;
  ParoleProgrammingCurrent?: Metric<ProgramParticipationCurrentRecord>;
};
