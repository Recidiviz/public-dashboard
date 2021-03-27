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

import { format } from "d3-format";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { LayoutSection } from "../types";
import AdvanceLink from "./AdvanceLink";
import SectionLinks from "./SectionLinks";
import { SetSection } from "./types";

const formatPageNum = format("02");

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

type NavigationProps = {
  activeSection: number;
  sections: LayoutSection[];
  setActiveSection: SetSection;
};

const SectionNavigation: React.FC<NavigationProps> = ({
  activeSection,
  sections,
  setActiveSection,
}) => {
  const totalPages = sections.length;

  // these will be used to toggle prev/next links
  const disablePrev = activeSection === 1;
  const disableNext = activeSection === totalPages;

  return (
    <SectionNav aria-label="page sections">
      <SectionNumber>{formatPageNum(activeSection)}</SectionNumber>
      <SectionNumberFaded>{formatPageNum(totalPages)}</SectionNumberFaded>
      <SectionLinks {...{ activeSection, sections, setActiveSection }} />
      <AdvanceLink
        activeSection={activeSection}
        disabled={disablePrev}
        setActiveSection={setActiveSection}
        type="previous"
      />
      <AdvanceLink
        activeSection={activeSection}
        disabled={disableNext}
        setActiveSection={setActiveSection}
        type="next"
      />
    </SectionNav>
  );
};

export default SectionNavigation;
