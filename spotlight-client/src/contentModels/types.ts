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

import { MetricTypeId, SystemNarrativeTypeId } from "../contentApi/types";
import {
  DemographicFieldKey,
  DemographicsByCategoryRecord,
  HistoricalPopulationBreakdownRecord,
  PopulationBreakdownByLocationRecord,
  ProgramParticipationCurrentRecord,
  RecidivismRateRecord,
  SentenceTypeByLocationRecord,
  SupervisionSuccessRateMonthlyRecord,
} from "../metricsApi";
import type SystemNarrative from "./SystemNarrative";
import RacialDisparitiesNarrative from "./RacialDisparitiesNarrative";
import type Metric from "./Metric";

/**
 * Describes the hydration state and mechanism,
 * but not what the hydrated object will look like
 * (because it may vary by model)
 */
export interface Hydratable {
  isLoading?: boolean;
  error?: Error;
  hydrate: () => void;
}

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

export type UnknownCounts = { [key in DemographicFieldKey]: number };
export type UnknownByDate = { date: Date; unknowns: UnknownCounts };
export type UnknownByCohort = { cohort: number; unknowns: UnknownCounts };
export type UnknownsByDate = UnknownByDate[];
export type UnknownsByCohort = UnknownByCohort[];

export type Unknowns = UnknownCounts | UnknownsByDate | UnknownsByCohort;

// =======================================
// Narrative types
// =======================================
export type SystemNarrativeMapping = {
  [key in SystemNarrativeTypeId]?: SystemNarrative;
};

export type Narrative = SystemNarrative | RacialDisparitiesNarrative;
