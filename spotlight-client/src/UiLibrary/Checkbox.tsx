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
import animation from "./animation";
import colors from "./colors";

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  @supports (appearance: none) {
    appearance: none;
    background: ${colors.background};
    border: 1px solid ${colors.checkbox};
    border-radius: 0.25em;
    cursor: pointer;
    display: inline-block;
    flex: 0 0 auto;
    font-size: 1em;
    height: 1em;
    margin: 0;
    margin-right: 0.7em;
    position: relative;
    transition: background ${animation.defaultDuration / 2}ms;
    vertical-align: baseline;
    width: 1em;

    &:checked {
      background: ${colors.checkbox};

      &::after {
        opacity: 1;
      }
    }

    &::after {
      color: ${colors.textLight};
      content: "✓";
      left: 0;
      line-height: 1;
      opacity: 0;
      position: absolute;
      top: 0;
      transition: opacity ${animation.defaultDuration / 2}ms;
    }
  }
`;
