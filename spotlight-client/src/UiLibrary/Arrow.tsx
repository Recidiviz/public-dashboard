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

type ArrowProps = {
  direction: "right" | "left";
  color?: string;
};

const Arrow: React.FC<ArrowProps> = ({ color, direction }) => {
  let transform;

  if (direction === "left") {
    transform = "rotate(180 8 7)";
  }

  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.3 13.6998L7.9 12.2998L12.2 7.9998H0V5.9998H12.2L7.9 1.6998L9.3 0.299805L16 6.9998L9.3 13.6998Z"
        fill={color || "currentColor"}
        transform={transform}
      />
    </svg>
  );
};

export default Arrow;
