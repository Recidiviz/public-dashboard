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
import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import { useSpring } from "react-spring/web.cjs";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import SystemNarrative from "../contentModels/SystemNarrative";
import getUrlForResource from "../routerUtils/getUrlForResource";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import { colors, typefaces, Chevron, breakpoints } from "../UiLibrary";
import { X_PADDING } from "./constants";
import Section from "./Section";
import NarrativeNavigation from "../NarrativeNavigation";

const Container = styled.article`
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

const IntroContainer = styled.div`
  border-bottom: 1px solid ${colors.rule};
  min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  padding: ${rem(48)} ${rem(8)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    padding-bottom: ${rem(172)};
    padding-left: 0;
    padding-right: ${rem(X_PADDING)};
    padding-top: ${rem(160)};
  }
`;

const Title = styled.h1`
  font-family: ${typefaces.display};
  font-size: ${rem(32)};
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: ${rem(24)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    font-size: ${rem(88)};
    margin-bottom: ${rem(64)};
  }
`;

const IntroCopy = styled.p`
  font-size: ${rem(18)};
  line-height: 1.5;
  letter-spacing: -0.025em;

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    font-size: ${rem(48)};
  }
`;

const ScrollIndicator = styled.div`
  align-items: center;
  color: ${colors.caption};
  display: flex;
  flex-direction: column;
  font-size: ${rem(12)};
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-top: ${rem(32)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    margin-top: ${rem(144)};
  }

  span {
    margin-bottom: ${rem(16)};
  }
`;

const SectionsContainer = styled.div`
  flex: 1 1 auto;
  /* min-width cannot be auto or children will not shrink when viewport does */
  min-width: 0;
`;

const SystemNarrativePage: React.FC<{
  narrative: SystemNarrative;
}> = ({ narrative }) => {
  const routeParams = useParams();
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

  const [activeSection, directlySetActiveSection] = useState(
    // make sure we consume the section number in the URL, if any, on first mount
    Number(routeParams.sectionNumber) || 1
  );
  // wrap the section state setter in a function that respects the flag
  const setActiveSection = useCallback(
    (sectionNumber: number) => {
      if (!isScrolling) {
        directlySetActiveSection(sectionNumber);
      }
    },
    [isScrolling]
  );
  // keep section state in sync with URL if it changes externally (e.g. via nav link)
  useEffect(() => {
    directlySetActiveSection(Number(routeParams.sectionNumber) || 1);
  }, [routeParams.sectionNumber]);

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

  const { tenantId, narrativeTypeId } = normalizeRouteParams(routeParams);
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

      // these should always be defined on this page; more type safety
      if (tenantId && narrativeTypeId) {
        navigate(
          `${getUrlForResource({
            page: "narrative",
            params: { tenantId, narrativeTypeId },
          })}/${activeSection}`
        );
      }
    }
  }, [
    activeSection,
    narrativeTypeId,
    sectionsContainerRef,
    setScrollSpring,
    tenantId,
  ]);

  return (
    <Container>
      {showSectionNavigation && (
        <NavContainer>
          <Sticker>
            <NavStickyContainer>
              <NarrativeNavigation
                activeSection={activeSection}
                narrative={narrative}
              />
            </NavStickyContainer>
          </Sticker>
        </NavContainer>
      )}
      <SectionsContainer ref={sectionsContainerRef}>
        <InView
          as="div"
          id="section1"
          threshold={0.3}
          onChange={(inView) => {
            if (inView) setActiveSection(1);
          }}
        >
          <IntroContainer>
            <Title>{narrative.title}</Title>
            <IntroCopy>{HTMLReactParser(narrative.introduction)}</IntroCopy>
            <ScrollIndicator>
              <span>SCROLL</span>
              <Chevron direction="down" faded />
              <Chevron direction="down" />
            </ScrollIndicator>
          </IntroContainer>
        </InView>

        {narrative.sections.map((section, index) => {
          // the first viz section is "page 2"
          const pageId = index + 2;
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
              <Section section={section} />
            </InView>
          );
        })}
      </SectionsContainer>
    </Container>
  );
};

export default SystemNarrativePage;
