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

import { Link, useParams } from "@reach/router";
import { format } from "d3-format";
import { rem } from "polished";
import React, { useEffect, useState } from "react";
import { animated, useSpring, useSprings } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import SystemNarrative from "../contentModels/SystemNarrative";
import NavigationLink from "../NavigationLink";
import getUrlForResource from "../routerUtils/getUrlForResource";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import { colors, Chevron } from "../UiLibrary";

const formatPageNum = format("02");

const THUMB_SIZE = {
  height: 22,
  paddingBottom: 4,
  width: 2,
};

const SectionNav = styled.nav`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  margin-left: ${rem(32)};
`;

const SectionNumber = styled.div`
  font-size: ${rem(13)};
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: ${rem(16)};
`;

const SectionNumberFaded = styled(SectionNumber)`
  opacity: 0.3;
`;

const PageProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${rem(24)} 0;
  position: relative;
  width: 100%;
`;

const PageProgressBar = styled.div`
  pointer-events: none;
  position: relative;
  width: ${rem(THUMB_SIZE.width)};
`;

const PageProgressTrack = styled(animated.div)`
  background: ${colors.rule};
  left: 0;
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
`;

const PageProgressThumb = styled(animated.div)`
  background: ${colors.accent};
  height: ${rem(THUMB_SIZE.height)};
  left: 0;
  position: absolute;
  width: 100%;
`;

const SectionList = styled.ul`
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const SectionListItem = styled.li``;

const SectionLink = styled(Link)`
  color: ${colors.text};
  display: flex;
  height: ${rem(THUMB_SIZE.height)};
  justify-content: center;
  margin-bottom: ${rem(THUMB_SIZE.paddingBottom)};
  position: relative;
  width: 100%;
`;

const SectionLinkBarSegment = styled(animated.div)`
  display: block;
  flex: 0 0 auto;
  height: 100%;
  width: ${rem(THUMB_SIZE.width)};
`;

const SectionLinkLabel = styled(animated.div)`
  font-size: ${rem(11)};
  left: calc(50% + ${rem(THUMB_SIZE.width)});
  letter-spacing: -0.01em;
  line-height: 1.45;
  padding-left: ${rem(16)};
  pointer-events: none;
  position: absolute;
  top: 0;
  width: ${rem(96)};
`;

const StyledNavLink = styled(NavigationLink)`
  padding: ${rem(8)};
`;

const getThumbOffset = (activeSection: number) =>
  // section numbers are 1-indexed for human readability
  (activeSection - 1) * (THUMB_SIZE.height + THUMB_SIZE.paddingBottom);

type AdvanceLinkProps = {
  activeSection: number;
  disabled: boolean;
  type: "previous" | "next";
  urlBase: string;
};

