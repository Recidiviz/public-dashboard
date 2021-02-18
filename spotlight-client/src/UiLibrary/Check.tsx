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
import { colors } from ".";

type CheckProps = {
  visible: boolean;
};

const Check: React.FC<CheckProps> = ({ visible }) => {
  const animatedStyles = useSpring({
    opacity: visible ? 1 : 0,
    visibility: visible ? "visible" : "hidden",
  });

  return (
    <animated.svg
      width="12"
      height="12"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={animatedStyles}
    >
      <path d="M1 4.5L3 7L7 1" stroke={colors.textLight} />
    </animated.svg>
  );
};

export default Check;
