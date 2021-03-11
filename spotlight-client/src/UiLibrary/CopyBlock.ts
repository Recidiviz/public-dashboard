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

import styled from "styled-components/macro";
import colors from "./colors";
import { dynamicTextClass } from "./dynamicText";

export default styled.div`
  p {
    margin-top: 1em;
  }

  a {
    color: ${colors.accent};
  }

  ul {
    list-style: outside;
    margin-top: 1em;
    padding-left: 1.2em;
  }

  li {
    margin-top: 0.5em;
  }

  /* footnotes */
  sup {
    font-size: 0.6em;
    vertical-align: super;
  }
  aside {
    font-size: 0.7em;
    margin-top: 1.4em;
  }

  .${dynamicTextClass} {
    color: ${colors.dynamicText};
    font-weight: 600;
  }
`;
