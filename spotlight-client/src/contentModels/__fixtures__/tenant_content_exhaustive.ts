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

import { DeepRequired } from "utility-types";
import { TenantContent } from "../../contentApi/types";
import programRegionsTopology from "../../contentApi/sources/usNdProgramRegions";

// some parts of this object are too complex to be deep-required,
// but for most of it that's desirable
type DeepRequiredTenantContent = DeepRequired<
  Omit<TenantContent, "topologies">
>;

// any properties excluded from deep requirement are required shallowly
type ExhaustiveTenantContent = Required<TenantContent> &
  DeepRequiredTenantContent;

const content: ExhaustiveTenantContent = {
  name: "Test Tenant",
  description: "test tenant description",
  coBrandingCopy: "test tenant co-branding",
  feedbackUrl: "https://example.com/feedback",
  // tests are based on ND data which has this demo profile
  demographicCategories: {
    raceOrEthnicity: [
      "AMERICAN_INDIAN_ALASKAN_NATIVE",
      "BLACK",
      "HISPANIC",
      "WHITE",
      "OTHER",
    ],
    gender: ["MALE", "FEMALE"],
    ageBucket: ["<25", "25-29", "30-34", "35-39", "40<"],
  },
  metrics: {
    SentencePopulationCurrent: {
      name: "test SentencePopulationCurrent name",
      methodology: "test sentence population current methodology",
      totalLabel: "test sentence population label",
    },
    SentenceTypesCurrent: {
      name: "test SentenceTypesCurrent name",
      methodology: "test SentenceTypesCurrent methodology",
    },
    PrisonPopulationCurrent: {
      name: "test PrisonPopulationCurrent name",
      methodology: "test PrisonPopulationCurrent methodology",
      totalLabel: "test prison population label",
    },
    PrisonPopulationHistorical: {
      name: "test PrisonPopulationHistorical name",
      methodology: "test PrisonPopulationHistorical methodology",
    },
    PrisonAdmissionReasonsCurrent: {
      name: "test PrisonAdmissionReasonsCurrent name",
      methodology: "test PrisonAdmissionReasonsCurrent methodology",
    },
    PrisonStayLengthAggregate: {
      name: "test PrisonStayLengthAggregate name",
      methodology: "test PrisonStayLengthAggregate methodology",
    },
    PrisonReleaseTypeAggregate: {
      name: "test PrisonReleaseTypeAggregate name",
      methodology: "test PrisonReleaseTypeAggregate methodology",
    },
    PrisonRecidivismRateHistorical: {
      name: "test PrisonRecidivismRateHistorical name",
      methodology: "test PrisonRecidivismRateHistorical methodology",
    },
    PrisonRecidivismRateSingleFollowupHistorical: {
      name: "test PrisonRecidivismRateSingleFollowupHistorical name",
      methodology:
        "test PrisonRecidivismRateSingleFollowupHistorical methodology",
    },
    ProbationPopulationCurrent: {
      name: "test ProbationPopulationCurrent name",
      methodology: "test ProbationPopulationCurrent methodology",
      totalLabel: "test probation population label",
    },
    ProbationPopulationHistorical: {
      name: "test ProbationPopulationHistorical name",
      methodology: "test ProbationPopulationHistorical methodology",
    },
    ProbationSuccessHistorical: {
      name: "test ProbationSuccessHistorical name",
      methodology: "test ProbationSuccessHistorical methodology",
    },
    ProbationRevocationsAggregate: {
      name: "test ProbationRevocationsAggregate name",
      methodology: "test ProbationRevocationsAggregate methodology",
    },
    ProbationProgrammingCurrent: {
      name: "test ProbationProgrammingCurrent name",
      methodology: "test ProbationProgrammingCurrent methodology",
    },
    ParolePopulationCurrent: {
      name: "test ParolePopulationCurrent name",
      methodology: "test ParolePopulationCurrent methodology",
      totalLabel: "test parole population label",
    },
    ParolePopulationHistorical: {
      name: "test ParolePopulationHistorical name",
      methodology: "test ParolePopulationHistorical methodology",
    },
    ParoleSuccessHistorical: {
      name: "test ParoleSuccessHistorical name",
      methodology: "test ParoleSuccessHistorical methodology",
    },
    ParoleRevocationsAggregate: {
      name: "test ParoleRevocationsAggregate name",
      methodology: "test ParoleRevocationsAggregate methodology",
    },
    ParoleProgrammingCurrent: {
      name: "test ParoleProgrammingCurrent name",
      methodology: "test ParoleProgrammingCurrent methodology",
    },
  },
  systemNarratives: {
    Prison: {
      title: "test prison narrative",
      introduction: "test prison introduction",
      sections: [
        {
          title: "test first prison section",
          body: "test prison section copy",
          metricTypeId: "PrisonPopulationCurrent",
        },
      ],
    },
    Probation: {
      title: "test probation narrative",
      introduction: "test probation introduction",
      sections: [
        {
          title: "test first probation section",
          body: "test probation section copy",
          metricTypeId: "ProbationPopulationCurrent",
        },
      ],
    },
    Parole: {
      title: "test parole narrative",
      introduction: "test parole introduction",
      sections: [
        {
          title: "test first parole section",
          body: "test parole section copy",
          metricTypeId: "ParolePopulationCurrent",
        },
      ],
    },
    Sentencing: {
      title: "test sentencing narrative",
      introduction: "test sentencing introduction",
      sections: [
        {
          title: "test first sentencing section",
          body: "test sentencing section copy",
          metricTypeId: "SentencePopulationCurrent",
        },
      ],
    },
  },
  localities: {
    Sentencing: {
      label: "sentencing locality",
      entries: [
        {
          id: "NORTHEAST",
          label: "Northeast",
        },
        {
          id: "SOUTHWEST",
          label: "Southwest",
        },
      ],
    },
    Prison: {
      label: "prison locality",
      entries: [
        {
          id: "DWCRC",
          label: "Dakota Women's Correctional",
        },
        {
          id: "NDSP",
          label: "North Dakota State Penitentiary",
        },
      ],
    },
    Probation: {
      label: "probation locality",
      entries: [
        {
          id: "NORTHEAST",
          label: "Northeast",
        },
        {
          id: "SOUTHWEST",
          label: "Southwest",
        },
      ],
    },
    Parole: {
      label: "parole locality",
      entries: [
        {
          id: "parole a",
          label: "parole A",
        },
        {
          id: "parole b",
          label: "parole B",
        },
      ],
    },
    ProgramRegions: {
      label: "program region",
      entries: [
        {
          id: "1",
          label: "Region A",
        },
        {
          id: "2",
          label: "Region B",
        },
        {
          id: "3",
          label: "Region C",
        },
        {
          id: "4",
          label: "Region D",
        },
        {
          id: "5",
          label: "Region E",
        },
        {
          id: "6",
          label: "Region F",
        },
        {
          id: "7",
          label: "Region G",
        },
        {
          id: "8",
          label: "Region H",
        },
      ],
    },
  },
  topologies: {
    ProgramRegions: {
      aspectRatio: 1.5,
      // these objects are too complex to be worth mocking
      topology: programRegionsTopology,
    },
  },
  racialDisparitiesNarrative: {
    chartLabels: {
      totalPopulation: "Proportions of races in the state",
      totalSentenced: "Proportions of races sentenced and under DOCR control",
      paroleGrant: "People released on parole",
      incarceratedPopulation: "Overall prison population",
      otherGroups: "All other racial/ethnic groups",
      programmingParticipants: "Active program participants",
      supervisionPopulation: "People subject to supervision",
      totalPopulationSentences: "All people sentenced and under DOCR control",
    },
    introduction: `introduction {likelihoodVsWhite.BLACK} {likelihoodVsWhite.HISPANIC}
        {likelihoodVsWhite.AMERICAN_INDIAN_ALASKAN_NATIVE}`,
    introductionMethodology: "introduction methodology",
    supervisionTypes: ["supervision", "parole", "probation"],
    sections: {
      beforeCorrections: {
        title: "beforeCorrections title",
        body: `beforeCorrections body {ethnonymCapitalized} {beforeCorrections.populationPctCurrent}
        {beforeCorrections.correctionsPctCurrent}`,
        methodology: "beforeCorrections methodology",
      },
      conclusion: {
        title: "conclusion title",
        body: "conclusion body",
        methodology: "conclusion methodology",
      },
      sentencing: {
        title: "sentencing title",
        body: `sentencing body {ethnonym} {sentencing.incarcerationPctCurrent}
        {sentencing.probationPctCurrent} {sentencing.overall.incarcerationPctCurrent}
        {sentencing.overall.probationPctCurrent} {sentencing.comparison}`,
        methodology: "sentencing methodology",
      },
      supervision: {
        title: "supervision title",
        body: `supervision body {supervisionType} {supervision.absconsionProportion36Mo}
        {supervision.newCrimeProportion36Mo} {supervision.technicalProportion36Mo}
        {supervision.populationProportion36Mo} {supervision.revocationProportion36Mo}
        {supervision.overall.absconsionProportion36Mo} {supervision.overall.newCrimeProportion36Mo}
        {supervision.overall.technicalProportion36Mo}`,
        methodology: "supervision methodology",
      },
      releasesToParole: {
        title: "releasesToParole title",
        body: `releasesToParole body {releasesToParole.paroleReleaseProportion36Mo}
        {releasesToParole.prisonPopulationProportion36Mo}`,
        methodology: "releasesToParole methodology",
      },
      programming: {
        title: "programming title",
        body: `programming body {programming.participantProportionCurrent}
        {programming.supervisionProportionCurrent} {programming.comparison}`,
        methodology: "programming methodology",
      },
    },
  },
};

export default content;
