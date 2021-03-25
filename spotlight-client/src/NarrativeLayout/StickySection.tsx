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
import { rem } from "polished";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { breakpoints, CopyBlock, FullScreenSection } from "../UiLibrary";

const Container = styled(FullScreenSection)`
  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0;
  }

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    /* grid properties do not get auto-prefixed for IE during build */
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: minmax(${rem(250)}, 30%) 1fr;
    grid-template-columns: minmax(${rem(250)}, 30%) 1fr;
  }
`;

const LeftContainer = styled(CopyBlock)<{ $isSticky: boolean }>`
  overflow: hidden;
  padding-top: ${rem(40)};

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    display: flex;
    flex-direction: column;
    -ms-grid-column: 1;
    grid-column: 1;
    height: ${(props) =>
      props.$isSticky ? `calc(100vh - ${rem(NAV_BAR_HEIGHT)})` : "auto"};
    justify-content: center;
    padding-bottom: ${rem(40)};
    position: ${(props) => (props.$isSticky ? "sticky" : "static")};
    top: ${rem(NAV_BAR_HEIGHT)};
  }
`;

const StickyOverflowIndicator = styled.div``;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${rem(32)} 0;

  @media screen and (min-width: ${breakpoints.desktop[0]}px) {
    -ms-grid-column: 2;
    grid-column: 2;
    margin-left: 8%;
    min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  }
`;

const StickySection: React.FC<{
  leftContents: React.ReactElement;
  rightContents: React.ReactElement;
}> = ({ leftContents, rightContents }) => {
  // on large screens, we want the left column to be sticky while the
  // right column scrolls (if it's taller than one screen, which many are).
  // But if the left column is ALSO taller than one screen we don't want it to be sticky
  // or you won't actually be able to see all of it. We won't know that until
  // we render it, so we have to detect a vertical overflow and disable the sticky
  // behavior if it happens.
  const isDesktop = useBreakpoint(false, ["desktop+", true]);

  const copyContainerRef = useRef<HTMLDivElement>(null);

  const { ref: overflowRef, inView } = useInView({
    root: copyContainerRef.current,
  });

  const [isLeftSticky, setIsLeftSticky] = useState(false);

  // to prevent an endless loop of sticking and unsticking,
  // keep track of whether we've tried to make the copy sticky
  const [hasBeenSticky, setHasBeenSticky] = useState(false);

  useEffect(() => {
    if (isDesktop && inView) {
      // if inView was previously false, disabling stickiness will make it true;
      // if we re-enable stickiness it will become false again, in an endless loop.
      // checking this flag prevents us from looping
      if (!hasBeenSticky) {
        setIsLeftSticky(true);
        // Unfortunately inView is ALWAYS false for the first few render cycles
        // while the DOM is being bootstrapped, so we want to set a flag the first time
        // it flips to true (on small screens we will never flip this and that's fine)
        setHasBeenSticky(true);
      }
    } else {
      setIsLeftSticky(false);
    }
  }, [hasBeenSticky, inView, isDesktop]);

  return (
    <Container>
      <Sticker>
        <LeftContainer ref={copyContainerRef} $isSticky={isLeftSticky}>
          <div>
            {leftContents}
            <StickyOverflowIndicator ref={overflowRef} />
          </div>
        </LeftContainer>
      </Sticker>
      <RightContainer>{rightContents}</RightContainer>
    </Container>
  );
};

export default StickySection;
