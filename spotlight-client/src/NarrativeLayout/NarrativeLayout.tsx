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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import { useSpring } from "react-spring/web.cjs";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { X_PADDING } from "../SystemNarrativePage/constants";
import NarrativeNavigation from "./NarrativeNavigation";
import { LayoutSection } from "./types";

const Wrapper = styled.article`
  display: flex;
`;

const NavContainer = styled.div`
  flex: 0 0 auto;
  width: ${rem(X_PADDING)};
`;

const NavStickyContainer = styled.div`
  display: flex;
  height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  position: sticky;
  top: ${rem(NAV_BAR_HEIGHT)};
`;

export const SectionsContainer = styled.div`
  /* flex-basis needs to be set or contents may overflow in IE 11 */
  flex: 1 1 100%;
  /* min-width cannot be auto or children will not shrink when viewport does */
  min-width: 0;
`;

type NarrativeLayoutProps = {
  sections: LayoutSection[];
};

const NarrativeLayout: React.FC<NarrativeLayoutProps> = ({ sections }) => {
  const sectionsContainerRef = useRef() as React.MutableRefObject<
    HTMLDivElement
  >;
  const showSectionNavigation = useBreakpoint(true, ["mobile-", false]);

  // automated scrolling is a special case of section visibility;
  // this flag lets us suspend in-page navigation actions while it is in progress
  // (it is a local variable rather than a piece of React state because
  // the animation functions are outside the render loop and won't receive state updates)
  let isScrolling = false;
  const cancelAutoScroll = () => {
    isScrolling = false;
  };

  const [activeSection, directlySetActiveSection] = useState(1);
  // wrap the section state setter in a function that respects the flag
  const setActiveSection = useCallback(
    (sectionNumber: number) => {
      if (!isScrolling) {
        directlySetActiveSection(sectionNumber);
      }
    },
    [isScrolling]
  );

  const [, setScrollSpring] = useSpring(() => ({
    onFrame: (props: { top: number }) => {
      if (isScrolling) window.scrollTo(0, props.top);
    },
    // set the flag while animation is in progress,
    // and listen for user-initiated scrolling (which takes priority)
    onRest: () => {
      isScrolling = false;
      window.removeEventListener("wheel", cancelAutoScroll);
      window.removeEventListener("touchmove", cancelAutoScroll);
    },
    onStart: () => {
      isScrolling = true;
      window.addEventListener("wheel", cancelAutoScroll, { once: true });
      window.addEventListener("touchmove", cancelAutoScroll, { once: true });
    },
    to: { top: window.pageYOffset },
  }));

  // updating the active section has two key side effects:
  // 1. smoothly scrolling to the active section
  // 2. updating the page URL so the section can be linked to directly
  useEffect(() => {
    let scrollDestination;
    // scroll to the corresponding section by calculating its offset
    const desiredSection = sectionsContainerRef.current.querySelector(
      `#section${activeSection}`
    );
    if (desiredSection) {
      scrollDestination =
        window.pageYOffset + desiredSection.getBoundingClientRect().top;
    }

    // in practice this should always be defined, this is just type safety
    if (scrollDestination !== undefined) {
      setScrollSpring({
        to: { top: scrollDestination - NAV_BAR_HEIGHT },
        from: { top: window.pageYOffset },
        reset: true,
      });
    }
  }, [activeSection, sectionsContainerRef, setScrollSpring]);

  return (
    <Wrapper>
      {showSectionNavigation && (
        <NavContainer>
          <Sticker>
            <NavStickyContainer>
              <NarrativeNavigation
                activeSection={activeSection}
                sections={sections}
                setActiveSection={directlySetActiveSection}
              />
            </NavStickyContainer>
          </Sticker>
        </NavContainer>
      )}
      <SectionsContainer ref={sectionsContainerRef}>
        {sections.map((section, index) => {
          // 1-indexed for human readability
          const pageId = index + 1;
          return (
            <InView
              as="div"
              id={`section${pageId}`}
              key={section.title}
              threshold={0.3}
              onChange={(inView) => {
                if (inView) setActiveSection(pageId);
              }}
            >
              {section.contents}
            </InView>
          );
        })}
      </SectionsContainer>
    </Wrapper>
  );
};

export default NarrativeLayout;
