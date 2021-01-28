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

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import createMetricMapping from "../contentModels/createMetricMapping";
import type HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { reactImmediately } from "../testUtils";
import DemographicFilterSelect from "./DemographicFilterSelect";

const testTenantId = "US_ND";
const testMetricId = "ProbationPopulationHistorical";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: undefined,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as HistoricalPopulationBreakdownMetric;
}

test("has expected options", () => {
  const metric = getTestMetric();
  render(<DemographicFilterSelect metric={metric} />);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);

  const options = screen.getAllByRole("option");

  expect(options.length).toBe(4);

  expect(options[0]).toHaveTextContent("Total");
  expect(options[1]).toHaveTextContent("Race");
  expect(options[2]).toHaveTextContent("Gender");
  expect(options[3]).toHaveTextContent("Age");
});

test("changes demographic filter", () => {
  const metric = getTestMetric();
  render(<DemographicFilterSelect metric={metric} />);

  const menuButton = screen.getByRole("button", {
    name: "View Total",
  });
  fireEvent.click(menuButton);

  const raceOption = screen.getByRole("option", { name: "Race" });
  fireEvent.click(raceOption);

  reactImmediately(() => {
    expect(metric.demographicView).toBe("raceOrEthnicity");
    expect(menuButton).toHaveTextContent("Race");
  });

  fireEvent.click(menuButton);
  const genderOption = screen.getByRole("option", { name: "Gender" });
  fireEvent.click(genderOption);
  reactImmediately(() => {
    expect(metric.demographicView).toBe("gender");
    expect(menuButton).toHaveTextContent("Gender");
  });

  fireEvent.click(menuButton);

  const ageOption = screen.getByRole("option", { name: "Age" });
  fireEvent.click(ageOption);
  reactImmediately(() => {
    expect(metric.demographicView).toBe("ageBucket");
    expect(menuButton).toHaveTextContent("Age");
  });

  expect.hasAssertions();
});
