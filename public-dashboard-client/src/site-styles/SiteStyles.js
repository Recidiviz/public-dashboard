import React from "react";
import { Helmet } from "react-helmet";
import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

import { THEME } from "../theme";

const GlobalStyles = createGlobalStyle`
  ${normalize}

  /*
    apply a natural box layout model
    to all elements with minimal specificity,
    allowing components to override easily
  */
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    background: ${THEME.colors.background};
    color: ${(props) => props.theme.colors.body};
    font: ${(props) => props.theme.fonts.body};
  }
`;

export default function SiteStyles() {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@500;600&family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyles />
    </>
  );
}
