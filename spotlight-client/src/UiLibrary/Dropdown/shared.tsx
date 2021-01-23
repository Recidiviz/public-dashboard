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

import styled, { css } from "styled-components/macro";
import { colors } from "../colors";

import { PillContainer, PillValue } from "../Pill";

export const controlTypeProperties = css`
  font-size: 13px;
`;

export const ControlContainer = styled(PillContainer)`
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
  }
`;

export const ControlLabel = styled.span`
  color: ${colors.text};
  display: inline-block;
  font: ${(props) => props.theme.fonts.bodyBold};
  font-size: 13px;
  margin-right: 8px;
`;

export const ControlValue = styled(PillValue)``;

export const DropdownWrapper = styled(ControlContainer)`
  position: relative;
  z-index: ${(props) => props.theme.zIndex.control};

  &.Dropdown--highlighted {
    ${ControlValue} {
      background: ${(props) => props.theme.colors.highlight};
      color: ${(props) => props.theme.colors.bodyLight};
    }
  }

  &.Dropdown--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const DropdownMenu = styled.div`
  ${controlTypeProperties}

  background: ${(props) => props.theme.colors.controlBackground};
  border-radius: 15px;
  list-style: none;
  padding: 12px 0;
  position: relative;
  white-space: nowrap;
  z-index: ${(props) => props.theme.zIndex.menu};
`;

export const DropdownMenuItem = styled.div<{
  highlightedSelector?: string;
  highlightColor?: string;
}>`
  cursor: pointer;
  padding: 6px 18px;
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};

  /*
    because we use multiple dropdown libraries that represent menu UI states
    in different ways, taking a selector as a prop lets us target highlight state generically
  */
  &:hover${(props) =>
      props.highlightedSelector ? `, ${props.highlightedSelector}` : ""} {
    background: ${(props) => props.highlightColor || colors.accent};
    color: ${colors.textLight};
  }
`;

export const HiddenSelect = styled.select`
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;
