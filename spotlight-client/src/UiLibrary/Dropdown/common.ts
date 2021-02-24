// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import useBreakpoint from "@w11r/use-breakpoint";
import { rem } from "polished";
import { animated } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { colors } from "..";

export const BUTTON_HEIGHT = 40;

export const OptionItem = styled.li`
  cursor: pointer;

  &:first-child {
    margin-top: ${rem(8)};
  }

  &:last-child {
    margin-bottom: ${rem(8)};
  }
`;

export const OptionItemContents = styled(animated.div)`
  padding: ${rem(8)} ${rem(16)};
`;

/**
 * Colors used for option highlight states vary for small and large screens;
 * this hook encapsules the logic for figuring out which ones to use.
 */
export const useOptionColors = (): {
  base: string;
  highlight: string;
  text: string;
} => {
  const isMobile = useBreakpoint(false, ["mobile-", true]);
  return isMobile
    ? {
        base: colors.mobileMenuBackground,
        highlight: colors.accent,
        text: colors.textLight,
      }
    : {
        base: colors.buttonBackground,
        highlight: colors.buttonBackgroundHover,
        text: colors.text,
      };
};
