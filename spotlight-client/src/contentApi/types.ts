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

export type NamedEntity = {
  name: string;
  description: string;
};

export type LocalityLabels = {
  label: string;
  entries: { id: string; label: string }[];
};

// ============================
// Tenant types

export const TenantIdList = ["US_ND"] as const;
export type TenantId = typeof TenantIdList[number];
export function isTenantId(x: string): x is TenantId {
  return TenantIdList.includes(x as TenantId);
}

export type TenantContent = NamedEntity & {
  collections: {
    [key in CollectionTypeId]?: CollectionContent;
  };
  metrics: {
    [key in MetricTypeId]?: MetricContent;
  } & {
    SentencePopulationCurrent?: PopulationCurrentContent;
    PrisonPopulationCurrent?: PopulationCurrentContent;
    ProbationPopulationCurrent?: PopulationCurrentContent;
    ParolePopulationCurrent?: PopulationCurrentContent;
  };
  systemNarratives: {
    [key in SystemNarrativeTypeId]?: SystemNarrativeContent;
  };
  // this is optional because it is possible (though unlikely)
  // to not have any metrics that actually need it
  localities?: {
    [key in SystemNarrativeTypeId]?: LocalityLabels;
  };
};

// ============================
// Collection types

export const CollectionTypeIdList = [
  "Sentencing",
  "Prison",
  "Probation",
  "Parole",
] as const;
export type CollectionTypeId = typeof CollectionTypeIdList[number];
export function isCollectionTypeId(x: string): x is CollectionTypeId {
  return CollectionTypeIdList.includes(x as CollectionTypeId);
}

type CollectionContent = NamedEntity;

// ============================
// Metric types

export const MetricTypeIdList = [
  "SentencePopulationCurrent",
  "SentenceTypesCurrent",
  "PrisonPopulationCurrent",
  "PrisonPopulationHistorical",
  "PrisonAdmissionReasonsCurrent",
  "PrisonStayLengthAggregate",
  "PrisonReleaseTypeAggregate",
  "PrisonRecidivismRateHistorical",
  "PrisonRecidivismRateSingleFollowupHistorical",
  "ProbationPopulationCurrent",
  "ProbationPopulationHistorical",
  "ProbationSuccessHistorical",
  "ProbationSuccessAggregate",
  "ProbationRevocationsAggregate",
  "ProbationProgrammingCurrent",
  "ParolePopulationCurrent",
  "ParolePopulationHistorical",
  "ParoleSuccessHistorical",
  "ParoleSuccessAggregate",
  "ParoleRevocationsAggregate",
  "ParoleProgrammingCurrent",
] as const;
export type MetricTypeId = typeof MetricTypeIdList[number];
export function isMetricTypeId(x: string): x is MetricTypeId {
  return MetricTypeIdList.includes(x as MetricTypeId);
}

type MetricContent = NamedEntity & { methodology: string };

type PopulationCurrentContent = MetricContent & { mapCaption: string };

// ============================
// Narrative types
export const SystemNarrativeTypeIdList = [
  "Sentencing",
  "Prison",
  "Probation",
  "Parole",
] as const;
export type SystemNarrativeTypeId = typeof SystemNarrativeTypeIdList[number];
export function isSystemNarrativeTypeId(x: string): x is SystemNarrativeTypeId {
  return SystemNarrativeTypeIdList.includes(x as SystemNarrativeTypeId);
}

type SystemNarrativeSection = {
  title: string;
  body: string;
  metricTypeId: MetricTypeId;
};

export type SystemNarrativeContent = {
  title: string;
  introduction: string;
  sections: SystemNarrativeSection[];
};
