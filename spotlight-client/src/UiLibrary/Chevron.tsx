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

import React from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import { colors } from ".";

type ChevronProps = {
  color?: string;
  direction: "up" | "down";
  faded?: boolean;
};

const Chevron: React.FC<ChevronProps> = ({ color, direction, faded }) => {
  let transform;

  if (direction === "up") {
    transform = "rotate(180 7 3.5)";
  }

  const opacityProp = useSpring({ opacity: faded ? 0.3 : 1 });
  const colorProp = useSpring({
    color: color || colors.text,
  });

  return (
    <svg
      aria-hidden
      width="14"
      height="7"
      viewBox="0 0 14 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <animated.path
        d="M1 0.5L7 6.5L13 0.5"
        stroke={colorProp.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={opacityProp.opacity}
        transform={transform}
      />
    </svg>
  );
};

export default Chevron;
