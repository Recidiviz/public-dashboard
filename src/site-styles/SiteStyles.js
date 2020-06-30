import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const SiteStyles = createGlobalStyle`
  ${normalize}

  /*
    apply a natural box layout model to all elements with minimal specificity,
    allowing components to override easily
  */
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    background: #FAFAFA;
  }
`;

export default SiteStyles;
