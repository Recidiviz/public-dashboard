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

import { sum } from "d3-array";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { colors } from "../UiLibrary";

const FADE_AMOUNT = 0.45;

// eslint-disable-next-line import/prefer-default-export
export function highlightFade(
  baseColor: string,
  { useOpacity = false } = {}
): string {
  if (useOpacity) {
    // in cases where we actually want the color to be transparent,
    // this is a relatively straightforward opacity change
    const fadedColor = color(baseColor);

    // can't do anything with an invalid color
    if (!fadedColor) return baseColor;

    fadedColor.opacity = FADE_AMOUNT;
    return fadedColor.toString();
  }
  // in cases where we don't want a transparent color (which is most cases),
  // this will create a tint ramp from background color to baseColor;
  // the ramp goes from 0 to 1 with values analogous to opacity
  return interpolateRgb(colors.background, baseColor)(FADE_AMOUNT);
}

// TODO: I don't think this is doing anything because there are no "value" fields
export function getDataWithPct<RecordFormat extends { value: number }>(
  data: RecordFormat[]
): (RecordFormat & { pct: number })[] {
  // calculate percentages for display
  const totalValue = sum(data.map(({ value }) => value));
  return data.map((record) => ({
    ...record,
    pct: record.value / totalValue,
  }));
}
