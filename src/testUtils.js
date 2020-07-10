import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { THEME } from "./constants";

// eslint-disable-next-line react/prop-types
const GlobalWrapper = ({ children }) => {
  // include globally expected Context providers or other required wrappers here
  return <ThemeProvider theme={THEME}>{children}</ThemeProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: GlobalWrapper, ...options });

// re-export everything from testing-library
export * from "@testing-library/react";

// override render method
export { customRender as render };

// provide original render method as a fallback if needed
export { render as renderUnwrapped };
