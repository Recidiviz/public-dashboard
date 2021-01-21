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

/**
 * This object is a mix of keys consistently provided by Semiotic
 * and others that are derived from the data format that we passed to the chart
 */
export type TooltipContentProps = ProjectedPoint & Record<string, unknown>;

export type InfoPanelState = {
  data?: TooltipContentProps;
  renderContents?: (props: TooltipContentProps) => React.ReactNode;
};
