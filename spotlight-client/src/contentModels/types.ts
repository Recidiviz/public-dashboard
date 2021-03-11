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

import {
  CollectionTypeId,
  MetricTypeId,
  SystemNarrativeTypeId,
} from "../contentApi/types";
import {
  DemographicsByCategoryRecord,
  HistoricalPopulationBreakdownRecord,
  PopulationBreakdownByLocationRecord,
  ProgramParticipationCurrentRecord,
  RecidivismRateRecord,
  SentenceTypeByLocationRecord,
  SupervisionSuccessRateMonthlyRecord,
} from "../metricsApi";
import type Collection from "./Collection";
import type SystemNarrative from "./SystemNarrative";
import type Metric from "./Metric";
import type RacialDisparitiesNarrative from "./RacialDisparitiesNarrative";

// =======================================
// Collection types
// =======================================

export type CollectionMap = Map<CollectionTypeId, Collection | undefined>;

// =======================================
// Metric types
// =======================================

export type MetricRecord =
  | DemographicsByCategoryRecord
  | HistoricalPopulationBreakdownRecord
  | PopulationBreakdownByLocationRecord
  | ProgramParticipationCurrentRecord
  | RecidivismRateRecord
  | SentenceTypeByLocationRecord
  | SupervisionSuccessRateMonthlyRecord;

export type MetricMapping = Map<MetricTypeId, Metric<MetricRecord>>;

export type DemographicCategoryRecords = {
  label: string;
  records: {
    label: string;
    color: string;
    value: number;
    pct: number;
  }[];
};

export type DemographicCategoryRateRecords = DemographicCategoryRecords & {
  records: { denominator: number }[];
};

export type LocalityDataMapping = Record<
  string,
  { value: number; label: string }
>;

// =======================================
// Narrative types
// =======================================
export type SystemNarrativeMapping = {
  [key in SystemNarrativeTypeId]?: SystemNarrative;
};

export type Narrative = SystemNarrative | RacialDisparitiesNarrative;
