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

import { typography } from "@recidiviz/design-system";
import { rem } from "polished";
import styled from "styled-components/macro";
import breakpoints from "./breakpoints";
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
    font-size: ${rem(88)};
    margin-bottom: ${rem(64)};
  }
`;

export const NarrativeIntroCopy = styled(CopyBlock)`
  font-size: ${rem(18)};
  line-height: 1.5;
  letter-spacing: -0.025em;

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    font-size: ${rem(48)};
  }
`;

export const NarrativeSectionTitle = styled.h2`
  ${typography.Header24}
`;

export const NarrativeSectionBody = styled(CopyBlock)`
  line-height: 1.67;
`;
