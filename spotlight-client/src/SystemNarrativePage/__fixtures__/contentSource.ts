// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
  docName: "Test Tenant Department of Corrections",
  docLink: "https://example.com/feedback",
  description: "test tenant description",
  coBrandingCopy: "test tenant co-branding",
  feedbackUrl: "https://example.com/feedback",
  smallDataDisclaimer: "test small data disclaimer",
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
    ParolePopulationCurrent: {
      name: "test ParolePopulationCurrent name",
      methodology: "test ParolePopulationCurrent methodology",
      totalLabel: "test parole population label",
    },
    ParolePopulationHistorical: {
      name: "test ParolePopulationHistorical name",
      methodology: "test ParolePopulationHistorical methodology",
    },
  },
  systemNarratives: {
    Parole: {
      title: "test parole narrative",
      previewTitle: "test parole subtitle",
      preview: "ParolePopulationCurrent",
      introduction: "test parole introduction",
      sections: [
        {
          title: "test first parole section",
          body: "test parole section copy",
          metricTypeId: "ParolePopulationCurrent",
        },
        {
          title: "test second parole section",
          body: "test second parole section copy",
          metricTypeId: "ParolePopulationHistorical",
        },
      ],
    },
    Sentencing: {
      title: "test sentencing narrative",
      previewTitle: "test sentencing subtitle",
      preview: "SentencePopulationCurrent",
      introduction:
        'test sentencing introduction <a href="https://example.com">intro link</a>',
      sections: [
        {
          title: "test first sentencing section",
          body:
            'test sentencing section copy <a href="https://example.com">section copy link</a>',
          metricTypeId: "SentencePopulationCurrent",
        },
        {
          title: "test second sentencing section",
          body: "test second sentencing section copy",
          metricTypeId: "SentenceTypesCurrent",
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
