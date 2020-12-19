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
import Metric from "./Metric";
import SystemNarrative from "./SystemNarrative";

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

export type AnyMetric = Metric<AnyRecord>;
export function isAnyMetric(metric: unknown): metric is AnyMetric {
  return metric instanceof Metric;
}

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

// =======================================
// Narrative types
// =======================================
export type SystemNarrativeMapping = {
  [key in SystemNarrativeTypeId]?: SystemNarrative;
};
