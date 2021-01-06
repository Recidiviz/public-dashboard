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

import { Link, useLocation } from "@reach/router";
import { format } from "d3-format";
import { rem } from "polished";
import React, { useEffect } from "react";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import { colors } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";
import { NarrativeSectionProps, SystemNarrativePageProps } from "./types";
import { currentSectionIndex } from "./utils";

const formatPageNum = format("02");

const PROGRESS_BAR_HEIGHT = 104;

const SectionNav = styled.nav`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${NAV_BAR_HEIGHT});
  justify-content: center;
  left: ${rem(32)};
  position: fixed;
  top: ${NAV_BAR_HEIGHT};
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

const PageProgressContainer = styled.div.attrs((props) => ({
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

const PageProgressThumb = styled.div`
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
  const thumbOffset = currentIndex * thumbSize;

  return (
    <PageProgressContainer>
      <PageProgressTrack />
      <PageProgressThumb
        style={{ height: rem(thumbSize), top: rem(thumbOffset) }}
      />
    </PageProgressContainer>
  );
};

const SectionNavigation: React.FC<
  SystemNarrativePageProps & NarrativeSectionProps
> = ({ narrative }) => {
  const { hash } = useLocation();
  // no hash is equivalent to the top of the page
  const displayedPageNumber = Number(hash.replace("#", "") || "1");

  const disablePrev = displayedPageNumber === 1;
  const disableNext = displayedPageNumber > narrative.sections.length;
  // go to top of the page instead of #1
  const prevUrl = `#${displayedPageNumber > 2 ? displayedPageNumber - 1 : ""}`;
  const nextUrl = `#${displayedPageNumber + 1}`;
  const totalPages = narrative.sections.length + 1;

  return (
    <SectionNav aria-label={`${narrative.title} sections`}>
      <PageNumber>{formatPageNum(displayedPageNumber)}</PageNumber>
      <PageNumberFaded>{formatPageNum(totalPages)}</PageNumberFaded>
      <PageProgressBar
        currentPage={displayedPageNumber}
        totalPages={totalPages}
      />
      {disablePrev ? (
        <div>
          <Arrow direction="up" faded />
        </div>
      ) : (
        <a href={prevUrl} aria-label="previous section">
          <Arrow direction="up" />
        </a>
      )}
      {disableNext ? (
        <div>
          <Arrow direction="down" faded />
        </div>
      ) : (
        <a href={nextUrl} aria-label="next section">
          <Arrow direction="down" />
        </a>
      )}
    </SectionNav>
  );
};

export default SectionNavigation;
