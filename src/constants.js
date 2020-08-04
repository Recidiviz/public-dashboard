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
  race: "race",
};

export const SECTION_TITLES = {
  [PATHS.sentencing]: {
    population: "Who is being sentenced?",
    types: "What types of sentences do people receive?",
  },
  [PATHS.prison]: {
    population: "Who is in prison?",
    reasons: "How did they get there?",
    terms: "How long are they there?",
    releases: "Where do they go from there?",
  },
  [PATHS.probation]: {
    population: "Who is on probation?",
    completion: "What happens after probation?",
    revocations: "Why do revocations happen?",
    ftr: "Free Through Recovery program",
  },
  [PATHS.parole]: {
    population: "Who is on parole?",
    completion: "What happens after parole?",
    revocations: "Why do revocations happen?",
    ftr: "Free Through Recovery program",
  },
  [PATHS.race]: {
    beforeIncarceration: "Disparities are already present before incarceration",
    sentencing: "How can sentencing impact disparities?",
    parole: "How can parole grant rates impact disparities?",
    supervision: "How can community supervision impact disparities?",
    programming: "Can programming help reduce disparities?",
    furtherImprovement:
      "What are we doing to further improve disparities in criminal justice in North Dakota?",
  },
};

export const DETAIL_PAGES = new Map([
  [PATHS.sentencing, "Sentencing"],
  [PATHS.prison, "Prison"],
  [PATHS.probation, "Probation"],
  [PATHS.parole, "Parole"],
]);

const NARRATIVE_PAGES = new Map([[PATHS.race, "Racial Disparities"]]);

export const ALL_PAGES = new Map([
  [PATHS.overview, "Introduction"],
  ...DETAIL_PAGES,
  ...NARRATIVE_PAGES,
]);

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

