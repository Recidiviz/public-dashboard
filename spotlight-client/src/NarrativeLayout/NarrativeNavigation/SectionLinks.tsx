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

import { rem } from "polished";
import React, { useEffect } from "react";
import { animated, useSpring, useSprings } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { track } from "../../analytics";
import { colors, UnStyledButton } from "../../UiLibrary";
import { LayoutSection } from "../types";
import { SectionNavProps } from "./types";
import { THUMB_SIZE } from "./utils";

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

const SectionLink = styled(UnStyledButton)`
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

const getThumbOffset = (activeSection: number) =>
  // section numbers are 1-indexed for human readability
  (activeSection - 1) * (THUMB_SIZE.height + THUMB_SIZE.paddingBottom);

const SectionLinks: React.FC<
  SectionNavProps & {
    sections: LayoutSection[];
  }
> = ({ activeSection, goToSection, sections }) => {
  const totalPages = sections.length;

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
    <PageProgressContainer>
      <SectionList
        onMouseOver={() => setTrackStyles({ opacity: 0 })}
        onFocus={() => setTrackStyles({ opacity: 0 })}
        onMouseOut={() => setTrackStyles({ opacity: 1 })}
        onBlur={() => setTrackStyles({ opacity: 1 })}
      >
        {sections.map((section, index) => {
          return (
            <SectionListItem key={section.title}>
              <SectionLink
                onClick={() => {
                  track(`direct_section_link_clicked`, {
                    category: "navigation",
                    label: `${index + 1}`,
                  });
                  goToSection(index + 1);
                }}
                onMouseOver={showLinkLabel(index)}
                onFocus={showLinkLabel(index)}
                onMouseOut={hideLinkLabel(index)}
                onBlur={hideLinkLabel(index)}
              >
                <SectionLinkBarSegment style={linkBarSegmentStyles[index]} />
                <SectionLinkLabel style={linkLabelHoverStyles[index]}>
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
  );
};

export default SectionLinks;
