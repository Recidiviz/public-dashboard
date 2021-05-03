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
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { X_PADDING } from "../SystemNarrativePage/constants";
import NarrativeNavigation from "./NarrativeNavigation";
import NarrativeSection from "./NarrativeSection";
import { LayoutSection } from "./types";
import { useInternalNavigation } from "./useInternalNavigation";

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

type NarrativeLayoutProps = {
  sections: LayoutSection[];
};

const NarrativeLayout: React.FC<NarrativeLayoutProps> = ({ sections }) => {
  const showSectionNavigation = useBreakpoint(true, ["mobile-", false]);

  const {
    alwaysExpanded,
    currentSectionNumber,
    enableSnapping,
    fixedHeightSections,
    scrollToSection,
    sectionsContainerRef,
    getOnSectionExpanded,
    onInViewChange,
  } = useInternalNavigation();

  return (
    <Wrapper>
      {showSectionNavigation && (
        <NavWrapper>
          <Sticker>
            <NavStickyWrapper>
              <NarrativeNavigation
                activeSection={currentSectionNumber}
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
          const sectionNumber = index + 1;

          return (
            <div
              id={`section${sectionNumber}`}
              key={sectionNumber}
              style={{
                scrollSnapAlign: enableSnapping ? "start" : undefined,
              }}
            >
              <NarrativeSection
                alwaysExpanded={alwaysExpanded}
                onInViewChange={onInViewChange}
                onSectionExpanded={getOnSectionExpanded(sectionNumber)}
                restrictHeight={fixedHeightSections.includes(sectionNumber)}
                sectionNumber={sectionNumber}
              >
                {section.contents}
              </NarrativeSection>
            </div>
          );
        })}
      </SectionsWrapper>
    </Wrapper>
  );
};

export default observer(NarrativeLayout);
