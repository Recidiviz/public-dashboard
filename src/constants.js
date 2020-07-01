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
const bodyFontWeight = 500;

const displayFontFamily = "'Poppins', sans-serif";
const displayFontWeight = 600;
const displayLineHeight = 1.3;

export const THEME = {
  bodyFont: `${bodyFontWeight} ${bodyFontSize}/${bodyLineHeight} ${bodyFontFamily}`,
  bodyFontFamily,
  bodyFontSize,
  bodyLineHeight,
  bodyFontWeight,
  colors: {
    // descriptive
    blue: "#3e8df7",
    // functional
    background: "#FAFAFA",
    body: "rgba(90, 101, 117, 0.9)",
    heading: "rgba(39, 43, 49, 0.9)",
  },
  // font size is inline because it's really just a placeholder
  displayFont: `${displayFontWeight} 1.6em/${displayLineHeight} ${displayFontFamily}`,
  displayFontFamily,
  displayFontWeight,
  displayLineHeight,
};
