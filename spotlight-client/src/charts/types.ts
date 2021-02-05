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

import { MetricRecord } from "../contentModels/types";
import { TooltipContentProps } from "../Tooltip";

export type DataSeries<RecordFormat = MetricRecord> = {
  label: string;
  color: string;
  coordinates: RecordFormat[];
};

/**
 * A combination of properties consistently produced by Semiotic
 * and properties derived from our DataSeries format that Semiotic
 * attaches to the object
 */
export type CommonDataPoint = {
  label: DataSeries["label"];
  color: DataSeries["color"];
  value: number;
  pct?: number;
};

export type ItemToHighlight = Pick<DataSeries, "label">;
export function isItemToHighlight(
  item?: Record<string, unknown>
): item is ItemToHighlight {
  return Boolean(item && typeof item.label === "string");
}

export type ItemToDisplay = Pick<DataSeries, "label" | "color">;

export type CategoricalChartRecord = {
  label: string;
  color: string;
  value: number;
  pct: number;
};

export type TooltipContentFunction = (
  // this point comes from Semiotic and is not strongly typed.
  // There is really no consistent shape to it, it depends on
  // the chart type and what the original data looked like
  point: Record<string, unknown>
) => TooltipContentProps;
