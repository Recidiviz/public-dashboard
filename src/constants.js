import deepMerge from "deepmerge";

export const DEFAULT_TENANT = "us_nd";

export const TENANTS = {
  us_nd: {
    aspectRatio: 5 / 3,
  },
};

export const PATHS = {
  overview: "overview",
  parole: "parole",
  prison: "prison",
  probation: "probation",
  sentencing: "sentencing",
};

export const TOTAL_KEY = "ALL";

export const DIMENSION_KEYS = {
  age: "age",
  gender: "gender",
  race: "race",
  total: "total",
};

// these correspond to fields in fetched data
export const DIMENSION_DATA_KEYS = {
  [DIMENSION_KEYS.age]: "age_bucket",
  [DIMENSION_KEYS.gender]: "gender",
  [DIMENSION_KEYS.race]: "race_or_ethnicity",
};

export const DIMENSION_LABELS = {
  [DIMENSION_KEYS.age]: "Age",
  [DIMENSION_KEYS.gender]: "Gender",
  [DIMENSION_KEYS.race]: "Race",
  [DIMENSION_KEYS.total]: "Total",
};

export const DIMENSIONS_LIST = [
  { id: DIMENSION_KEYS.total, label: DIMENSION_LABELS.total },
  { id: DIMENSION_KEYS.race, label: DIMENSION_LABELS.race },
  { id: DIMENSION_KEYS.gender, label: DIMENSION_LABELS.gender },
  { id: DIMENSION_KEYS.age, label: DIMENSION_LABELS.age },
];

const VIOLATION_TYPES = {
  abscond: "abscond",
  offend: "offend",
  technical: "technical",
  unknown: "unknown",
};

export const VIOLATION_LABELS = {
  [VIOLATION_TYPES.abscond]: "Absconsion",
  [VIOLATION_TYPES.offend]: "New Offense",
  [VIOLATION_TYPES.technical]: "Technical Violation",
  [VIOLATION_TYPES.unknown]: "Unknown Type",
};

// these correspond to expected fields in fetched data
export const VIOLATION_COUNT_KEYS = {
  [VIOLATION_TYPES.abscond]: "absconsion_count",
  [VIOLATION_TYPES.offend]: "new_crime_count",
  [VIOLATION_TYPES.technical]: "technical_count",
  [VIOLATION_TYPES.unknown]: "unknown_count",
};

export const SUPERVISION_TYPES = {
  parole: "PAROLE",
  probation: "PROBATION",
};

export const OTHER = "OTHER";
export const OTHER_LABEL = "Other";

export const DEMOGRAPHIC_UNKNOWN = "EXTERNAL_UNKNOWN";

const DEMOGRAPHIC_UNKNOWN_MAPPING = [[DEMOGRAPHIC_UNKNOWN, "Unknown"]];

export const AGE_KEYS = {
  under25: "<25",
  "25_29": "25-29",
  "30_34": "30-34",
  "35_39": "35-39",
  over40: "40<",
};

const AGES = new Map([
  [AGE_KEYS.under25, "<25"],
  [AGE_KEYS["25_29"], "25-29"],
  [AGE_KEYS["30_34"], "30-34"],
  [AGE_KEYS["35_39"], "35-39"],
  [AGE_KEYS.over40, "40<"],
  ...DEMOGRAPHIC_UNKNOWN_MAPPING,
]);

const GENDERS = new Map([
  ["FEMALE", "Female"],
  ["MALE", "Male"],
  ...DEMOGRAPHIC_UNKNOWN_MAPPING,
]);

const RACES = new Map([
  ["AMERICAN_INDIAN_ALASKAN_NATIVE", "American Indian or Alaskan Native"],
  ["BLACK", "Black"],
  ["HISPANIC", "Hispanic"],
  ["WHITE", "White"],
  [OTHER, "Other"],
]);

export const DIMENSION_MAPPINGS = new Map([
  [DIMENSION_KEYS.gender, GENDERS],
  [DIMENSION_KEYS.age, AGES],
  [DIMENSION_KEYS.race, RACES],
  [DIMENSION_KEYS.total, new Map([[TOTAL_KEY, "Total"]])],
]);

const SENTENCE_LENGTH_KEYS = {
  lessThanOne: "<1_count",
  oneTwo: "1-2_count",
  twoThree: "2-3_count",
  threeFive: "3-5_count",
  fiveTen: "5-10_count",
  tenTwenty: "10-20_count",
  moreThanTwenty: "20+_count",
};

