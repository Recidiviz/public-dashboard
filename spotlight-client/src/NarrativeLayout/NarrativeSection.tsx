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

import { rem, remToPx, getValueAndUnit } from "polished";
import React, { useState } from "react";
import Measure from "react-measure";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { colors } from "../UiLibrary";

const Wrapper = styled(animated.div)`
  border-bottom: 1px solid ${colors.rule};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  overflow: hidden;
  position: relative;
`;

type NarrativeSectionProps = { restrictHeight: boolean };

/**
 * A fixed-height placeholder for sections that are not yet ready to be rendered
 */
const NarrativeSection: React.FC<NarrativeSectionProps> = ({
  children,
  restrictHeight,
}) => {
  const [contentHeight, setContentHeight] = useState(0);

  const { height } = useSpring({
    height: restrictHeight
      ? window.innerHeight - getValueAndUnit(remToPx(rem(NAV_BAR_HEIGHT)))[0]
      : contentHeight,
  });

  return (
    <Wrapper style={{ height }}>
      <Measure
        bounds
        onResize={({ bounds }) => {
          if (bounds) setContentHeight(bounds.height);
        }}
      >
        {({ measureRef }) => <div ref={measureRef}>{children}</div>}
      </Measure>
    </Wrapper>
  );
};

export default NarrativeSection;
