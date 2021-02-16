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

const content: DeepRequired<TenantContent> = {
  name: "Test Tenant",
  description: "test tenant description",
  collections: {
    Sentencing: {
      name: "Sentencing",
      description: "test sentencing description",
    },
    Prison: {
      name: "Prison",
      description: "test prison description",
    },
    Probation: {
      name: "Probation",
      description: "test probation description",
    },
    Parole: {
      name: "Parole",
      description: "test parole description",
    },
  },
  metrics: {
    SentencePopulationCurrent: {
      name: "test SentencePopulationCurrent name",
      description: "test sentence population current description",
      methodology: "test sentence population current methodology",
      totalLabel: "test sentence population label",
    },
    SentenceTypesCurrent: {
      name: "test SentenceTypesCurrent name",
      description: "test SentenceTypesCurrent description",
      methodology: "test SentenceTypesCurrent methodology",
    },
    PrisonPopulationCurrent: {
      name: "test PrisonPopulationCurrent name",
      description: "test PrisonPopulationCurrent description",
      methodology: "test PrisonPopulationCurrent methodology",
      totalLabel: "test prison population label",
    },
    PrisonPopulationHistorical: {
      name: "test PrisonPopulationHistorical name",
      description: "test PrisonPopulationHistorical description",
      methodology: "test PrisonPopulationHistorical methodology",
    },
    PrisonAdmissionReasonsCurrent: {
      name: "test PrisonAdmissionReasonsCurrent name",
      description: "test PrisonAdmissionReasonsCurrent description",
      methodology: "test PrisonAdmissionReasonsCurrent methodology",
    },
    PrisonStayLengthAggregate: {
      name: "test PrisonStayLengthAggregate name",
      description: "test PrisonStayLengthAggregate description",
      methodology: "test PrisonStayLengthAggregate methodology",
    },
    PrisonReleaseTypeAggregate: {
      name: "test PrisonReleaseTypeAggregate name",
      description: "test PrisonReleaseTypeAggregate description",
      methodology: "test PrisonReleaseTypeAggregate methodology",
    },
    PrisonRecidivismRateHistorical: {
      name: "test PrisonRecidivismRateHistorical name",
      description: "test PrisonRecidivismRateHistorical description",
      methodology: "test PrisonRecidivismRateHistorical methodology",
    },
    PrisonRecidivismRateSingleFollowupHistorical: {
      name: "test PrisonRecidivismRateSingleFollowupHistorical name",
      description:
        "test PrisonRecidivismRateSingleFollowupHistorical description",
      methodology:
        "test PrisonRecidivismRateSingleFollowupHistorical methodology",
    },
    ProbationPopulationCurrent: {
      name: "test ProbationPopulationCurrent name",
      description: "test ProbationPopulationCurrent description",
      methodology: "test ProbationPopulationCurrent methodology",
      totalLabel: "test probation population label",
    },
    ProbationPopulationHistorical: {
      name: "test ProbationPopulationHistorical name",
      description: "test ProbationPopulationHistorical description",
      methodology: "test ProbationPopulationHistorical methodology",
    },
    ProbationSuccessHistorical: {
      name: "test ProbationSuccessHistorical name",
      description: "test ProbationSuccessHistorical description",
      methodology: "test ProbationSuccessHistorical methodology",
    },
    ProbationRevocationsAggregate: {
      name: "test ProbationRevocationsAggregate name",
      description: "test ProbationRevocationsAggregate description",
      methodology: "test ProbationRevocationsAggregate methodology",
    },
    ProbationProgrammingCurrent: {
      name: "test ProbationProgrammingCurrent name",
      description: "test ProbationProgrammingCurrent description",
      methodology: "test ProbationProgrammingCurrent methodology",
    },
    ParolePopulationCurrent: {
      name: "test ParolePopulationCurrent name",
      description: "test ParolePopulationCurrent description",
      methodology: "test ParolePopulationCurrent methodology",
      totalLabel: "test parole population label",
    },
    ParolePopulationHistorical: {
      name: "test ParolePopulationHistorical name",
      description: "test ParolePopulationHistorical description",
      methodology: "test ParolePopulationHistorical methodology",
    },
    ParoleSuccessHistorical: {
      name: "test ParoleSuccessHistorical name",
      description: "test ParoleSuccessHistorical description",
      methodology: "test ParoleSuccessHistorical methodology",
    },
    ParoleRevocationsAggregate: {
      name: "test ParoleRevocationsAggregate name",
      description: "test ParoleRevocationsAggregate description",
      methodology: "test ParoleRevocationsAggregate methodology",
    },
    ParoleProgrammingCurrent: {
      name: "test ParoleProgrammingCurrent name",
      description: "test ParoleProgrammingCurrent description",
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
          id: "probation a",
          label: "probation A",
        },
        {
          id: "probation b",
          label: "probation B",
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
  },
};

export default content;
