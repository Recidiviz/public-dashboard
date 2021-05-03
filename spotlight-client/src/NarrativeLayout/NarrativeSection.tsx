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
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Measure from "react-measure";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";

const Wrapper = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  overflow: hidden;
  position: relative;
`;

const InViewSensor = styled.div`
  height: 1px;
  pointer-events: none;
  position: absolute;
  visibility: hidden;
  width: 100%;
`;

type NarrativeSectionProps = {
  alwaysExpanded: boolean;
  onInViewChange: (props: { inView: boolean; sectionNumber: number }) => void;
  onSectionExpanded: () => void;
  restrictHeight: boolean;
  sectionNumber: number;
};

/**
 * A fixed-height placeholder for sections that are not yet ready to be rendered
 */
const NarrativeSection: React.FC<NarrativeSectionProps> = ({
  alwaysExpanded,
  children,
  onInViewChange,
  onSectionExpanded,
  restrictHeight,
  sectionNumber,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const actualNavBarHeight = getValueAndUnit(remToPx(rem(NAV_BAR_HEIGHT)))[0];

  const { height } = useSpring({
    height: restrictHeight
      ? window.innerHeight - actualNavBarHeight
      : contentHeight,
    onRest: () => {
      if (!restrictHeight) {
        onSectionExpanded();
      }
    },
  });

  const topSensor = useInView({
    rootMargin: `-${actualNavBarHeight}px 0px 0px 0px`,
  });
  const bottomSensor = useInView({
    rootMargin: `-${actualNavBarHeight}px 0px 0px 0px`,
  });

  useEffect(() => {
    onInViewChange({ inView: topSensor.inView, sectionNumber });
  }, [onInViewChange, sectionNumber, topSensor.inView]);

  useEffect(() => {
    onInViewChange({ inView: bottomSensor.inView, sectionNumber });
  }, [onInViewChange, bottomSensor.inView, sectionNumber]);

  return (
    <Wrapper style={alwaysExpanded ? undefined : { height }}>
      <Measure
        bounds
        onResize={({ bounds }) => {
          if (bounds) setContentHeight(bounds.height);
        }}
      >
        {({ measureRef }) => <div ref={measureRef}>{children}</div>}
      </Measure>
      <InViewSensor
        ref={topSensor.ref}
        style={{ top: `${30 + sectionNumber}vh` }}
      />
      <InViewSensor ref={bottomSensor.ref} style={{ bottom: "30vh" }} />
    </Wrapper>
  );
};

export default NarrativeSection;
