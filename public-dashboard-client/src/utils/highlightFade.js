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

import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { THEME } from "../theme";

const FADE_AMOUNT = 0.45;

export default function highlightFade(baseColor, { useOpacity = false } = {}) {
  if (useOpacity) {
    // in cases where we actually want the color to be transparent,
    // this is a relatively straightforward opacity change
    const fadedColor = color(baseColor);
    fadedColor.opacity = 0.45;
    return fadedColor.toString();
  }
  // in cases where we don't want a transparent color (which is most cases),
  // this will create a tint ramp from background color to baseColor;
  // the ramp goes from 0 to 1 with values analogous to opacity
  return interpolateRgb(THEME.colors.background, baseColor)(FADE_AMOUNT);
}
