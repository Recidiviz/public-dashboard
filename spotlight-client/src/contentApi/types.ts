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

import type { Topology } from "topojson-specification";
import { SupervisionType } from "../contentModels/RacialDisparitiesNarrative";
import { AgeValue, GenderValue, RaceOrEthnicityValue } from "../demographics";
import { CategoryFieldMapping } from "../metricsApi";

export type LocalityLabels = {
  label: string;
  entries: { id: string; label: string }[];
};

// ============================
// Tenant types

export const TenantIdList = ["US_ND", "US_PA", "US_TN"] as const;
export type TenantId = typeof TenantIdList[number];
export function isTenantId(x: string): x is TenantId {
  return TenantIdList.includes(x as TenantId);
}
export type StateCodes = typeof TenantIdList | "RECIDIVIZ";

export type DemographicCategoryFilter = {
  raceOrEthnicity?: RaceOrEthnicityValue[];
  gender?: GenderValue[];
  ageBucket?: AgeValue[];
};

export type TenantContent = {
  name: string;
  docName: string;
  docLink: string;
  description: string;
  ctaCopy?: string;
  coBrandingCopy: string;
  feedbackUrl: string;
  smallDataDisclaimer: string;
  metrics: {
    [key in Extract<
      MetricTypeId,
      | "SentencePopulationCurrent"
      | "PrisonPopulationCurrent"
      | "ProbationPopulationCurrent"
      | "ParolePopulationCurrent"
      | "CommunityCorrectionsPopulationCurrent"
    >]?: MetricContent & { totalLabel: string };
  } &
    {
      [key in Extract<
        MetricTypeId,
        "PrisonAdmissionReasonsCurrent"
      >]?: MetricContent & { fieldMapping?: CategoryFieldMapping[] };
    } &
    { [key in MetricTypeId]?: MetricContent } &
    { [key in RidersMetricTypeId]?: MetricContent };
  systemNarratives: {
    [key in SystemNarrativeTypeId]?: SystemNarrativeContent;
  };
  // this is optional because it is possible (though unlikely)
  // to not have any metrics that actually need it
  localities?: {
    [key in
      | SystemNarrativeTypeId
      | "ProgramRegions"
      | "CommunityCorrections"]?: LocalityLabels;
  };
  topologies?: {
    ProgramRegions: MapData;
  };
  racialDisparitiesNarrative?: RacialDisparitiesNarrativeContent;
  ridersNarrative?: RidersNarrativeContent;
  // if categories are enumerated for any of the keys here, they will be the only ones used;
  // otherwise categories default to including all values in the associated unions
  demographicCategories?: DemographicCategoryFilter;
};

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
  "CommunityCorrectionsPopulationCurrent",
  "ProbationPopulationCurrent",
  "ProbationPopulationHistorical",
  "ProbationSuccessHistorical",
  "ProbationRevocationsAggregate",
  "ProbationProgrammingCurrent",
  "ProbationTerminationsHistorical",
  "ParolePopulationCurrent",
  "ParolePopulationHistorical",
  "ParoleSuccessHistorical",
  "ParoleTerminationsHistorical",
  "ParoleRevocationsAggregate",
  "ParoleProgrammingCurrent",
] as const;
export const RidersMetricTypeIdList = [
  "RidersPopulationHistorical",
  "RidersPopulationCurrent",
  "RidersOriginalCharge",
  "RidersReincarcerationRate",
] as const;
export type MetricTypeId = typeof MetricTypeIdList[number];
export type RidersMetricTypeId = typeof RidersMetricTypeIdList[number];

export type AllMetricsTypeId = MetricTypeId | RidersMetricTypeId;
export function isMetricTypeId(x: string): x is AllMetricsTypeId {
  return [...MetricTypeIdList, ...RidersMetricTypeIdList].includes(
    x as AllMetricsTypeId
  );
}

type MetricContent = { name: string; methodology: string };

export type MapData = {
  aspectRatio: number;
  topology: Topology;
};

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

export type NarrativeTypeId =
  | SystemNarrativeTypeId
  | "RacialDisparities"
  | "Riders";
export function isNarrativeTypeId(x: string): x is NarrativeTypeId {
  return (
    isSystemNarrativeTypeId(x) || x === "RacialDisparities" || x === "Riders"
  );
}

type NarrativeSection = {
  title: string;
  body: string;
};

type SystemNarrativeSection = NarrativeSection & {
  metricTypeId: MetricTypeId;
};

type NarrativeContent = {
  title: string;
  introduction: string;
};

export type SystemNarrativeContent = NarrativeContent & {
  previewTitle?: string;
  preview?: MetricTypeId;
  sections: SystemNarrativeSection[];
};

type RidersNarrativeSection = NarrativeSection & {
  metricTypeId?: RidersMetricTypeId;
  type?: "text" | "metric";
};

export type RidersNarrativeContent = NarrativeContent & {
  sections: RidersNarrativeSection[];
};

export type RacialDisparitiesChartLabels = {
  totalPopulation: string;
  totalSentenced: string;
  paroleGrant: string;
  incarceratedPopulation: string;
  otherGroups: string;
  programmingParticipants: string;
  supervisionPopulation: string;
  totalPopulationSentences: string;
  revocationProportions: string;
};

type RacialDisparitiesSectionKey =
  | "beforeCorrections"
  | "sentencing"
  | "releasesToParole"
  | "programming"
  | "supervision"
  | "conclusion";

export type RacialDisparitiesSection = NarrativeSection & {
  methodology: string;
};

export type RacialDisparitiesSections = {
  [key in RacialDisparitiesSectionKey]?: RacialDisparitiesSection;
};

/**
 * Introduction and section bodies support dynamic text
 * via {@link https://github.com/sindresorhus/pupa Pupa} template syntax
 */
export type RacialDisparitiesNarrativeContent = {
  chartLabels: RacialDisparitiesChartLabels;
  introduction: string;
  introductionMethodology: string;
  sections: RacialDisparitiesSections;
  supervisionTypes?: SupervisionType[];
};
