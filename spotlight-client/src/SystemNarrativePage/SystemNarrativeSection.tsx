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

import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { typefaces } from "../UiLibrary";
import SystemNarrativeNav from "./SystemNarrativeNav";
import { SystemNarrativeSectionProps } from "./types";
import { currentSectionIndex } from "./utils";

const Section = styled.section``;

const SectionTitle = styled.h2`
  font-family: ${typefaces.display};
  font-size: ${rem(24)};
  line-height: 1.25;
  letter-spacing: -0.04em;
  margin-bottom: ${rem(24)};
`;

const SectionBody = styled.div`
  line-height: 1.67;
`;

const SystemNarrativeSection: React.FC<SystemNarrativeSectionProps> = ({
  narrative,
  sectionNumber,
}) => {
  if (!sectionNumber) {
    return null;
  }

  const section = narrative.sections[currentSectionIndex(sectionNumber)];

  return (
    <Section>
      <SectionTitle>{section.title}</SectionTitle>
      <SectionBody>{HTMLReactParser(section.body)}</SectionBody>
      <SystemNarrativeNav narrative={narrative} sectionNumber={sectionNumber} />
    </Section>
  );
};

export default SystemNarrativeSection;
