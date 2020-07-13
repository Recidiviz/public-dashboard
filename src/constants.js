export const DEFAULT_TENANT = "us_nd";

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

export const DEMOGRAPHIC_OTHER = "OTHER";

export const DEMOGRAPHIC_UNKNOWN = "EXTERNAL_UNKNOWN";

const DEMOGRAPHIC_UNKNOWN_MAPPING = {
  [DEMOGRAPHIC_UNKNOWN]: "Unknown",
};

export const AGE_KEYS = {
  under25: "<25",
  "25_29": "25-29",
  "30_34": "30-34",
  "35_39": "35-39",
  over40: "40<",
};

export const AGES = {
  [AGE_KEYS.under25]: "<25",
  [AGE_KEYS["25_29"]]: "25-29",
  [AGE_KEYS["30_34"]]: "30-34",
  [AGE_KEYS["35_39"]]: "35-39",
  [AGE_KEYS.over40]: "40<",
  ...DEMOGRAPHIC_UNKNOWN_MAPPING,
};

export const GENDERS = {
  FEMALE: "Female",
  MALE: "Male",
  ...DEMOGRAPHIC_UNKNOWN_MAPPING,
};

export const RACES = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: "American Indian or Alaskan Native",
  ASIAN: "Asian",
  BLACK: "Black",
  HISPANIC: "Hispanic",
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: "Native Hawaiian or Pacific Islander",
  [DEMOGRAPHIC_OTHER]: "Other",
  WHITE: "White",
};

export const DIMENSION_MAPPINGS = new Map([
  [DIMENSION_KEYS.gender, GENDERS],
  [DIMENSION_KEYS.age, AGES],
  [DIMENSION_KEYS.race, RACES],
]);

export const CONTAINER_WIDTH = 1144;

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

const brightGreen = "#25b894";
const darkGreen = "#005450";
const darkerGreen = "#00413E";
const darkGray = "#5A6575";
const lightGray = "#ECEDEF";
const white = "#fff";

export const THEME = {
  colors: {
    // descriptive
    blue: "#3e8df7",
    darkGreen,
    // functional
    background: "#FCFCFC",
    body: "#707F96",
    bodyLight: white,
    controlBackground: lightGray,
    controlLabel: "#3D4045",
    controlValue: darkGray,
    footer: "#91A6A5",
    footerBackground: darkerGreen,
    divider: "#E5E7EB",
    heading: "#2A4163",
    highlight: brightGreen,
    pillBackground: lightGray,
    pillValue: darkGray,
    tooltipBackground: "#132c52",
    violationReasons: {
      [VIOLATION_TYPES.abscond]: "#327672",
      [VIOLATION_TYPES.offend]: "#659795",
      [VIOLATION_TYPES.technical]: darkGreen,
      [VIOLATION_TYPES.unknown]: "#97b9b7",
    },
  },
  fonts: {
    body: bodyMedium,
    bodyBold,
    display: displayBold,
    displayMedium,
  },
  maps: {
    // these are style objects that we can pass directly to react-simple-maps
    default: {
      fill: "#D6E3E2",
      stroke: white,
      strokeWidth: 1.5,
    },
  },
  mapMarkers: {
    default: {
      fill: darkGreen,
      fillOpacity: 0.8,
      stroke: white,
      strokeWidth: 1,
    },
    hover: {
      fill: brightGreen,
    },
    pressed: {
      fill: darkGreen,
    },
  },
  zIndex: {
    base: 1,
    menu: 10,
    tooltip: 50,
    modal: 100,
  },
};