const AdvanceLink: React.FC<AdvanceLinkProps> = ({
  activeSection,
  disabled,
  type,
  urlBase,
}) => {
  let targetSection;
  let direction: "up" | "down";

  if (type === "previous") {
    targetSection = activeSection - 1;
    direction = "up";
  } else {
    targetSection = activeSection + 1;
    direction = "down";
  }

  const [hovered, setHovered] = useState(false);

  const color = hovered && !disabled ? colors.accent : undefined;

  return (
    <StyledNavLink
      to={`${urlBase}/${targetSection}`}
      disabled={disabled}
      aria-label={`${type} section`}
      onMouseOver={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onBlur={() => setHovered(false)}
    >
      <Chevron direction={direction} faded={disabled} color={color} />
    </StyledNavLink>
  );
};

type NavigationProps = {
  activeSection: number;
  narrative: SystemNarrative;
};

const SectionNavigation: React.FC<NavigationProps> = ({
  activeSection,
  narrative,
}) => {
  const { tenantId, narrativeTypeId } = normalizeRouteParams(
    useParams()
    // these keys should always be present on this page
  ) as Required<
    Pick<
      ReturnType<typeof normalizeRouteParams>,
      "tenantId" | "narrativeTypeId"
    >
  >;
  // base is the current page, minus the section number
  const urlBase = getUrlForResource({
    page: "narrative",
    params: { tenantId, narrativeTypeId },
  });

  // total includes the introduction
  const totalPages = narrative.sections.length + 1;

  // these will be used to toggle prev/next links
  const disablePrev = activeSection === 1;
  const disableNext = activeSection === totalPages;

  const progressBarHeight =
    (THUMB_SIZE.height + THUMB_SIZE.paddingBottom) * totalPages -
    // subtract one padding unit so there isn't dangling space after the last one
    THUMB_SIZE.paddingBottom;

  // animating the progress marker to track the active section
  const [thumbStyles, setThumbStyles] = useSpring(() => ({
    top: getThumbOffset(activeSection),
  }));
  useEffect(() => {
    setThumbStyles({ top: getThumbOffset(activeSection) });
  }, [activeSection, setThumbStyles]);

  // animating the progress bar background visibility
  const [trackStyles, setTrackStyles] = useSpring(() => ({ opacity: 1 }));

  // animating the section link hover states
  const [linkLabelHoverStyles, setLinkLabelHoverStyles] = useSprings(
    totalPages,
    () => ({ opacity: 0 })
  );
  const [linkBarSegmentStyles, setLinkBarSegmentStyles] = useSprings(
    totalPages,
    () => ({ background: colors.rule })
  );

  // convenience methods for animating one link's hover state at a time
  const showLinkLabel = (index: number) => () => {
    // @ts-expect-error type error in current version,
    // https://github.com/pmndrs/react-spring/issues/861
    setLinkLabelHoverStyles((springIndex: number) =>
      springIndex === index ? { opacity: 1 } : { opacity: 0 }
    );
    // @ts-expect-error type error in current version,
    // https://github.com/pmndrs/react-spring/issues/861
    setLinkBarSegmentStyles((springIndex: number) =>
      springIndex === index
        ? { background: colors.ruleHover }
        : { background: colors.rule }
    );
  };
  const hideLinkLabel = (index: number) => () => {
    // @ts-expect-error type error in current version,
    // https://github.com/pmndrs/react-spring/issues/861
    setLinkLabelHoverStyles((springIndex: number) =>
      springIndex === index ? { opacity: 0 } : {}
    );
    // @ts-expect-error type error in current version,
    // https://github.com/pmndrs/react-spring/issues/861
    setLinkBarSegmentStyles((springIndex: number) =>
      springIndex === index ? { background: colors.rule } : {}
    );
  };

  return (
    <SectionNav aria-label="page sections">
      <SectionNumber>{formatPageNum(activeSection)}</SectionNumber>
      <SectionNumberFaded>{formatPageNum(totalPages)}</SectionNumberFaded>
      <PageProgressContainer>
        <SectionList
          onMouseOver={() => setTrackStyles({ opacity: 0 })}
          onFocus={() => setTrackStyles({ opacity: 0 })}
          onMouseOut={() => setTrackStyles({ opacity: 1 })}
          onBlur={() => setTrackStyles({ opacity: 1 })}
        >
          <SectionListItem>
            <SectionLink
              to={`${urlBase}/1`}
              onMouseOver={showLinkLabel(0)}
              onFocus={showLinkLabel(0)}
              onMouseOut={hideLinkLabel(0)}
              onBlur={hideLinkLabel(0)}
            >
              <SectionLinkBarSegment style={linkBarSegmentStyles[0]} />
              <SectionLinkLabel style={linkLabelHoverStyles[0]}>
                {narrative.title}
              </SectionLinkLabel>
            </SectionLink>
          </SectionListItem>
          {narrative.sections.map((section, index) => {
            return (
              <SectionListItem key={section.title}>
                <SectionLink
                  to={`${urlBase}/${index + 2}`}
                  onMouseOver={showLinkLabel(index + 1)}
                  onFocus={showLinkLabel(index + 1)}
                  onMouseOut={hideLinkLabel(index + 1)}
                  onBlur={hideLinkLabel(index + 1)}
                >
                  <SectionLinkBarSegment
                    style={linkBarSegmentStyles[index + 1]}
                  />
                  <SectionLinkLabel style={linkLabelHoverStyles[index + 1]}>
                    {section.title}
                  </SectionLinkLabel>
                </SectionLink>
              </SectionListItem>
            );
          })}
        </SectionList>
        <PageProgressBar style={{ height: rem(progressBarHeight) }}>
          <PageProgressTrack style={trackStyles} />
          <PageProgressThumb style={thumbStyles} />
        </PageProgressBar>
      </PageProgressContainer>
      <AdvanceLink
        urlBase={urlBase}
        activeSection={activeSection}
        disabled={disablePrev}
        type="previous"
      />
      <AdvanceLink
        urlBase={urlBase}
        activeSection={activeSection}
        disabled={disableNext}
        type="next"
      />
    </SectionNav>
  );
};

export default SectionNavigation;