export const VIOLATION_TYPES = {
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
export const VIOLATION_COUNT_KEYS = new Map([
  [VIOLATION_TYPES.abscond, "absconsion_count"],
  [VIOLATION_TYPES.offend, "new_crime_count"],
  [VIOLATION_TYPES.technical, "technical_count"],
  [VIOLATION_TYPES.unknown, "unknown_count"],
]);

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

export const RACES = {
  nativeAmerican: "AMERICAN_INDIAN_ALASKAN_NATIVE",
  black: "BLACK",
  hispanic: "HISPANIC",
  white: "WHITE",
  other: OTHER,
};

export const RACE_LABELS = new Map([
  [RACES.nativeAmerican, "Native American"],
  [RACES.black, "Black"],
  [RACES.hispanic, "Hispanic"],
  [RACES.white, "White"],
  [RACES.other, "Other"],
]);

export const DIMENSION_MAPPINGS = new Map([
  [DIMENSION_KEYS.gender, GENDERS],
  [DIMENSION_KEYS.age, AGES],
  [DIMENSION_KEYS.race, RACE_LABELS],
  [DIMENSION_KEYS.total, new Map([[TOTAL_KEY, "Total"]])],
]);

export const SENTENCE_LENGTH_KEYS = {
  lessThanOne: "years_0_1",
  oneTwo: "years_1_2",
  twoThree: "years_2_3",
  threeFive: "years_3_5",
  fiveTen: "years_5_10",
  tenTwenty: "years_10_20",
  moreThanTwenty: "years_20_plus",
};

export const SENTENCE_LENGTHS = new Map([
  [SENTENCE_LENGTH_KEYS.lessThanOne, "<1"],
  [SENTENCE_LENGTH_KEYS.oneTwo, "1-2"],
  [SENTENCE_LENGTH_KEYS.twoThree, "2-3"],
  [SENTENCE_LENGTH_KEYS.threeFive, "3-5"],
  [SENTENCE_LENGTH_KEYS.fiveTen, "5-10"],
  [SENTENCE_LENGTH_KEYS.tenTwenty, "10-20"],
  [SENTENCE_LENGTH_KEYS.moreThanTwenty, "20+"],
]);

export const RELEASE_TYPE_KEYS = new Map([
  ["transfer", "external_transfer_count"],
  ["completion", "sentence_completion_count"],
  ["parole", "parole_count"],
  ["probation", "probation_count"],
  ["death", "death_count"],
]);

export const RELEASE_TYPE_LABELS = {
  transfer: "Transfer to custody outside of ND",
  completion: "Sentence completion",
  parole: "Parole",
  probation: "Probation",
  death: "Death",
};

export const INCARCERATION_REASON_KEYS = new Map([
  ["newAdmission", "new_admission_count"],
  ["paroleRevoked", "parole_revocation_count"],
  ["probationRevoked", "probation_revocation_count"],
  ["other", "other_count"],
]);

export const INCARCERATION_REASON_LABELS = {
  newAdmission: "New admissions",
  paroleRevoked: "Parole revocations",
  probationRevoked: "Probation revocations",
  other: "Other",
};

export const CONTAINER_WIDTH = 1144;
export const X_PADDING = 8;

// these are overrides to defaults in @w11r/use-breakpoint
export const CUSTOM_BREAKPOINTS = {
  mobile: [320, 767],
  tablet: [768, 1023],
  desktop: [1024, 1279],
  xl: [1280, 10000],
};

export const COLLAPSIBLE_NAV_BREAKPOINT = "mobile-";

const bodyFontFamily = "'Libre Franklin', sans-serif";
export const BODY_FONT_SIZE = 16;
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
const defaultDurationMs = Number(defaultDuration.replace("s", "")) * 1000;
const defaultEasing = "ease-in-out";

export const defaultTheme = {
  colors: {
    age: {
      "<25": darkGreen,
      "25-29": darkGreen9,
      "30-34": darkGreen8,
      "35-39": darkGreen7,
      "40<": darkGreen6,
      [DEMOGRAPHIC_UNKNOWN]: darkGreen5,
    },
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
    gender: {
      FEMALE: darkGreen,
      MALE: darkGreen7,
      [DEMOGRAPHIC_UNKNOWN]: darkGreen4,
    },
    heading: "#2A4163",
    highlight: brightGreen,
    incarcerationReasons: {
      newAdmission: darkGreen,
      paroleRevoked: darkGreen8,
      probationRevoked: darkGreen6,
      other: darkGreen4,
    },
    infoPanelTitle: "#F65834",
    loadingSpinner: darkerGreen,
    pillBackground: lightGray,
    pillValue: darkGray,
    monthlyTimeseriesBar: darkGreen5,
    noData: "#EFEDEC",
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
    releaseTypes: {
      transfer: darkGreen,
      completion: darkGreen7,
      parole: darkGreen6,
      probation: darkGreen5,
      death: darkGreen4,
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
    age: {
      "<25": ndColors.dataViz1,
      "25-29": ndColors.dataViz2,
      "30-34": ndColors.dataViz3,
      "35-39": ndColors.dataViz4,
      "40<": ndColors.dataViz5,
      [DEMOGRAPHIC_UNKNOWN]: ndColors.dataViz6,
    },
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
    gender: {
      FEMALE: ndColors.dataViz1,
      MALE: ndColors.dataViz2,
      [DEMOGRAPHIC_UNKNOWN]: ndColors.dataViz3,
    },
    heading: ndColors.textPrimary,
    highlight: ndColors.brandOrange,
    incarcerationReasons: {
      newAdmission: ndColors.dataViz1,
      paroleRevoked: ndColors.dataViz2,
      probationRevoked: ndColors.dataViz3,
      other: ndColors.dataViz4,
    },
    loadingSpinner: ndColors.brandTeal,
    pillBackground: ndColors.buttonBackground,
    pillBackgroundHover: ndColors.buttonBackgroundHover,
    pillValue: ndColors.textPrimary,
    monthlyTimeseriesBar: ndColors.dataViz6,
    programParticipation: ndColors.textPrimary,
    race: {
      AMERICAN_INDIAN_ALASKAN_NATIVE: ndColors.dataViz1,
      BLACK: ndColors.dataViz2,
      HISPANIC: ndColors.dataViz3,
      WHITE: ndColors.dataViz4,
      OTHER: ndColors.dataViz5,
    },
    releaseTypes: {
      transfer: ndColors.dataViz1,
      completion: ndColors.dataViz2,
      parole: ndColors.dataViz3,
      probation: ndColors.dataViz4,
      death: ndColors.dataViz5,
    },
    sentenceLengths: {
      [SENTENCE_LENGTH_KEYS.lessThanOne]: ndColors.brandTeal,
      [SENTENCE_LENGTH_KEYS.oneTwo]: ndColors.brandTealTint9,
      [SENTENCE_LENGTH_KEYS.twoThree]: ndColors.brandTealTint7,
      [SENTENCE_LENGTH_KEYS.threeFive]: ndColors.brandTealTint6,
      [SENTENCE_LENGTH_KEYS.fiveTen]: ndColors.brandTealTint5,
      [SENTENCE_LENGTH_KEYS.tenTwenty]: ndColors.brandTealTint4,
      [SENTENCE_LENGTH_KEYS.moreThanTwenty]: ndColors.brandTealTint3,
    },
    sentencing: {
      incarceration: ndColors.dataViz1,
      probation: ndColors.dataViz3,
      target: ndColors.dataViz5,
    },
    sliderThumb: ndColors.brandTeal,
    statistic: ndColors.textPrimary,
    tooltipBackground: ndColors.black,
    violationReasons: {
      [VIOLATION_TYPES.abscond]: ndColors.dataViz1,
      [VIOLATION_TYPES.offend]: ndColors.dataViz2,
      [VIOLATION_TYPES.technical]: ndColors.dataViz3,
      [VIOLATION_TYPES.unknown]: ndColors.dataViz4,
    },
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
  mapMarkers: {
    default: {
      fill: ndColors.brandTeal,
      fillOpacity: 0.8,
      stroke: ndColors.white,
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
