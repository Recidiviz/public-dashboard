// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { Link } from "@reach/router";
import { format } from "d3-format";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import Arrow from "../UiLibrary/Arrow";
import { NarrativeSectionProps, SystemNarrativePageProps } from "./types";
import { currentSectionIndex } from "./utils";

const formatPageNum = format("02");

const SectionNav = styled.nav`
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

const SystemNarrativeNav: React.FC<
  SystemNarrativePageProps & NarrativeSectionProps
> = ({ narrative, sectionNumber }) => {
  const sectionIndex = currentSectionIndex(sectionNumber);
  let disablePrev = false;
  let disableNext = false;
  let prevUrl = "";
  let nextUrl = "";
  let displayedPageNumber = 0;

  if (typeof sectionIndex === "undefined") {
    disablePrev = true;
    nextUrl = "1";
    displayedPageNumber = 1;
  } else {
    // number from props is 1-indexed, which is why we offset by 2 below
    displayedPageNumber = sectionIndex + 2;
    if (sectionIndex) {
      prevUrl = `../${sectionIndex || ""}`;
    } else {
      prevUrl = "../";
    }
    if (sectionIndex < narrative.sections.length - 1) {
      nextUrl = `../${sectionIndex + 2}`;
    } else {
      disableNext = true;
    }
  }

  return (
    <SectionNav aria-label={`${narrative.title} sections`}>
      <PageNumber>{formatPageNum(displayedPageNumber)}</PageNumber>
      <PageNumberFaded>
        {formatPageNum(narrative.sections.length + 1)}
      </PageNumberFaded>
      {disablePrev ? (
        <div>
          <Arrow direction="up" disabled />
        </div>
      ) : (
        <Link to={prevUrl} aria-label="previous section">
          <Arrow direction="up" />
        </Link>
      )}
      {disableNext ? (
        <div>
          <Arrow direction="down" disabled />
        </div>
      ) : (
        <Link to={nextUrl} aria-label="next section">
          <Arrow direction="down" />
        </Link>
      )}
    </SectionNav>
  );
};

export default SystemNarrativeNav;
