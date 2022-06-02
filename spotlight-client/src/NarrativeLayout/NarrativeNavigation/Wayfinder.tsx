// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import {
  Button as BasicButton,
  palette,
  Icon,
  IconSVG,
} from "@recidiviz/design-system";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useBreakpoint from "@w11r/use-breakpoint";
import { useSwipeable } from "react-swipeable";
import { rem } from "polished";
import styled, { css } from "styled-components/macro";
import { NAV_BAR_HEIGHT, PROGRESS_BAR_HEIGHT } from "../../constants";
import { SectionNavProps } from "./types";
import { LayoutSection } from "../types";
import { breakpoints, colors, fluidFontSizeStyles } from "../../UiLibrary";
import { NarrativeSectionTitle } from "../../UiLibrary/narrative";
import SectionLinks from "./SectionLinks";
import AdvanceLink from "./AdvanceLink";
import ProgressBar from "./ProgressBar";

const HEADER_HEIGHT = PROGRESS_BAR_HEIGHT + NAV_BAR_HEIGHT;

const Wrapper = styled.div<{ expanded: boolean; open: boolean }>`
  position: fixed;
  overflow: hidden;
  bottom: 0;
  width: 100%;
  z-index: 501;
  outline: 0;
  transition: transform 500ms ease;
  transform: translateY(
    ${(props) => {
      if (props.open && props.expanded) {
        return `0%`;
      }
      if (props.open && !props.expanded) {
        return `calc(100% - ${HEADER_HEIGHT}px)`;
      }
      if (!props.open) {
        return `105%`;
      }
    }}
  );
`;

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  background: white;
  height: 100%;
  margin: 0 ${rem(108)};
  box-shadow: 0px 4px 20px #a6bebd;

  @media screen and (max-width: ${breakpoints.desktop[0]}px) {
    margin: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${rem(30)};
  height: ${rem(NAV_BAR_HEIGHT)};
  gap: ${rem(16)};
  cursor: pointer;

  @media screen and (max-width: ${breakpoints.tablet[0]}px) {
    padding: 0 ${rem(16)};
  }

  div {
    display: flex;
    gap: ${rem(16)};
    margin-left: auto;
  }
`;

const Body = styled.div`
  max-height: ${rem(666)};
  border-top: 1px solid ${colors.chartGridLine};
  padding: ${rem(30)};

  @media screen and (max-width: ${breakpoints.tablet[0]}px) {
    padding: ${rem(24)} ${rem(16)};
  }
`;

const activeButtonStyles = css`
  background: ${palette.signal.links} !important;
  color: ${palette.white} !important;
`;

const flashingButtonStyles = css`
  animation: blinker 1s infinite;

  @keyframes blinker {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

export const Button = styled(BasicButton)<{
  active?: boolean;
  rounded?: boolean;
  flashing?: boolean;
}>`
  min-width: ${(props) => rem(props.rounded ? 42 : 109)};
  height: ${rem(42)};
  background: ${palette.marble3} !important;
  color: ${palette.slate85};
  font-weight: 500;
  font-size: ${rem(16)};
  gap: ${rem(16)};
  padding: 0;

  &:hover:not([disabled]) {
    ${activeButtonStyles}
  }
  &:disabled {
    color: #c4c4c4;
  }

  ${(props) => props.active && activeButtonStyles}
  ${(props) => props.flashing && flashingButtonStyles}
`;

const SectionTitle = styled(NarrativeSectionTitle)<{
  minSize: number;
  maxSize: number;
}>`
  margin: 0;
  ${(props) => fluidFontSizeStyles(props.minSize, props.maxSize)}
`;

type NavigationProps = SectionNavProps & {
  sections: LayoutSection[];
  isOpen?: boolean;
};

const Wayfinder: React.FC<NavigationProps> = ({
  isOpen = true,
  activeSection,
  sections,
  goToSection,
}) => {
  const isMobile = useBreakpoint(false, ["mobile-", true]);

  const [isOpenWayfinder, openWayfinder] = useState(isOpen);
  const [isExpanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    if (scrolled > 98) {
      openWayfinder(false);
    } else {
      openWayfinder(true);
    }

    setExpanded(false);
  }, [scrolled, activeSection]);

  const handlers = useSwipeable({
    onSwipedUp: () => setExpanded(true),
    onSwipedDown: () => setExpanded(false),
    swipeDuration: 300,
    preventScrollOnSwipe: true,
  });

  const totalPages = sections.length;
  const disablePrev = activeSection === 1;
  const disableNext = activeSection === totalPages;

  return createPortal(
    <Wrapper open={isOpenWayfinder} expanded={isExpanded}>
      <Container
        {...handlers}
        aria-hidden={isOpenWayfinder ? "false" : "true"}
        aria-label="wayfinder"
        tabIndex={-1}
        role="dialog"
      >
        <ProgressBar onScroll={(v) => setScrolled(v)} />
        <Header onClick={() => setExpanded(!isExpanded)}>
          {!isMobile && (
            <Button
              rounded={isMobile}
              active={isExpanded}
              kind="borderless"
              onClick={() => setExpanded(!isExpanded)}
            >
              {activeSection}/{totalPages}
              <Icon kind={IconSVG.Hamburger} width={24} />
            </Button>
          )}
          <SectionTitle maxSize={24} minSize={14}>
            {sections[activeSection - 1].title}
          </SectionTitle>
          <div>
            <AdvanceLink
              activeSection={activeSection}
              disabled={disablePrev}
              goToSection={goToSection}
              type="previous"
            />
            <AdvanceLink
              activeSection={activeSection}
              disabled={disableNext}
              goToSection={goToSection}
              type="next"
              flashing
            />
          </div>
        </Header>
        <Body>
          <SectionLinks {...{ activeSection, goToSection, sections }} />
        </Body>
      </Container>
    </Wrapper>,
    document.body
  );
};

export default Wayfinder;
