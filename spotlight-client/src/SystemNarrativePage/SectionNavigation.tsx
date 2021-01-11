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
import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import getUrlForResource from "../routerUtils/getUrlForResource";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import { colors, Chevron } from "../UiLibrary";

const formatPageNum = format("02");

const PROGRESS_BAR_HEIGHT = 104;

const SectionNav = styled.nav`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  justify-content: center;
  left: ${rem(32)};
  position: fixed;
  top: ${rem(NAV_BAR_HEIGHT)};
`;

const PageNumber = styled.div`
  font-size: ${rem(13)};
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: ${rem(16)};
`;

const PageNumberFaded = styled(PageNumber)`
  opacity: 0.3;
`;

const PageProgressContainer = styled.div.attrs(() => ({
  "aria-hidden": true,
}))`
  margin: ${rem(24)} 0;
  position: relative;
`;

const PageProgressTrack = styled.div`
  background: ${colors.rule};
  height: ${rem(PROGRESS_BAR_HEIGHT)};
  width: ${rem(2)};
`;

const PageProgressThumb = styled(animated.div)`
  background: ${colors.accent};
  left: 0;
  position: absolute;
  width: ${rem(2)};
`;

const PageProgressBar: React.FC<{
  currentPage: number;
  totalPages: number;
}> = ({ currentPage, totalPages }) => {
  const thumbSize = PROGRESS_BAR_HEIGHT / totalPages;
  // pages are 1-indexed for human readability
  const currentIndex = currentPage - 1;

  const [thumbOffset, setThumbOffset] = useSpring(() => ({
    top: currentIndex * thumbSize,
  }));

  useEffect(() => {
    setThumbOffset({ top: currentIndex * thumbSize });
  }, [currentIndex, setThumbOffset, thumbSize]);

  return (
    <PageProgressContainer>
      <PageProgressTrack />
      <PageProgressThumb style={{ height: rem(thumbSize), ...thumbOffset }} />
    </PageProgressContainer>
  );
};

type NavigationProps = {
  activeSection: number;
  setActiveSection: (section: number) => void;
  totalPages: number;
};

const SectionNavigation: React.FC<NavigationProps> = ({
  activeSection,
  setActiveSection,
  totalPages,
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

  const disablePrev = activeSection === 1;
  const disableNext = activeSection === totalPages;

  // base is the current page, minus the section number
  const urlBase = getUrlForResource({
    page: "narrative",
    params: { tenantId, narrativeTypeId },
  });

  return (
    <SectionNav aria-label="page sections">
      <PageNumber>{formatPageNum(activeSection)}</PageNumber>
      <PageNumberFaded>{formatPageNum(totalPages)}</PageNumberFaded>
      <PageProgressBar currentPage={activeSection} totalPages={totalPages} />
      {disablePrev ? (
        <div>
          <Chevron direction="up" faded />
        </div>
      ) : (
        <Link
          // the to props on these links is mainly for accessibility purposes, so they
          // look like normal links. calling the setter is the critical step
          to={`${urlBase}/${activeSection - 1}`}
          onClick={() => {
            setActiveSection(activeSection - 1);
          }}
          aria-label="previous section"
        >
          <Chevron direction="up" />
        </Link>
      )}
      {disableNext ? (
        <div>
          <Chevron direction="down" faded />
        </div>
      ) : (
        <Link
          to={`${urlBase}/${activeSection + 1}`}
          onClick={() => {
            setActiveSection(activeSection + 1);
          }}
          aria-label="next section"
        >
          <Chevron direction="down" />
        </Link>
      )}
    </SectionNav>
  );
};

export default SectionNavigation;