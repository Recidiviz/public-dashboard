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
import { isMetricTypeId, isSystemNarrativeTypeId } from "../contentApi/types";
import RacialDisparitiesNarrative from "./RacialDisparitiesNarrative";
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

  const expectedMetrics = Object.keys(fixture.metrics).filter(isMetricTypeId);
  expectedMetrics.forEach((metricId) =>
    expect(tenant.metrics.get(metricId)).toBeDefined()
  );
  expect(expectedMetrics.length).toBe(tenant.metrics.size);
});

test.each([
  ["complete", exhaustiveFixture],
  ["partial", partialFixture],
])("tenant has %s system narratives", (type, fixture) => {
  retrieveContentMock.mockReturnValue(fixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  const expectedNarratives = Object.keys(tenant.systemNarratives).filter(
    isSystemNarrativeTypeId
  );
  expectedNarratives.forEach((id) => {
    const narrative = tenant.systemNarratives[id];
    expect(narrative).toBeDefined();
  });
  expect(expectedNarratives.length).toBe(
    Object.keys(tenant.systemNarratives).length
  );
});

test("tenant has racial disparities narrative", () => {
  retrieveContentMock.mockReturnValue(exhaustiveFixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  expect(tenant.racialDisparitiesNarrative).toBeInstanceOf(
    RacialDisparitiesNarrative
  );
});

test("tenant does not have racial disparities narrative", () => {
  retrieveContentMock.mockReturnValue(partialFixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  expect(tenant.racialDisparitiesNarrative).toBeUndefined();
});

test("tenant has default demographic categories", () => {
  retrieveContentMock.mockReturnValue(partialFixture);

  const tenant = createTenant({ tenantId: "US_ND" });

  expect(tenant.getDemographicCategories("raceOrEthnicity")).toEqual([
    { identifier: "AMERICAN_INDIAN_ALASKAN_NATIVE", label: "Native American" },
    { identifier: "BLACK", label: "Black" },
    { identifier: "HISPANIC", label: "Hispanic" },
    { identifier: "WHITE", label: "White" },
    { identifier: "ASIAN", label: "Asian" },
    {
      identifier: "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
      label: "Pacific Islander",
    },
    { identifier: "OTHER", label: "Other" },
  ]);

  expect(tenant.getDemographicCategories("gender")).toEqual([
    { identifier: "MALE", label: "Male" },
    { identifier: "FEMALE", label: "Female" },
  ]);

  expect(tenant.getDemographicCategories("ageBucket")).toEqual([
    { identifier: "<25", label: "<25" },
    { identifier: "25-29", label: "25-29" },
    { identifier: "30-34", label: "30-34" },
    { identifier: "35-39", label: "35-39" },
    { identifier: "40<", label: "40+" },
  ]);
});

test("tenant has customized demographic categories", () => {
  retrieveContentMock.mockReturnValue({
    ...partialFixture,
    demographicCategories: {
      raceOrEthnicity: [
        "AMERICAN_INDIAN_ALASKAN_NATIVE",
        "BLACK",
        "HISPANIC",
        "WHITE",
        "OTHER",
      ],
    },
  });

  const tenant = createTenant({ tenantId: "US_ND" });

  expect(tenant.getDemographicCategories("raceOrEthnicity")).toEqual([
    { identifier: "AMERICAN_INDIAN_ALASKAN_NATIVE", label: "Native American" },
    { identifier: "BLACK", label: "Black" },
    { identifier: "HISPANIC", label: "Hispanic" },
    { identifier: "WHITE", label: "White" },
    { identifier: "OTHER", label: "Other" },
  ]);
});
