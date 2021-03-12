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

import { Link } from "@reach/router";
import { rem } from "polished";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { colors, zIndex } from "../UiLibrary";

export const NavContainer = styled.nav`
  background: ${colors.background};
  height: ${rem(NAV_BAR_HEIGHT)};
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: ${zIndex.header};
`;

export const NavBar = styled.div`
  align-items: stretch;
  border-bottom: 1px solid ${colors.rule};
  display: flex;
  height: ${rem(NAV_BAR_HEIGHT)};
  justify-content: space-between;
  padding: 0 ${rem(32)};
  width: 100%;
`;

export const NavGroup = styled.ul`
  align-items: stretch;
  display: flex;
`;

export const NavGroupItem = styled.li`
  align-items: center;
  display: flex;
`;

export const NavLink = styled(Link)`
  align-items: center;
  color: ${colors.text};
  display: flex;
  height: 100%;
  position: relative;
  text-decoration: none;
`;
