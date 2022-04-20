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

import { fireEvent, screen, within } from "@testing-library/react";
import React from "react";
import createMetricMapping from "../contentModels/createMetricMapping";
import HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import contentFixture from "../contentModels/__fixtures__/tenant_content_exhaustive";
import { renderWithTheme } from "../testUtils";
import MetricVizControls from "./MetricVizControls";

const testTenantId = "US_ND";
const testMetricId = "ProbationPopulationHistorical";
const testMetadataMapping = {
  [testMetricId]: contentFixture.metrics[testMetricId],
};

// we can use any metric here, the behavior is generic
function getTestMetric() {
  return createMetricMapping({
    localityLabelMapping: undefined,
    metadataMapping: testMetadataMapping,
    tenantId: testTenantId,
  }).get(testMetricId) as HistoricalPopulationBreakdownMetric;
}

test("download button", () => {
  const metric = getTestMetric();
  jest.spyOn(metric, "download").mockImplementation(() => Promise.resolve());

  renderWithTheme(<MetricVizControls filters={[]} metric={metric} />);

  const download = screen.getByRole("button", { name: "Download Data" });
  expect(download).toBeVisible();
  fireEvent.click(download);

  expect(metric.download).toHaveBeenCalled();
});

test("methodology modal", () => {
  const metric = getTestMetric();
  renderWithTheme(<MetricVizControls filters={[]} metric={metric} />);

  const methodology = screen.getByRole("button", { name: "Methodology" });

  fireEvent.click(methodology);

  const modal = screen.getByRole("dialog");

  expect(modal).toBeVisible();
  expect(
    within(modal).getByRole("heading", { name: "Methodology" })
  ).toBeVisible();
  // this only works because the test metric has no HTML in it
  expect(within(modal).getByText(metric.methodology)).toBeVisible();
});
