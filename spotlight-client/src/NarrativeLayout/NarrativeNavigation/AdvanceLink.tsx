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
import NavigationLink from "../../NavigationLink";
import { colors, Chevron } from "../../UiLibrary";

const StyledNavLink = styled(NavigationLink)`
  padding: ${rem(8)};
`;

type AdvanceLinkProps = {
  activeSection: number;
  disabled: boolean;
  type: "previous" | "next";
  urlBase: string;
};

const AdvanceLink: React.FC<AdvanceLinkProps> = ({
  activeSection,
  disabled,
  type,
  urlBase,
}) => {
  let targetSection;
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
    <StyledNavLink
      to={`${urlBase}/${targetSection}`}
      disabled={disabled}
      aria-label={`${type} section`}
      onMouseOver={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onBlur={() => setHovered(false)}
    >
      <Chevron direction={direction} faded={disabled} color={color} />
    </StyledNavLink>
  );
};

export default AdvanceLink;
