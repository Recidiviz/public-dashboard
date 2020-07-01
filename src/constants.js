export const DEFAULT_TENANT = "us_nd";

export const PATHS = {
  overview: "overview",
  parole: "parole",
  prison: "prison",
  probation: "probation",
  sentencing: "sentencing",
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

export const THEME = {
  colors: {
    // descriptive
    blue: "#3e8df7",
    // functional
    background: "#FAFAFA",
    body: "rgba(90, 101, 117, 0.9)",
    controlBackground: "#F0F1F3",
    heading: "rgba(39, 43, 49, 0.9)",
  },
  fonts: {
    body: bodyMedium,
    bodyBold,
    display: displayBold,
    displayMedium,
  },
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
  },
};
