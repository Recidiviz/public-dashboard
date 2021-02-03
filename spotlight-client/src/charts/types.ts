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

import { ProjectedPoint } from "semiotic/lib/types/generalTypes";
import { MetricRecord } from "../contentModels/types";

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
export type ProjectedDataPoint = ProjectedPoint & {
  label: DataSeries["label"];
  color: DataSeries["color"];
  value: number;
  pct?: number;
  date?: Date;
  [key: string]: unknown;
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
};
