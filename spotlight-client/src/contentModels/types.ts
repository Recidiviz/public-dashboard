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

import { CollectionTypeId, SystemNarrativeTypeId } from "../contentApi/types";
import {
  DemographicsByCategoryRecord,
  HistoricalPopulationBreakdownRecord,
  PopulationBreakdownByLocationRecord,
  ProgramParticipationCurrentRecord,
  RecidivismRateRecord,
  SentenceTypeByLocationRecord,
  SupervisionSuccessRateMonthlyRecord,
  SupervisionSuccessRateDemographicsRecord,
} from "../metricsApi";
import type Collection from "./Collection";
import SystemNarrative from "./SystemNarrative";
import DemographicsByCategoryMetric from "./DemographicsByCategoryMetric";
import HistoricalPopulationBreakdownMetric from "./HistoricalPopulationBreakdownMetric";
import PopulationBreakdownByLocationMetric from "./PopulationBreakdownByLocationMetric";
import ProgramParticipationCurrentMetric from "./ProgramParticipationCurrentMetric";
import RecidivismRateMetric from "./RecidivismRateMetric";
import SentenceTypeByLocationMetric from "./SentenceTypeByLocationMetric";
import SupervisionSuccessRateDemographicsMetric from "./SupervisionSuccessRateDemographicsMetric";
import SupervisionSuccessRateMonthlyMetric from "./SupervisionSuccessRateMonthlyMetric";

// =======================================
// Collection types
// =======================================

export type CollectionMap = Map<CollectionTypeId, Collection | undefined>;

// =======================================
// Metric types
// =======================================

export type AnyRecord =
  | DemographicsByCategoryRecord
  | HistoricalPopulationBreakdownRecord
  | PopulationBreakdownByLocationRecord
  | ProgramParticipationCurrentRecord
  | RecidivismRateRecord
  | SentenceTypeByLocationRecord
  | SupervisionSuccessRateMonthlyRecord
  | SupervisionSuccessRateDemographicsRecord;

// TODO: does this even serve a useful purpose anymore?
export type MetricMapping = {
  SentencePopulationCurrent?: PopulationBreakdownByLocationMetric;
  SentenceTypesCurrent?: SentenceTypeByLocationMetric;
  PrisonPopulationCurrent?: PopulationBreakdownByLocationMetric;
  PrisonPopulationHistorical?: HistoricalPopulationBreakdownMetric;
  PrisonAdmissionReasonsCurrent?: DemographicsByCategoryMetric;
  PrisonStayLengthAggregate?: DemographicsByCategoryMetric;
  PrisonReleaseTypeAggregate?: DemographicsByCategoryMetric;
  PrisonRecidivismRateHistorical?: RecidivismRateMetric;
  PrisonRecidivismRateSingleFollowupHistorical?: RecidivismRateMetric;
  ProbationPopulationCurrent?: PopulationBreakdownByLocationMetric;
  ProbationPopulationHistorical?: HistoricalPopulationBreakdownMetric;
  ProbationSuccessHistorical?: SupervisionSuccessRateMonthlyMetric;
  ProbationSuccessAggregate?: SupervisionSuccessRateDemographicsMetric;
  ProbationRevocationsAggregate?: DemographicsByCategoryMetric;
  ProbationProgrammingCurrent?: ProgramParticipationCurrentMetric;
  ParolePopulationCurrent?: PopulationBreakdownByLocationMetric;
  ParolePopulationHistorical?: HistoricalPopulationBreakdownMetric;
  ParoleSuccessHistorical?: SupervisionSuccessRateMonthlyMetric;
  ParoleSuccessAggregate?: SupervisionSuccessRateDemographicsMetric;
  ParoleRevocationsAggregate?: DemographicsByCategoryMetric;
  ParoleProgrammingCurrent?: ProgramParticipationCurrentMetric;
};

// =======================================
// Narrative types
// =======================================
export type SystemNarrativeMapping = {
  [key in SystemNarrativeTypeId]?: SystemNarrative;
};
