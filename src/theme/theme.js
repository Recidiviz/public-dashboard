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

const darkBlue = "#132C52";

const brightGreen = "#25b894";

// The numbers behind the "darkGreen" colors represent an opacity
// percentage when using #FCFCFC as a background color.  Example,
// 9 === 0.9 opacity.
// Conversion tool: http://marcodiiga.github.io/rgba-to-rgb-conversion
const darkGreen = "#005450";
const darkGreen8 = "#327672";
const darkGreen4 = "#97B9B7";
const darkerGreen = "#00413E";
const darkGray = "#5A6575";
const darkerGray = "#403F3F";
const lightGray = "#ECEDEF";
const medGray = "#707F96";
const white = "#fff";

const dataVizColorMap = new Map([
  ["teal", "#25636F"],
  ["gold", "#D9A95F"],
  ["red", "#BA4F4F"],
  ["blue", "#4C6290"],
  ["paleGreen", "#90AEB5"],
  ["pink", "#CC989C"],
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
    background: "#FCFCFC",
    body: medGray,
    bodyLight: white,
    chartAxis: medGray,
    controlBackground: lightGray,
    controlLabel: "#3D4045",
    controlValue: darkGray,
    footer: "#91A6A5",
    footerBackground: darkerGreen,
    divider: "#E5E7EB",
    gender: assignDataVizColors(Array.from(GENDERS.keys())),
    heading: "#2A4163",
    highlight: brightGreen,
    incarcerationReasons: assignDataVizColors(
      Array.from(INCARCERATION_REASON_KEYS.keys())
    ),
    infoPanelTitle: "#F65834",
    loadingSpinner: darkerGreen,
    mapMarkers: {
      fill: dataVizDefaultColor,
      stroke: white,
    },
    pillBackground: lightGray,
    pillValue: darkGray,
    monthlyTimeseriesBar: dataVizDefaultColor,
    noData: "#EFEDEC",
    programParticipation: darkerGray,
    race: assignDataVizColors(Array.from(RACE_LABELS.keys())),
    releaseTypes: assignDataVizColors(Array.from(RELEASE_TYPE_KEYS.keys())),
    sentenceLengths: rgb(dataVizDefaultColor).copy({ opacity: 0.6 }).toString(),
    sentencing: {
      // unlike other charts, this one has a monochromatic palette with opacity
      incarceration: baseSentencingColor.copy({ opacity: 0.9 }).toString(),
      probation: baseSentencingColor.copy({ opacity: 0.6 }).toString(),
      target: baseSentencingColor.copy({ opacity: 0.4 }).toString(),
      hover: baseSentencingColor.toString(),
    },
    sliderThumb: darkGreen,
    statistic: darkBlue,
    tooltipBackground: darkBlue,
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
  },
  headerHeightSmall: 50,
  headerHeight: 112,
  maps: {
    // these are style objects that we can pass directly to react-simple-maps
    default: {
      fill: "#D6E3E2",
      stroke: white,
      strokeWidth: 1.5,
    },
    hover: {
      fill: darkGreen4,
      stroke: white,
    },
    pressed: {
      fill: darkGreen8,
      stroke: white,
    },
  },
  sectionTextWidth: 600,
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
  asideBackground: "rgba(206, 202, 199, 0.8)", // "#CECAC7"
  black: "#303030",
  blackTint1: "#DFDEDD",
  brandOrange: "#D34727",
  brandOrangeTint1: "#EFE0DC",
  brandOrangeTint8: "#D9694F",
  brandTeal: "#004B5B",
  brandTealTint2: "#C2D5D7",
  brandTealTint3: "#A9C8CB",
  brandTealTint4: "#91BABF",
  brandTealTint5: "#79ACB3",
  brandTealTint6: "#619EA6",
  brandTealTint7: "#49909A",
  brandTealTint8: "#30838E",
  brandTealTint9: "#187581",
  buttonBackground: "#EFEDEC",
  buttonBackgroundHover: "#E0DFDE",
  dataViz1: "#004B5B", // same as brand teal
  dataViz2: "#006675",
  dataViz3: "#38808D",
  dataViz4: "#669AA3",
  dataViz5: "#8FB4BB",
  dataViz6: "#B8CED3",
  textPrimary: "#262420",
  textSecondary: "#6C6762",
  white: "#FAF9F9",
};

const northDakotaTheme = {
  colors: {
    asideBackground: ndColors.asideBackground,
    background: ndColors.white,
    body: ndColors.textSecondary,
    bodyLight: ndColors.white,
    chartAxis: ndColors.textSecondary,
    controlBackground: ndColors.buttonBackground,
    controlLabel: ndColors.textSecondary,
    controlValue: ndColors.textPrimary,
    footer: ndColors.white,
    footerBackground: "#003C49",
    divider: "#CECAC7",
    heading: ndColors.textPrimary,
    highlight: ndColors.brandOrange,
    loadingSpinner: ndColors.brandTeal,
    mapMarkers: {
      stroke: ndColors.white,
    },
    pillBackground: ndColors.buttonBackground,
    pillBackgroundHover: ndColors.buttonBackgroundHover,
    pillValue: ndColors.textPrimary,
    programParticipation: ndColors.textPrimary,
    sliderThumb: ndColors.brandTeal,
    statistic: ndColors.textPrimary,
    tooltipBackground: ndColors.textPrimary,
  },
  maps: {
    // these are style objects that we can pass directly to react-simple-maps
    default: {
      fill: ndColors.blackTint1,
      stroke: ndColors.white,
    },
    hover: {
      fill: ndColors.brandOrangeTint1,
      stroke: ndColors.white,
    },
    pressed: {
      fill: ndColors.brandOrange,
      stroke: ndColors.white,
    },
  },
};

export const THEME = deepMerge(defaultTheme, northDakotaTheme);
