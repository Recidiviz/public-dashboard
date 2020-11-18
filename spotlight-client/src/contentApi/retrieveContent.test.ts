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

import retrieveContent from "./retrieveContent";
import { CollectionTypeId, MetricTypeId } from "./types";

test("returns content for the specified tenant", () => {
  const tenantContent = retrieveContent({ tenantId: "US_ND" });
  expect(tenantContent.name).toBe("North Dakota");
});

test("tenant has expected collections", () => {
  const tenantContent = retrieveContent({ tenantId: "US_ND" });
  ([
    "Sentencing",
    "Prison",
    "Probation",
    "Parole",
  ] as CollectionTypeId[]).forEach((collectionId) =>
    expect(tenantContent.collections[collectionId]).toBeDefined()
  );
});

test("tenant has expected metrics", () => {
  const tenantContent = retrieveContent({ tenantId: "US_ND" });
  ([
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
    "ProbationRevocationsAggregate",
    "ProbationProgrammingCurrent",
    "ParolePopulationCurrent",
    "ParolePopulationHistorical",
    "ParoleSuccessHistorical",
    "ParoleRevocationsAggregate",
    "ParoleProgrammingCurrent",
  ] as MetricTypeId[]).forEach((metricId) =>
    expect(tenantContent.metrics[metricId]).toBeDefined()
  );
});
