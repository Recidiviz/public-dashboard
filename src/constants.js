export const DEFAULT_TENANT = "us_nd";

export const PATHS = {
  overview: "overview",
  parole: "parole",
  prison: "prison",
  probation: "probation",
  sentencing: "sentencing",
};

export const TOTAL_KEY = "ALL";

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

export const THEME = {
  colors: {
    // descriptive
    blue: "#3e8df7",
    darkGreen: "#005450",
    // functional
    background: "#FCFCFC",
    body: "#707F96",
    controlBackground: "#ECEDEF",
    controlLabel: "#3D4045",
    controlValue: "#5A6575",
    divider: "#E5E7EB",
    heading: "#2A4163",
    highlight: "#25b894",
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
      stroke: "#FFF",
      strokeWidth: 1.5,
    },
  },
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
  },
};
