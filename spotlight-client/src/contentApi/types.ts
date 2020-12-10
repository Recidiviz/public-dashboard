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

// ============================
// Tenant types

// union additional tenants into this when they come online
export type TenantId = "US_ND";

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

export type CollectionContent = NamedEntity;

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

export type MetricContent = NamedEntity & { methodology: string };

type PopulationCurrentContent = MetricContent & { mapCaption: string };
