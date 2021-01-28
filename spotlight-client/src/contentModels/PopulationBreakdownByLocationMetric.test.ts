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

import { runInAction, when } from "mobx";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import PopulationBreakdownByLocationMetric from "./PopulationBreakdownByLocationMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetricId = "PrisonPopulationCurrent";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as PopulationBreakdownByLocationMetric;
}

test("locality filter", async () => {
  const metric = getTestMetric();

  metric.populateAllRecords();

  await when(() => metric.records !== undefined);

  reactImmediately(() =>
    expect(metric.records?.every((record) => record.locality === "ALL")).toBe(
      true
    )
  );

  const facilityId = contentFixture.localities.Prison.entries[1].id;

  runInAction(() => {
    metric.localityId = facilityId;
  });

  reactImmediately(() => {
    expect(metric.records?.length).toBeGreaterThan(0);
    expect(
      metric.records?.every((record) => record.locality === facilityId)
    ).toBe(true);
  });

  expect.hasAssertions();
});

test("demographic data series", async () => {
  const metric = getTestMetric();

  metric.populateAllRecords();

  await when(() => Boolean(metric.dataSeries));

  reactImmediately(() => {
    expect(metric.dataSeries).toMatchSnapshot();
  });

  expect.hasAssertions();
});
