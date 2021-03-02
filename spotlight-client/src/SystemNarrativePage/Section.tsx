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

import useBreakpoint from "@w11r/use-breakpoint";
import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import Metric from "../contentModels/Metric";
import { SystemNarrativeSection } from "../contentModels/SystemNarrative";
import { MetricRecord } from "../contentModels/types";
import MetricVizMapper from "../MetricVizMapper";
import { breakpoints, colors, typefaces } from "../UiLibrary";
import { X_PADDING } from "./constants";

const COPY_WIDTH = 408;

const Container = styled.section`
  border-bottom: 1px solid ${colors.rule};
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  padding: 0 ${rem(16)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0;
    padding-right: ${rem(X_PADDING)};
  }

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    align-items: flex-start;
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const SectionCopy = styled.div<{ $isSticky: boolean }>`
  overflow: hidden;
  padding-top: ${rem(40)};

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    align-self: flex-start;
    display: flex;
    flex: 0 1 30%;
    flex-direction: column;
    height: ${(props) =>
      props.$isSticky ? `calc(100vh - ${rem(NAV_BAR_HEIGHT)})` : "auto"};
    justify-content: center;
    max-width: ${rem(COPY_WIDTH)};
    padding-bottom: ${rem(40)};
    position: ${(props) => (props.$isSticky ? "sticky" : "static")};
    top: ${rem(NAV_BAR_HEIGHT)};
  }

  p {
    margin-top: 1em;
  }
`;

const CopyOverflowIndicator = styled.div``;

const SectionTitle = styled.h2`
  font-family: ${typefaces.display};
  font-size: ${rem(24)};
  line-height: 1.25;
  letter-spacing: -0.04em;
  margin-bottom: ${rem(24)};
`;

const SectionBody = styled.div`
  line-height: 1.67;
`;

const VizContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* min-width cannot be auto or children will not shrink when viewport does */
  min-width: ${rem(320)};
  padding: ${rem(32)} 0;

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    flex: 1 1 auto;
    margin-left: 8%;
    min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  }
`;

const SectionViz: React.FC<{ metric: Metric<MetricRecord> }> = ({ metric }) => {
  return (
    <VizContainer>
      <MetricVizMapper metric={metric} />
    </VizContainer>
  );
};

const Section: React.FC<{ section: SystemNarrativeSection }> = ({
  section,
}) => {
  // on large screens, we want the left column of copy to be sticky
  // while the visualization scrolls (if it's taller than one screen, which many are).
  // But if the COPY is also taller than one screen we don't want it to be sticky
  // or you won't actually be able to read all of it. We won't know that until
  // we render it, so we have to detect a copy overflow and disable the sticky
  // behavior if it happens.
  const isDesktop = useBreakpoint(false, ["desktop+", true]);

  const copyContainerRef = useRef<HTMLDivElement>(null);

  const { ref: overflowRef, inView } = useInView({
    root: copyContainerRef.current,
  });

  const [isCopySticky, setIsCopySticky] = useState(false);

  // to prevent an endless loop of sticking and unsticking,
  // keep track of whether we've tried to make the copy sticky
  const [hasBeenSticky, setHasBeenSticky] = useState(false);

  useEffect(() => {
    if (isDesktop && inView) {
      // if inView was previously false, disabling stickiness will make it true;
      // if we re-enable stickiness it will become false again, in an endless loop.
      // checking this flag prevents us from looping
      if (!hasBeenSticky) {
        setIsCopySticky(true);
        // Unfortunately inView is ALWAYS false for the first few render cycles
        // while the DOM is being bootstrapped, so we want to set a flag the first time
        // it flips to true (on small screens we will never flip this and that's fine)
        setHasBeenSticky(true);
      }
    } else {
      setIsCopySticky(false);
    }
  }, [hasBeenSticky, inView, isDesktop]);

  return (
    <Container>
      <Sticker>
        <SectionCopy ref={copyContainerRef} $isSticky={isCopySticky}>
          <SectionTitle>{section.title}</SectionTitle>
          <SectionBody>{HTMLReactParser(section.body)}</SectionBody>
          <CopyOverflowIndicator ref={overflowRef} />
        </SectionCopy>
      </Sticker>
      <SectionViz metric={section.metric} />
    </Container>
  );
};

export default Section;