export const SENTENCE_LENGTHS = new Map([
  [SENTENCE_LENGTH_KEYS.lessThanOne, "<1 year"],
  [SENTENCE_LENGTH_KEYS.oneTwo, "1-2"],
  [SENTENCE_LENGTH_KEYS.twoThree, "2-3"],
  [SENTENCE_LENGTH_KEYS.threeFive, "3-5"],
  [SENTENCE_LENGTH_KEYS.fiveTen, "5-10"],
  [SENTENCE_LENGTH_KEYS.tenTwenty, "10-20"],
  [SENTENCE_LENGTH_KEYS.moreThanTwenty, "20+"],
]);

export const CONTAINER_WIDTH = 1144;
export const X_PADDING = 8;
export const FIXED_HEADER_HEIGHT = 50;

// these are overrides to defaults in @w11r/use-breakpoint
export const CUSTOM_BREAKPOINTS = {
  mobile: [320, 767],
  tablet: [768, 1023],
  desktop: [1024, 1279],
  xl: [1280, 10000],
};

const bodyFontFamily = "'Libre Franklin', sans-serif";
const bodyFontSize = "12px";
const bodyLineHeight = 1.5;
const bodyMedium = `500 ${bodyFontSize}/${bodyLineHeight} ${bodyFontFamily}`;
const bodyBold = `600 ${bodyFontSize}/${bodyLineHeight} ${bodyFontFamily}`;

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
const darkGreen9 = "#196561";
const darkGreen8 = "#327672";
const darkGreen7 = "#4C8684";
const darkGreen6 = "#659795";
const darkGreen5 = "#7EA8A6";
const darkGreen4 = "#97B9B7";
const darkGreen3 = "#B0CAC8";
const darkerGreen = "#00413E";
const darkGray = "#5A6575";
const darkerGray = "#403F3F";
const lightGray = "#ECEDEF";
const medGray = "#707F96";
const white = "#fff";

const defaultDuration = "0.25s";
const defaultEasing = "ease-in-out";

export const defaultTheme = {
  colors: {
    age: {
      "<25": darkGreen,
      "25-29": darkGreen9,
      "30-34": darkGreen8,
      "35-39": darkGreen7,
      "40<": darkGreen6,
    },
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
    gender: {
      FEMALE: darkGreen,
      MALE: darkGreen7,
    },
    heading: "#2A4163",
    highlight: brightGreen,
    pillBackground: lightGray,
    pillValue: darkGray,
    monthlyTimeseriesBar: darkGreen5,
    programParticipation: darkerGray,
    race: {
      AMERICAN_INDIAN_ALASKAN_NATIVE: darkGreen,
      ASIAN: darkGreen9,
      BLACK: darkGreen8,
      HISPANIC: darkGreen7,
      NATIVE_HAWAIIAN_PACIFIC_ISLANDER: darkGreen6,
      WHITE: darkGreen5,
      OTHER: darkGreen4,
    },
    sentenceLengths: {
      [SENTENCE_LENGTH_KEYS.lessThanOne]: darkGreen,
      [SENTENCE_LENGTH_KEYS.oneTwo]: darkGreen9,
      [SENTENCE_LENGTH_KEYS.twoThree]: darkGreen7,
      [SENTENCE_LENGTH_KEYS.threeFive]: darkGreen6,
      [SENTENCE_LENGTH_KEYS.fiveTen]: darkGreen5,
      [SENTENCE_LENGTH_KEYS.tenTwenty]: darkGreen4,
      [SENTENCE_LENGTH_KEYS.moreThanTwenty]: darkGreen3,
    },
    sentencing: {
      incarceration: darkGreen,
      probation: darkGreen5,
      target: darkGreen4,
    },
    sliderThumb: darkGreen,
    statistic: darkBlue,
    tooltipBackground: darkBlue,
    violationReasons: {
      [VIOLATION_TYPES.abscond]: darkGreen8,
      [VIOLATION_TYPES.offend]: darkGreen6,
      [VIOLATION_TYPES.technical]: darkGreen,
      [VIOLATION_TYPES.unknown]: darkGreen4,
    },
  },
  fonts: {
    body: bodyMedium,
    bodyBold,
    display: displayBold,
    displayMedium,
    displayNormal,
    brandSizeSmall: "14px",
    brandSizeLarge: "22px",
  },
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
  mapMarkers: {
    default: {
      fill: darkGreen,
      fillOpacity: 0.8,
      stroke: white,
      strokeWidth: 1,
      transition: `fill ${defaultDuration} ${defaultEasing}`,
    },
    hover: {
      fill: brightGreen,
    },
    pressed: {
      fill: darkGreen,
    },
  },
  transition: {
    defaultDuration,
    defaultEasing,
    defaultTimeSettings: `${defaultDuration} ${defaultEasing}`,
  },
  zIndex: {
    base: 1,
    menu: 10,
    tooltip: 50,
    header: 75,
    modal: 100,
  },
};

