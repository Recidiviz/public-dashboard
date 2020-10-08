import { css } from "styled-components";

import { CUSTOM_BREAKPOINTS } from "../constants";

const [mobileMin] = CUSTOM_BREAKPOINTS.mobile;
const [desktopMin] = CUSTOM_BREAKPOINTS.desktop;

export default function fluidFontSizeStyles(minFontSize, maxFontSize) {
  return css`
    /*
      Fluid typography technique to scale text size by viewport from min to max
      https://css-tricks.com/simplified-fluid-typography/
    */
    font-size: ${minFontSize}px;

    @media screen and (min-width: ${mobileMin}px) {
      font-size: calc(
        ${minFontSize}px + ${maxFontSize - minFontSize} *
          ((100vw - ${mobileMin}px) / ${desktopMin - mobileMin})
      );
    }

    @media screen and (min-width: ${desktopMin}px) {
      font-size: ${maxFontSize}px;
    }
  `;
}
