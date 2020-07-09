import hexAlpha from "hex-alpha";

export const DEFAULT_TENANT = "us_nd";

export const PATHS = {
  overview: "overview",
  parole: "parole",
  prison: "prison",
  probation: "probation",
  sentencing: "sentencing",
};

export const TOTAL_KEY = "ALL";

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
    darkerGreen,
    // functional
    background: "#FCFCFC",
    body: "#707F96",
    bodyLight: white,
    controlBackground: lightGray,
    controlLabel: "#3D4045",
    controlValue: darkGray,
    footer: hexAlpha("#E5ECEC", 0.6),
    divider: "#E5E7EB",
    heading: "#2A4163",
    highlight: brightGreen,
    pillBackground: lightGray,
    pillValue: darkGray,
    tooltipBackground: "#132c52",
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
  // Spacing Scale copied from Tailwind:
  // https://tailwindcss.com/docs/customizing-spacing/#default-spacing-scale
  spacing: {
    px: "1px",
    "0": "0",
    "1": "0.25rem", // 4px
    "2": "0.5rem", // 8px
    "3": "0.75rem", // 12px
    "4": "1rem", // 16px
    "5": "1.25rem", // 20px
    "6": "1.5rem", // 24px
    "8": "2rem", // 32px
    "10": "2.5rem", // 40px
    "12": "3rem", // 48px
    "16": "4rem", // 64px
    "20": "5rem", // 80px
    "24": "6rem", // 96px
    "32": "8rem", // 128px
    "40": "10rem", // 160px
    "48": "12rem", // 192px
    "56": "14rem", // 224px
    "64": "16rem", // 256px
    "70": "18rem", // 288px
    "74": "20rem", // 320px
  },
  zIndex: {
    base: 1,
    menu: 10,
    tooltip: 50,
    modal: 100,
  },
};
