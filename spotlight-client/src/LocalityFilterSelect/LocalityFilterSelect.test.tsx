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

import { render, screen } from "@testing-library/react";
import React from "react";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import createMetricMapping from "../contentModels/createMetricMapping";
import type PopulationBreakdownByLocationMetric from "../contentModels/PopulationBreakdownByLocationMetric";
import LocalityFilterSelect from "./LocalityFilterSelect";

const testTenantId = "US_ND";
const testMetricId = "ProbationPopulationCurrent";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

// judicial districts present in backend fixture
const expectedLocalities = [
  { id: "ALL", label: "All Districts" },
  { id: "EAST_CENTRAL", label: "East Central" },
  { id: "NORTH_CENTRAL", label: "North Central" },
  { id: "NORTHEAST", label: "Northeast" },
  { id: "NORTHEAST_CENTRAL", label: "Northeast Central" },
  { id: "NORTHWEST", label: "Northwest" },
  { id: "SOUTH_CENTRAL", label: "South Central" },
  { id: "SOUTHEAST", label: "Southeast" },
  { id: "SOUTHWEST", label: "Southwest" },
  { id: "OTHER", label: "Other" },
];

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: {
      Probation: { label: "Judicial District", entries: expectedLocalities },
    },
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as PopulationBreakdownByLocationMetric;
}

test("has expected options", () => {
  const metric = getTestMetric();
  render(<LocalityFilterSelect metric={metric} />);

  const menuButton = screen.queryByRole("button", {
    name: "Judicial District All Districts",
  });

  expect(menuButton).toBeNull(); // Jurisdiction Dropdowns should no longer display for ND as of February 2025
});

test("changes demographic filter", () => {
  const metric = getTestMetric();
  render(<LocalityFilterSelect metric={metric} />);

  const menuButton = screen.queryByRole("button", {
    name: "Judicial District All Districts",
  });

  expect(menuButton).toBeNull(); // Jurisdiction Dropdowns should no longer display for ND  as of February 2025
  expect.hasAssertions();
});
