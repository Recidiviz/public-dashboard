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

import { when } from "mobx";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import ProgramParticipationCurrentMetric from "./ProgramParticipationCurrentMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetricId = "ParoleProgrammingCurrent";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    topologyMapping: contentFixture.topologies,
    tenantId: testTenantId,
  }).get(testMetricId) as ProgramParticipationCurrentMetric;
}

async function getPopulatedMetric() {
  const metric = getTestMetric();

  metric.populateAllRecords();

  await when(() => !metric.isLoading && metric.error === undefined);

  return metric;
}

test("data mapping", async () => {
  const metric = await getPopulatedMetric();

  reactImmediately(() => {
    expect(metric.dataMapping).toMatchSnapshot();
  });

  expect.hasAssertions();
});
