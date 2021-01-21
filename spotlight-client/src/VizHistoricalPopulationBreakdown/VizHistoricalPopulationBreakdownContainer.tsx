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

import { observer } from "mobx-react-lite";
import React from "react";
import { withErrorBoundary } from "react-error-boundary";
import { DataSeries } from "../charts/types";
import HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_DATA_KEYS,
  DIMENSION_MAPPINGS,
} from "../demographics";
import ErrorMessage from "../ErrorMessage";
import { HistoricalPopulationBreakdownRecord } from "../metricsApi";
import { colors } from "../UiLibrary";
import VizHistoricalPopulationBreakdown from "./VizHistoricalPopulationBreakdown";

const VizHistoricalPopulationBreakdownContainer: React.FC<{
  metric: HistoricalPopulationBreakdownMetric;
}> = ({ metric }) => {
  let chartData:
    | DataSeries<HistoricalPopulationBreakdownRecord>[]
    | null = null;

  const { demographicView, records } = metric;

  if (records) {
    if (demographicView !== "nofilter") {
      const labelsForDimension = DIMENSION_MAPPINGS.get(demographicView);
      if (labelsForDimension) {
        chartData = Array.from(labelsForDimension)
          // don't need to include unknown in this chart;
          // they are minimal to nonexistent in historical data and make the legend confusing
          .filter(([value]) => value !== DEMOGRAPHIC_UNKNOWN)
          .map(([value, label], index) => ({
            label,
            color: colors.dataViz[index],
            coordinates:
              demographicView === "total"
                ? records
                : records.filter(
                    (record) =>
                      record[DIMENSION_DATA_KEYS[demographicView]] === value
                  ),
          }));
      }
    }
  }

  return (
    <>
      <VizHistoricalPopulationBreakdown data={chartData} error={metric.error} />
    </>
  );
};

export default withErrorBoundary(
  observer(VizHistoricalPopulationBreakdownContainer),
  { FallbackComponent: ErrorMessage }
);
