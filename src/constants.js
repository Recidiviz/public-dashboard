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

export const SITE_TITLE = "North Dakota Corrections and Rehabilitation";

export const SECTION_TITLES = {
  [PATHS.sentencing]: {
    population: "Who is being sentenced?",
    types: "What types of sentences do people receive?",
  },
  [PATHS.prison]: {
    population: "Who is in custody?",
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

export const AGES = new Map([
  [AGE_KEYS.under25, "<25"],
  [AGE_KEYS["25_29"], "25-29"],
  [AGE_KEYS["30_34"], "30-34"],
  [AGE_KEYS["35_39"], "35-39"],
  [AGE_KEYS.over40, "40<"],
  ...DEMOGRAPHIC_UNKNOWN_MAPPING,
]);

export const GENDERS = new Map([
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

// these are overrides to defaults in @w11r/use-breakpoint
export const CUSTOM_BREAKPOINTS = {
  mobile: [320, 767],
  tablet: [768, 1023],
  desktop: [1024, 1279],
  xl: [1280, 10000],
};

export const COLLAPSIBLE_NAV_BREAKPOINT = "mobile-";

export const BODY_FONT_SIZE = 16;
