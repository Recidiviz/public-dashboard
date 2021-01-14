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

import { useParams } from "@reach/router";
import { format } from "d3-format";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import SystemNarrative from "../contentModels/SystemNarrative";
import getUrlForResource from "../routerUtils/getUrlForResource";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import AdvanceLink from "./AdvanceLink";
import SectionLinks from "./SectionLinks";

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

  return (
    <SectionNav aria-label="page sections">
      <SectionNumber>{formatPageNum(activeSection)}</SectionNumber>
      <SectionNumberFaded>{formatPageNum(totalPages)}</SectionNumberFaded>
      <SectionLinks {...{ activeSection, narrative, totalPages, urlBase }} />
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
