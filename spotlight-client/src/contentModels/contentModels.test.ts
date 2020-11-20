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

import retrieveContent from "../contentApi/retrieveContent";
import { CollectionTypeId, MetricTypeId } from "../contentApi/types";
import Collection from "./Collection";
import Metric from "./Metric";
import { createTenant } from "./Tenant";
import exhaustiveFixture from "./__fixtures__/tenant_content_exhaustive";
import partialFixture from "./__fixtures__/tenant_content_partial";

jest.mock("../contentApi/retrieveContent");

const retrieveContentMock = retrieveContent as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("create a %s Tenant", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);
  const tenant = createTenant({ tenantId: "US_ND" });
  expect(tenant.name).toBe(fixture.name);
  expect(tenant.description).toBe(fixture.description);
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("tenant has %s Metrics", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  const expectedMetrics = Object.keys(fixture.metrics) as MetricTypeId[];
  expectedMetrics.forEach((metricId) =>
    expect(tenant.metrics.get(metricId)).toBeDefined()
  );
  expect(expectedMetrics.length).toBe(tenant.metrics.size);
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("tenant has %s Collections", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  const expectedCollections = Object.keys(
    fixture.collections
  ) as CollectionTypeId[];
  expectedCollections.forEach((id) => {
    const collection = tenant.collections.get(id);
    expect(collection).toBeDefined();
  });
  expect(expectedCollections.length).toBe(tenant.collections.size);
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("collections have %s metrics", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  tenant.collections.forEach((collection, collectionId) => {
    const metricsInCollection = (collection as Collection).metrics;
    let expectedMetricCount = 0;
    let expectedMetricKeys: MetricTypeId[] = [];
    switch (collectionId) {
      case "Sentencing":
        expectedMetricKeys = [
          "SentencePopulationCurrent",
          "SentenceTypesCurrent",
        ];
        break;
      case "Prison":
        expectedMetricKeys = [
          "PrisonAdmissionReasonsCurrent",
          "PrisonPopulationCurrent",
          "PrisonPopulationHistorical",
          "PrisonRecidivismRateHistorical",
          "PrisonRecidivismRateSingleFollowupHistorical",
          "PrisonReleaseTypeAggregate",
          "PrisonStayLengthAggregate",
        ];
        break;
      case "Probation":
        expectedMetricKeys = [
          "ProbationPopulationCurrent",
          "ProbationPopulationHistorical",
          "ProbationProgrammingCurrent",
          "ProbationRevocationsAggregate",
          "ProbationSuccessHistorical",
        ];
        break;
      case "Parole":
        expectedMetricKeys = [
          "ParolePopulationCurrent",
          "ParolePopulationHistorical",
          "ParoleProgrammingCurrent",
          "ParoleRevocationsAggregate",
          "ParoleSuccessHistorical",
        ];
        break;
      default:
        // if some new collection type appears that isn't reflected here,
        // this test ought to fail based on the size property,
        // so we don't need to do anything special as a fallback
        break;
    }
    // the collection should contain all of the metrics enumerated above and no others
    expectedMetricKeys.forEach((key) => {
      expectedMetricCount += 1;
      expect(tenant.metrics.get(key)).toBe(metricsInCollection.get(key));
      if (tenant.metrics.get(key)) {
        expect(metricsInCollection.get(key) instanceof Metric).toBe(true);
      } else {
        expect(metricsInCollection.get(key)).toBeUndefined();
      }
    });

    expect(metricsInCollection.size).toBe(expectedMetricCount);
  });
});

test("collections and metrics without content are undefined", () => {
  retrieveContentMock.mockReturnValue(partialFixture);
  const tenant = createTenant({ tenantId: "US_ND" });

  // collection exists but one of its metrics doesn't
  const prisonCollection = tenant.collections.get("Prison");
  expect(prisonCollection instanceof Collection).toBe(true);
  expect(tenant.metrics.get("PrisonReleaseTypeAggregate")).toBeUndefined();
  expect(
    // @ts-expect-error: prisonCollection is defined, we just tested it
    prisonCollection.metrics.get("PrisonReleaseTypeAggregate")
  ).toBeUndefined();

  // metric exists but one of its collections doesn't
  expect(tenant.collections.get("Sentencing")).toBeUndefined();
  const sentenceMetric = tenant.metrics.get("SentencePopulationCurrent");
  expect(sentenceMetric instanceof Metric).toBe(true);
  // @ts-expect-error: sentenceMetric is defined, we just tested it
  expect(sentenceMetric.collections.get("Sentencing")).toBeUndefined();
});
