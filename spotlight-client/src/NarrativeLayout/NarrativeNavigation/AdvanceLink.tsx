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
import React, { useState } from "react";
import styled from "styled-components/macro";
import { colors, Chevron, UnStyledButton } from "../../UiLibrary";
import { SectionNavProps } from "./types";

const NavLink = styled(UnStyledButton)`
  padding: ${rem(8)};
`;

type AdvanceLinkProps = SectionNavProps & {
  disabled: boolean;
  type: "previous" | "next";
};

const AdvanceLink: React.FC<AdvanceLinkProps> = ({
  activeSection,
  disabled,
  goToSection,
  type,
}) => {
  let targetSection: number;
  let direction: "up" | "down";

  if (type === "previous") {
    targetSection = activeSection - 1;
    direction = "up";
  } else {
    targetSection = activeSection + 1;
    direction = "down";
  }

  const [hovered, setHovered] = useState(false);

  const color = hovered && !disabled ? colors.accent : undefined;

  return (
    <NavLink
      disabled={disabled}
      onClick={() => !disabled && goToSection(targetSection)}
      aria-label={`${type} section`}
      onMouseOver={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onBlur={() => setHovered(false)}
    >
      <Chevron direction={direction} faded={disabled} color={color} />
    </NavLink>
  );
};

export default AdvanceLink;
