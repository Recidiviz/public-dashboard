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
  raceAndGender: "raceAndGender",
  total: "total",
};

export const DATA_KEY_TRANSLATIONS = {
  [DIMENSION_KEYS.gender]: "gender",
  [DIMENSION_KEYS.age]: "age_bucket",
  [DIMENSION_KEYS.race]: "race_or_ethnicity",
};

export const DIMENSIONS = {
  [DIMENSION_KEYS.age]: "Age",
  [DIMENSION_KEYS.gender]: "Gender",
  [DIMENSION_KEYS.race]: "Race",
  [DIMENSION_KEYS.raceAndGender]: "Race & Gender",
  [DIMENSION_KEYS.total]: "Total",
};

export const DIMENSIONS_LIST = [
  { id: DIMENSION_KEYS.total, label: DIMENSIONS.total },
  { id: DIMENSION_KEYS.race, label: DIMENSIONS.race },
  { id: DIMENSION_KEYS.gender, label: DIMENSIONS.gender },
  { id: DIMENSION_KEYS.raceAndGender, label: DIMENSIONS.raceAndGender },
  { id: DIMENSION_KEYS.age, label: DIMENSIONS.age },
];

export const AGES = {
  "<25": "<25",
  "25-29": "25-29",
  "30-34": "30-34",
  "35-39": "35-39",
  "40<": "40<",
};

export const GENDERS = {
  FEMALE: "Female",
  MALE: "Male",
};

export const RACES = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: "American Indian or Alaskan Native",
  ASIAN: "Asian",
  BLACK: "Black",
  HISPANIC: "Hispanic",
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: "Native Hawaiian or Pacific Islander",
  OTHER: "Other",
  WHITE: "White",
};

export const VIOLATION_TYPES = {
  ABSCONDED: "Absconsion",
  FELONY: "New Offense",
  TECHNICAL: "Technical Violation",
  EXTERNAL_UNKNOWN: "Unknown Type",
};

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
const displayNormal = `400 ${displayFontSize}/${displayLineHeight} ${displayFontFamily}`;

const darkBlue = "#132C52";

const brightGreen = "#25b894";

// The numbers behind the "darkGreen" colors represent an opacity
// percentage when using #FCFCFC as a background color.  Example,
// 9 === 0.9 opacity.
const darkGreen = "#005450";
const darkGreen9 = "#196561";
const darkGreen8 = "#327672";
const darkGreen7 = "#4C8684";
const darkGreen6 = "#659795";
const darkGreen5 = "#7EA8A6";
const darkGreen4 = "#97B9B7";
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
    age: {
      "<25": darkGreen,
      "25-29": darkGreen9,
      "30-34": darkGreen8,
      "35-39": darkGreen7,
      "40<": darkGreen6,
    },
    background: "#FCFCFC",
    body: "#707F96",
    bodyLight: white,
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
    race: {
      AMERICAN_INDIAN_ALASKAN_NATIVE: darkGreen,
      ASIAN: darkGreen9,
      BLACK: darkGreen8,
      HISPANIC: darkGreen7,
      NATIVE_HAWAIIAN_PACIFIC_ISLANDER: darkGreen6,
      OTHER: darkGreen5,
      WHITE: darkGreen4,
    },
    statistic: darkBlue,
    tooltipBackground: darkBlue,
    violationReasons: {
      ABSCONDED: "#327672",
      FELONY: "#659795",
      TECHNICAL: darkGreen,
      EXTERNAL_UNKNOWN: "#97b9b7",
    },
  },
  fonts: {
    body: bodyMedium,
    bodyBold,
    display: displayBold,
    displayMedium,
    displayNormal,
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
