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

import { palette } from "@recidiviz/design-system";
import { ValuesType } from "utility-types";

const gray = "#D6DCDC";
const pine = "#00413E";
const pineBright = "#25B894";
const white = "#FAFAFA";
const pinePale = "#7D9897";
const pineAccent2 = "#006C67";
const pineDark = "#012322";

const dataVizOrder = [
  "teal",
  "gold",
  "red",
  "blue",
  "paleBlue",
  "pink",
  "paleGreen",
  "purple",
  "aqua",
  "palePurple",
  "skyBlue",
] as const;

const dataVizNamed: { [key in ValuesType<typeof dataVizOrder>]: string } = {
  teal: "#25636F",
  gold: "#D9A95F",
  red: "#BA4F4F",
  blue: "#4C6290",
  paleBlue: "#90AEB5",
  pink: "#CC989C",
  paleGreen: "#B6CC98",
  purple: "#56256F",
  aqua: "#4FBABA",
  palePurple: "#904C84",
  skyBlue: "#5F8FD9",
};

export default {
  accent: pineBright,
  background: white,
  buttonBackground: white,
  buttonBackgroundHover: gray,
  caption: palette.text.caption,
  chartAxis: pine,
  chartGridLine: gray,
  chartNoData: gray,
  checkbox: "#90AEB5",
  dataViz: dataVizOrder.map((key) => dataVizNamed[key]),
  dataVizNamed,
  dynamicText: pineAccent2,
  footerBackground: pineDark,
  footerAccent: "#A6BEBD",
  link: pineAccent2,
  mapFill: "#E9ECEC",
  mapFillHover: "#D8E3E3",
  mapStroke: white,
  menuButtonClosed: pinePale,
  menuButtonOpen: pineBright,
  mobileMenuBackground: pineDark,
  mobileMenuRule: pine,
  modalOverlay: gray,
  rule: gray,
  ruleHover: "#AFC1C3",
  text: pine,
  textDisabled: pinePale,
  textLight: white,
  timeWindowFill: pine,
  timeWindowStroke: pine,
  tooltipBackground: pineDark,
};
