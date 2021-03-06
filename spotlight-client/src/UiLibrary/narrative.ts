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
import breakpoints from "./breakpoints";
import colors from "./colors";
import CopyBlock from "./CopyBlock";
import PageSection from "./PageSection";
import { typefaces } from "./typography";

export const NarrativeIntroContainer = styled(PageSection)`
  border-bottom: 1px solid ${colors.rule};
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  padding-top: ${rem(48)};
  padding-bottom: ${rem(48)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    padding-bottom: ${rem(172)};
    padding-left: 0;
    padding-top: ${rem(160)};
  }
`;

export const NarrativeTitle = styled.h1`
  font-family: ${typefaces.display};
  font-size: ${rem(32)};
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: ${rem(24)};

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

export const NarrativeScrollIndicator = styled.div`
  align-items: center;
  color: ${colors.caption};
  display: flex;
  flex-direction: column;
  font-size: ${rem(12)};
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-top: ${rem(32)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    margin-top: ${rem(144)};
  }

  span {
    margin-bottom: ${rem(16)};
  }
`;

export const NarrativeSectionTitle = styled.h2`
  font-family: ${typefaces.display};
  font-size: ${rem(24)};
  line-height: 1.25;
  letter-spacing: -0.04em;
  margin-bottom: ${rem(24)};
`;

export const NarrativeSectionBody = styled.div`
  line-height: 1.67;
`;
