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

import { navigate, useParams } from "@reach/router";
import useBreakpoint from "@w11r/use-breakpoint";
import { range } from "d3-array";
import { rem } from "polished";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { InView } from "react-intersection-observer";
import { useGesture } from "react-use-gesture";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import getUrlForResource from "../routerUtils/getUrlForResource";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import { X_PADDING } from "../SystemNarrativePage/constants";
import NarrativeNavigation from "./NarrativeNavigation";
import SectionPlaceholder from "./SectionPlaceholder";
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
  const routeParams = useParams();
  const { tenantId, narrativeTypeId } = normalizeRouteParams(routeParams);
  const sectionsContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const showSectionNavigation = useBreakpoint(true, ["mobile-", false]);

  // TODO: this should be in the normalize function?
  const sectionNumber = Number(routeParams.sectionNumber) || 1;
  // make sure we consume the section number in the URL, if any, on first mount
  const [initialSection] = useState(sectionNumber);
  const [sectionInView, setSectionInView] = useState(sectionNumber);

  const [placeholderSections, setPlaceholderSections] = useState(
    range(1, initialSection)
  );

  // remove sections from the placeholder list as we pass through their range
  useEffect(() => {
    const placeholderEnd = Math.min(sectionNumber, initialSection);
    if (placeholderSections.length) {
      setPlaceholderSections(range(1, placeholderEnd));
    }
  }, [sectionNumber, initialSection, placeholderSections.length]);

  const navigateToSection = useCallback(
    (newSectionNumber: number) => {
      // these should always exist, this is just for type safety
      if (tenantId && narrativeTypeId) {
        navigate(
          getUrlForResource({
            page: "narrative",
            params: {
              tenantId,
              narrativeTypeId,
              sectionNumber: newSectionNumber,
            },
          }),
          { replace: true }
        );
      }
    },
    [narrativeTypeId, tenantId]
  );

  useEffect(() => {
    if (sectionInView !== sectionNumber) {
      navigateToSection(sectionInView);
    }
  }, [navigateToSection, sectionInView, sectionNumber]);

  const scrollToSection = useCallback((targetSection: number) => {
    const sectionEl = sectionsContainerRef.current.querySelector(
      `#section${targetSection}`
    );

    if (sectionEl) {
      const { top } = sectionEl.getBoundingClientRect();
      window.scrollBy({
        top: top - NAV_BAR_HEIGHT,
        behavior: "smooth",
      });
    }
  }, []);

  // if we have landed on the first section there won't be any initial scroll
  const [initialScrollComplete, setInitialScrollComplete] = useState(
    initialSection === 1
  );
  useGesture(
    {
      onScrollEnd: () => {
        // the first scroll event should be the automatic one
        if (!initialScrollComplete) setInitialScrollComplete(true);
      },
    },
    { domTarget: window }
  );
  useLayoutEffect(
    () => {
      scrollToSection(initialSection);
    },
    // this should only run once when the component first mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Wrapper>
      {showSectionNavigation && (
        <NavContainer>
          <Sticker>
            <NavStickyContainer>
              <NarrativeNavigation
                activeSection={sectionInView}
                goToSection={scrollToSection}
                sections={sections}
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
                if (initialScrollComplete && inView) setSectionInView(pageId);
              }}
            >
              {placeholderSections.includes(pageId) ? (
                <SectionPlaceholder />
              ) : (
                section.contents
              )}
            </InView>
          );
        })}
      </SectionsContainer>
    </Wrapper>
  );
};

export default NarrativeLayout;
