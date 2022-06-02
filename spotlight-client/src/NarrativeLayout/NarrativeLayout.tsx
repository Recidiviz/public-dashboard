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

import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/macro";
import Wayfinder from "./NarrativeNavigation";
import NarrativeSection from "./NarrativeSection";
import { LayoutSection } from "./types";
import { useInternalNavigation } from "./useInternalNavigation";

const Wrapper = styled.div`
  display: flex;
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
  const {
    alwaysExpanded,
    currentSectionNumber,
    fixedHeightSections,
    scrollToSection,
    sectionsContainerRef,
    onSectionInViewChange,
  } = useInternalNavigation();

  return (
    <Wrapper>
      <Wayfinder
        activeSection={currentSectionNumber}
        sections={sections}
        goToSection={scrollToSection}
      />
      <SectionsWrapper ref={sectionsContainerRef}>
        {sections.map((section, index) => {
          // 1-indexed for human readability
          const sectionNumber = index + 1;

          return (
            <div id={`section${sectionNumber}`} key={sectionNumber}>
              <NarrativeSection
                alwaysExpanded={alwaysExpanded}
                onInViewChange={onSectionInViewChange}
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
