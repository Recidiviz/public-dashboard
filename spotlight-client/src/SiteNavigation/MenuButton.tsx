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

import React from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { colors } from "../UiLibrary";

const Button = styled.button.attrs(() => ({ type: "button" }))`
  border: none;
  background: transparent;
`;

type MenuButtonProps = {
  isOpen: boolean;
};

export default function MenuButton({
  isOpen,
  ...buttonProps
}: MenuButtonProps): React.ReactElement {
  const iconProps = useSpring({
    from: { fill: colors.menuButtonClosed, secondLineY: 5 },
    fill: isOpen ? colors.menuButtonOpen : colors.menuButtonClosed,
    secondLineY: isOpen ? 0 : 5,
  });

  return (
    <Button title="Toggle navigation menu" {...buttonProps}>
      <svg
        width="24"
        height="6"
        viewBox="0 0 24 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <animated.rect width="24" height="1" fill={iconProps.fill} />
        <animated.rect
          fill={iconProps.fill}
          height="1"
          width="24"
          y={iconProps.secondLineY}
        />
      </svg>
    </Button>
  );
}
