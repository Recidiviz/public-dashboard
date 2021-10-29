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
import colors from "./colors";
import breakpoints from "./breakpoints";
import { typefaces } from "./typography";

export default styled.h1.attrs({ "data-testid": "PageTitle" })`
  font-family: ${typefaces.display};
  font-size: ${rem(32)};
  letter-spacing: -0.04em;
  line-height: 1.4;
  margin-bottom: ${rem(32)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    font-size: ${rem(52)};
  }

  a {
    color: ${colors.accent};
  }
`;
