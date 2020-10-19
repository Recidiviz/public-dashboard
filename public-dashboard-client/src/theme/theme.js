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

import deepMerge from "deepmerge";
import { rgb } from "d3-color";
import {
  AGES,
  BODY_FONT_SIZE,
  GENDERS,
  INCARCERATION_REASON_KEYS,
  RACE_LABELS,
  RELEASE_TYPE_KEYS,
  VIOLATION_COUNT_KEYS,
} from "../constants";

const bodyFontFamily = "'Libre Franklin', sans-serif";
const bodyLineHeight = 1.5;
const bodyMedium = `500 ${BODY_FONT_SIZE}px/${bodyLineHeight} ${bodyFontFamily}`;
const bodyBold = `600 ${BODY_FONT_SIZE}px/${bodyLineHeight} ${bodyFontFamily}`;

const displayFontFamily = "'Poppins', sans-serif";
const displayFontSize = "20px";
const displayLineHeight = 1.3;
const displayBold = `600 ${displayFontSize}/${displayLineHeight} ${displayFontFamily}`;
const displayMedium = `500 ${displayFontSize}/${displayLineHeight} ${displayFontFamily}`;
const displayNormal = `400 ${displayFontSize}/${displayLineHeight} ${displayFontFamily}`;

const brightGreen = "#25b894";

// The numbers behind the "darkGreen" colors represent an opacity
// percentage when using #FCFCFC as a background color.  Example,
// 9 === 0.9 opacity.
// Conversion tool: http://marcodiiga.github.io/rgba-to-rgb-conversion
const darkGreen = "#005450";
const darkGreen8 = "#327672";
const darkGreen4 = "#97B9B7";
const darkerGreen = "#00413E";
const white = "#FAF9F9";

const buttonBackground = "#EFEDEC";
const buttonBackgroundHover = "#E0DFDE";
const black = "#262420";
const blackTint1 = "#DFDEDD";
const charcoal = "#6C6762";

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

const dataVizColors = Array.from(dataVizColorMap.values());
const dataVizDefaultColor = dataVizColors[0];

const assignDataVizColors = (keys) =>
  keys.reduce(
    (colorMapping, key, index) => ({
      ...colorMapping,
      // color will be undefined if the list overflows
      [key]: dataVizColors[index],
    }),
    {}
  );

const defaultDuration = "0.25s";
const defaultDurationMs = Number(defaultDuration.replace("s", "")) * 1000;
const defaultEasing = "ease-in-out";

const baseSentencingColor = rgb(dataVizDefaultColor);

export const defaultTheme = {
  colors: {
    age: assignDataVizColors(Array.from(AGES.keys())),
    asideBackground: "rgba(206, 202, 199, 0.8)", // "#CECAC7"
    background: white,
    body: charcoal,
    bodyLight: white,
    chartAxis: charcoal,
    chartErrorBackground: buttonBackground,
    chartGridLine: "#E0DFDE",
    controlBackground: buttonBackground,
    controlLabel: charcoal,
    controlValue: black,
    dataViz: dataVizColors,
    footer: white,
    footerBackground: darkerGreen,
    divider: "#CECAC7",
    gender: assignDataVizColors(Array.from(GENDERS.keys())),
    heading: black,
    highlight: brightGreen,
    incarcerationReasons: assignDataVizColors(
      Array.from(INCARCERATION_REASON_KEYS.keys())
    ),
    infoPanelTitle: "#F65834",
    loadingSpinner: darkerGreen,
    map: {
      fill: blackTint1,
      fillHover: darkGreen4,
      fillActive: darkGreen8,
      stroke: white,
    },
    mapMarkers: {
      fill: dataVizDefaultColor,
      stroke: white,
    },
    pillBackground: buttonBackground,
    pillBackgroundHover: buttonBackgroundHover,
    pillValue: black,
    monthlyTimeseriesBar: dataVizDefaultColor,
    noData: "#EFEDEC",
    populationTimeseriesTotal: dataVizDefaultColor,
    programParticipation: black,
    race: assignDataVizColors(Array.from(RACE_LABELS.keys())),
    racialDisparities: {
      selected: brightGreen,
      remainder: dataVizColorMap.get("paleBlue"),
    },
    releaseTypes: assignDataVizColors(Array.from(RELEASE_TYPE_KEYS.keys())),
    sentenceLengths: dataVizColorMap.get("paleBlue"),
    sentencing: {
      // unlike other charts, this one has a monochromatic palette with opacity
      incarceration: baseSentencingColor.copy({ opacity: 0.9 }).toString(),
      probation: baseSentencingColor.copy({ opacity: 0.7 }).toString(),
      both: baseSentencingColor.copy({ opacity: 0.6 }).toString(),
      target: baseSentencingColor.copy({ opacity: 0.5 }).toString(),
      hover: baseSentencingColor.copy({ opacity: 0.2 }).toString(),
    },
    sliderThumb: darkGreen,
    statistic: black,
    timeWindowFill: charcoal,
    timeWindowStroke: brightGreen,
    tooltipBackground: black,
    violationReasons: assignDataVizColors(
      Array.from(VIOLATION_COUNT_KEYS.keys())
    ),
  },
  fonts: {
    body: bodyMedium,
    bodyBold,
    display: displayBold,
    displayMedium,
    displayNormal,
    brandSizeSmall: "14px",
    brandSizeLarge: "22px",
    brandSubtitleSize: "14px",
    brandSubtitleSizeSmall: "13px",
    headingTitleStylesSmall: `
      font-size: 28px;
      letter-spacing: -0.015em;
      line-height: 1;
    `,
  },
  footerHeight: "320px",
  headerHeightSmall: 50,
  headerHeight: 112,
  sectionTextWidth: "60vw",
  transition: {
    defaultDuration,
    defaultDurationMs,
    defaultEasing,
    defaultTimeSettings: `${defaultDuration} ${defaultEasing}`,
  },
  zIndex: {
    base: 1,
    control: 50,
    menu: 100,
    tooltip: 500,
    header: 750,
    modal: 1000,
  },
};

// ND colors are tinted with the theme background color (i.e. converted from opacity)
const ndColors = {
  brandOrange: "#D34727",
  brandOrangeTint1: "#EFE0DC",
  brandTeal: "#004B5B",
  brandTealDark: "#003C49",
};

const northDakotaTheme = {
  colors: {
    footerBackground: ndColors.brandTealDark,
    highlight: ndColors.brandOrange,
    loadingSpinner: ndColors.brandTeal,
    map: {
      fillHover: ndColors.brandOrangeTint1,
      fillActive: ndColors.brandOrange,
    },
    racialDisparities: {
      selected: ndColors.brandOrange,
    },
    sliderThumb: ndColors.brandTeal,
    timeWindowStroke: ndColors.brandOrange,
  },
};

export const THEME = deepMerge(defaultTheme, northDakotaTheme);
