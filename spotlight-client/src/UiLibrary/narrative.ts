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

import { palette, typography } from "@recidiviz/design-system";
import { rem } from "polished";
import styled from "styled-components/macro";
import breakpoints from "./breakpoints";
import colors from "./colors";
import CopyBlock from "./CopyBlock";
import { FullScreenSection } from "./PageSection";
import PageTitle from "./PageTitle";

export const NarrativeIntroContainer = styled(FullScreenSection)`
  padding-top: ${rem(48)};
  padding-bottom: ${rem(48)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    padding-bottom: ${rem(172)};
    padding-top: ${rem(160)};
  }
`;

export const NarrativeTitle = styled(PageTitle)`
  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    ${typography.Header88}
  }
`;

export const NarrativeIntroCopy = styled(CopyBlock)`
  ${typography.Body19}
  color: ${palette.slate85};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    ${typography.Body48}
  }
`;

export const NarrativeSectionTitle = styled.h2`
  ${typography.Header24}
  color: ${colors.text};
`;

export const NarrativeSectionBody = styled(CopyBlock)`
  color: ${palette.slate85};
`;
