// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { rem } from "polished";
import { breakpoints } from ".";

export const typefaces = {
  body: "'Libre Franklin', sans-serif",
  display: "'Libre Baskerville', serif",
};

const [mobileMin] = breakpoints.mobile;
const [desktopMin] = breakpoints.desktop;

/**
 * Implements fluid typography technique to scale text size
 * by viewport from min to max
 * @see <https://css-tricks.com/simplified-fluid-typography/>
 */
export function fluidFontSizeStyles(
  minFontSize: number,
  maxFontSize: number
): string {
  return `
    font-size: ${rem(minFontSize)};

    @media screen and (min-width: ${mobileMin}px) {
      font-size: calc(
        ${rem(minFontSize)} + ${rem(maxFontSize - minFontSize)} *
          ((100vw - ${rem(mobileMin)}) / ${desktopMin - mobileMin})
      );
    }

    @media screen and (min-width: ${desktopMin}px) {
      font-size: ${rem(maxFontSize)};
    }
  `;
}