// ND colors are tinted with the theme background color (i.e. converted from opacity)
const ndColors = {
  background: "#F2F1F0",
  backgroundTealShade9: "#DAE3E4",
  black: "#303030",
  blackTint9: "#434343",
  blackTint6: "#7E7D7D",
  blackTint1: "#DFDEDD",
  brandOrange: "#D34727",
  brandOrangeTint8: "#D9694F",
  brandOrangeTint1: "#EFE0DC",
  brandTeal: "#006775",
  brandTealTint9: "#187581",
  brandTealTint8: "#30838E",
  brandTealTint7: "#49909A",
  brandTealTint6: "#619EA6",
  brandTealTint5: "#79ACB3",
  brandTealTint4: "#91BABF",
  brandTealTint3: "#A9C8CB",
  brandTealTint2: "#C2D5D7",
  medGray: "#E9E8E7",
};

const northDakotaTheme = {
  colors: {
    age: {
      "<25": ndColors.brandTeal,
      "25-29": ndColors.brandTealTint9,
      "30-34": ndColors.brandTealTint8,
      "35-39": ndColors.brandTealTint7,
      "40<": ndColors.brandTealTint6,
    },
    background: ndColors.background,
    body: ndColors.blackTint6,
    bodyLight: ndColors.background,
    chartAxis: ndColors.blackTint6,
    controlBackground: ndColors.medGray,
    controlLabel: ndColors.blackTint9,
    controlValue: ndColors.black,
    footer: ndColors.backgroundTealShade9,
    footerBackground: ndColors.brandTeal,
    divider: "#CECAC7",
    gender: {
      FEMALE: ndColors.brandTeal,
      MALE: ndColors.brandTealTint7,
    },
    heading: ndColors.blackTint9,
    highlight: ndColors.brandOrange,
    pillBackground: ndColors.medGray,
    pillValue: ndColors.black,
    monthlyTimeseriesBar: ndColors.brandTealTint2,
    programParticipation: ndColors.blackTint9,
    race: {
      AMERICAN_INDIAN_ALASKAN_NATIVE: ndColors.brandTeal,
      ASIAN: ndColors.brandTealTint9,
      BLACK: ndColors.brandTealTint8,
      HISPANIC: ndColors.brandTealTint7,
      NATIVE_HAWAIIAN_PACIFIC_ISLANDER: ndColors.brandTealTint6,
      WHITE: ndColors.brandTealTint5,
      OTHER: ndColors.brandTealTint4,
    },
    sentencing: {
      incarceration: ndColors.brandTeal,
      probation: ndColors.brandTealTint5,
      target: ndColors.brandTealTint3,
    },
    sliderThumb: ndColors.brandTeal,
    statistic: ndColors.blackTint9,
    tooltipBackground: ndColors.black,
    violationReasons: {
      [VIOLATION_TYPES.abscond]: ndColors.brandTeal,
      [VIOLATION_TYPES.offend]: ndColors.brandTealTint8,
      [VIOLATION_TYPES.technical]: ndColors.brandTealTint6,
      [VIOLATION_TYPES.unknown]: ndColors.brandTealTint4,
    },
  },
  maps: {
    // these are style objects that we can pass directly to react-simple-maps
    default: {
      fill: ndColors.blackTint1,
      stroke: ndColors.background,
    },
    hover: {
      fill: ndColors.brandOrangeTint1,
      stroke: ndColors.background,
    },
    pressed: {
      fill: ndColors.brandOrange,
      stroke: ndColors.background,
    },
  },
  mapMarkers: {
    default: {
      fill: ndColors.brandTeal,
      fillOpacity: 0.8,
      stroke: ndColors.background,
    },
    hover: {
      fill: ndColors.brandOrange,
    },
    pressed: {
      fill: ndColors.brandOrangeTint8,
    },
  },
};

export const THEME = deepMerge(defaultTheme, northDakotaTheme);
