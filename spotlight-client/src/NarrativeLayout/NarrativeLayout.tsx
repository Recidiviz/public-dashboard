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
import { range } from "d3-array";
import { rem } from "polished";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { X_PADDING } from "../SystemNarrativePage/constants";
import NarrativeNavigation from "./NarrativeNavigation";
import NarrativeSection from "./NarrativeSection";
import { LayoutSection } from "./types";
import { InjectedProps, withNarrativeParams } from "./withNarrativeParams";

const Wrapper = styled.article`
  display: flex;
`;

const NavWrapper = styled.div`
  flex: 0 0 auto;
  width: ${rem(X_PADDING)};
`;

const NavStickyWrapper = styled.div`
  display: flex;
  height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  position: sticky;
  top: ${rem(NAV_BAR_HEIGHT)};
`;

const SectionsWrapper = styled.div`
  /* flex-basis needs to be set or contents may overflow in IE 11 */
  flex: 1 1 100%;
  /* min-width cannot be auto or children will not shrink when viewport does */
  min-width: 0;
`;

type NarrativeLayoutProps = InjectedProps & {
  sections: LayoutSection[];
};

const NarrativeLayout: React.FC<NarrativeLayoutProps> = ({
  navigateToSection,
  sectionNumber,
  sections,
}) => {
  const sectionsContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const isMobile = useBreakpoint(false, ["mobile-", true]);
  const showSectionNavigation = !isMobile;

  const scrollToSection = useCallback(
    (targetSection: number) => {
      const sectionEl = sectionsContainerRef.current.querySelector(
        `#section${targetSection}`
      );

      if (sectionEl) {
        const { top } = sectionEl.getBoundingClientRect();
        // NOTE: we are using a polyfill to make sure this method works in all browsers;
        // native support is spotty as of this writing
        window.scrollBy({
          top: top - NAV_BAR_HEIGHT,
          behavior: "smooth",
        });
      }
    },
    [sectionsContainerRef]
  );

  // needed for handling direct section links without layout jank
  const [initialSection] = useState(sectionNumber);
  // if we have navigated directly to a section, bring it into the viewport;
  // this should only run once when the component first mounts
  useEffect(() => {
    scrollToSection(initialSection);
  }, [initialSection, navigateToSection, scrollToSection]);

  // when navigating directly to a section at page load, we will
  // restrict the heights of any sections above it
  // to prevent them from pushing other content down the page as they load
  const [fixedHeightSections, setFixedHeightSections] = useState(
    range(1, initialSection)
  );

  // remove sections from the fixed-height list as we pass through their range;
  // retain any still above the current section until we get all the way to the top
  useEffect(() => {
    const fixedHeightEnd = Math.min(sectionNumber, initialSection);
    if (fixedHeightSections.length) {
      setFixedHeightSections(
        // make sure we don't add any sections back when we scroll down again
        range(1, fixedHeightEnd).slice(0, fixedHeightSections.length)
      );
    }
  }, [sectionNumber, initialSection, fixedHeightSections.length]);

  // some navigation features need to be disabled until we have made sure
  // the initial section indicated by the URL is in the viewport, so let's keep track of that
  const [initialScrollComplete, setInitialScrollComplete] = useState(
    // if we have landed on the first section there won't be any initial scroll
    initialSection === 1
  );

  return (
    <Wrapper>
      {showSectionNavigation && (
        <NavWrapper>
          <Sticker>
            <NavStickyWrapper>
              <NarrativeNavigation
                activeSection={sectionNumber}
                goToSection={scrollToSection}
                sections={sections}
              />
            </NavStickyWrapper>
          </Sticker>
        </NavWrapper>
      )}
      <SectionsWrapper ref={sectionsContainerRef}>
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
                if (inView) {
                  if (initialScrollComplete) {
                    navigateToSection(pageId);
                  } else if (pageId === initialSection) {
                    navigateToSection(pageId);
                    scrollToSection(pageId);
                    setInitialScrollComplete(true);
                  }
                }
              }}
            >
              <NarrativeSection
                restrictHeight={fixedHeightSections.includes(pageId)}
              >
                {section.contents}
              </NarrativeSection>
            </InView>
          );
        })}
      </SectionsWrapper>
    </Wrapper>
  );
};

export default withNarrativeParams(NarrativeLayout);
