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
import animation from "../animation";
import { colors } from "../colors";

const PILL_HEIGHT = 40;

export const PillContainer = styled.div`
  align-items: center;
  display: flex;
  height: ${PILL_HEIGHT}px;
`;

export const PillValue = styled.span`
  align-items: center;
  background: ${colors.buttonBackground};
  border-radius: ${PILL_HEIGHT / 2}px;
  color: ${colors.text};
  display: inline-flex;
  font-size: 13px;
  height: ${PILL_HEIGHT}px;
  justify-content: center;
  min-width: ${PILL_HEIGHT * 1.5}px;
  padding: 8px ${PILL_HEIGHT / 2}px;
  transition: background-color ${animation.defaultDuration};

  &:hover {
    background: ${colors.buttonBackgroundHover};
  }
`;
