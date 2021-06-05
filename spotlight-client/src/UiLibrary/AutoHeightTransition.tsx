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
import Measure from "react-measure";
import { animated, useSpring } from "react-spring/web.cjs";

type VerticallyExpandableProps = {
  initialHeight?: number;
};

/**
 * A container that transitions smoothly to the height of its children
 * as they change size.
 */
export const AutoHeightTransition: React.FC<VerticallyExpandableProps> = ({
  children,
  initialHeight = 0,
}) => {
  const [containerStyles, setContainerStyles] = useSpring(() => ({
    from: { height: initialHeight },
    height: initialHeight,
    config: { friction: 40, tension: 220, clamp: true },
  }));

  return (
    <animated.div style={containerStyles}>
      <Measure
        bounds
        onResize={({ bounds }) => {
          if (bounds) setContainerStyles({ height: bounds.height });
        }}
      >
        {({ measureRef }) => <div ref={measureRef}>{children}</div>}
      </Measure>
    </animated.div>
  );
};
