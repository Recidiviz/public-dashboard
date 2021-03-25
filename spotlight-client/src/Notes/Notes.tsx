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
import React from "react";
import styled from "styled-components/macro";
import { colors } from "../UiLibrary";

const Wrapper = styled.ol`
  color: ${colors.caption};
  font-size: ${rem(13)};
  font-weight: 500;
  line-height: 1.7;
  list-style: decimal outside;
  margin-top: ${rem(40)};
  padding-left: 1em;
`;

const Item = styled.li`
  margin-bottom: 1em;
  padding-left: 0.5em;
`;

/**
 * Renders children as an ordered list of foot- or endnotes.
 */
const Notes: React.FC = ({ children }) => {
  return (
    <Wrapper>
      {React.Children.map(children, (child) => child && <Item>{child}</Item>)}
    </Wrapper>
  );
};

export default Notes;
