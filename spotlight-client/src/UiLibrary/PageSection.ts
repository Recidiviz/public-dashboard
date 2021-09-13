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

import { rem } from "polished";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { X_PADDING, X_PADDING_TABLET } from "../SystemNarrativePage/constants";
import breakpoints from "./breakpoints";

/**
 * Base styled component for all page-level content blocks.
 * Mainly handles responsive bleed margins in a consistent way.
 * (Uses padding rather than margins because many designs call for
 * borders to bleed on one or both sides)
 */
export const PageSection = styled.section`
  padding: 0 ${rem(16)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    padding: 0 ${rem(X_PADDING_TABLET)};
  }

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    padding: 0 ${rem(X_PADDING)};
  }
`;

export const FullScreenSection = styled(PageSection)`
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
`;
