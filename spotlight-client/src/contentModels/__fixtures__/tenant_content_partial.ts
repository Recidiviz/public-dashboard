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

import { TenantContent } from "../../contentApi/types";

const content: TenantContent = {
  name: "Test Tenant",
  landingPageTitle: "test landing page title",
  description: "test tenant description",
  coBrandingCopy: "test tenant co-branding",
  feedbackUrl: "https://example.com/feedback",
  smallDataDisclaimer: "test small data disclaimer",
  // this is an intentionally non-exhaustive set of metrics
  metrics: {
    SentencePopulationCurrent: {
      name: "test SentencePopulationCurrent name",
      methodology: "test sentence population current methodology",
      totalLabel: "test sentence population label",
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
    ParolePopulationCurrent: {
      name: "test ParolePopulationCurrent name",
      methodology: "test ParolePopulationCurrent methodology",
      totalLabel: "test parole population label",
    },
    ParoleRevocationsAggregate: {
      name: "test ParoleRevocationsAggregate name",
      methodology: "test ParoleRevocationsAggregate methodology",
    },
  },
  // this is an intentionally non-exhaustive set of narratives
  systemNarratives: {
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
  },
  localities: {
    Sentencing: {
      label: "sentencing locality",
      entries: [
        {
          id: "sentencing a",
          label: "sentencing A",
        },
        {
          id: "sentencing b",
          label: "sentencing B",
        },
      ],
    },
    Prison: {
      label: "prison locality",
      entries: [
        {
          id: "prison a",
          label: "prison A",
        },
        {
          id: "prison b",
          label: "prison B",
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
