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

const gray = "#D6DCDC";
const pine = "#00413E";
const pineBright = "#25B894";
const white = "#FAFAFA";
const pinePale = "#7D9897";
const pineAccent2 = "#006C67";
const pineDark = "#012322";

const dataVizColorMap = new Map([
  ["teal", "#25636F"],
  ["gold", "#D9A95F"],
  ["red", "#BA4F4F"],
  ["blue", "#4C6290"],
  ["paleBlue", "#90AEB5"],
  ["pink", "#CC989C"],
  ["paleGreen", "#B6CC98"],
  ["purple", "#56256F"],
  ["aqua", "#4FBABA"],
  ["palePurple", "#904C84"],
  ["skyBlue", "#5F8FD9"],
]);

export const colors = {
  accent: pineBright,
  background: white,
  buttonBackground: white,
  buttonBackgroundHover: gray,
  caption: pinePale,
  chartAxis: pine,
  chartGridLine: pinePale,
  dataViz: Array.from(dataVizColorMap.values()),
  dataVizNamed: dataVizColorMap,
  footerBackground: pineDark,
  link: pineAccent2,
  rule: gray,
  ruleHover: "#AFC1C3",
  text: pine,
  textLight: white,
  timeWindowFill: pine,
  timeWindowStroke: pine,
  tooltipBackground: pineDark,
};

const FADE_AMOUNT = 0.45;

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
