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
import { DemographicView } from "../demographics";
import { reactImmediately } from "../testUtils";
import createMetricMapping from "./createMetricMapping";
import SentenceTypeByLocationMetric from "./SentenceTypeByLocationMetric";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

const testTenantId = "US_ND";
const testMetricId = "SentenceTypesCurrent";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: contentFixture.localities,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as SentenceTypeByLocationMetric;
}

async function getPopulatedMetric() {
  const metric = getTestMetric();

  metric.hydrate();

  await when(() => Boolean(metric.records));

  return metric;
}

test("total data", async () => {
  const metric = await getPopulatedMetric();

  reactImmediately(() => {
    expect(metric.dataGraph).toMatchSnapshot();
  });

  expect.hasAssertions();
});

test.each([["raceOrEthnicity"], ["gender"], ["ageBucket"]] as [
  Exclude<DemographicView, "nofilter">
][])("%s data", async (demographicView) => {
  const metric = await getPopulatedMetric();

  runInAction(() => {
    metric.demographicView = demographicView;
  });

  reactImmediately(() => {
    expect(metric.dataGraph).toMatchSnapshot();
  });

  expect.hasAssertions();
});

test("locality filter", async () => {
  const metric = await getPopulatedMetric();

  reactImmediately(() =>
    expect(metric.records?.every((record) => record.locality === "ALL")).toBe(
      true
    )
  );

  const facilityId = contentFixture.localities.Sentencing.entries[1].id;

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
