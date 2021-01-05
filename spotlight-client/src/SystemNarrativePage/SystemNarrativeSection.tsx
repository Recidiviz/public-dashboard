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
import { NAV_BAR_HEIGHT } from "../constants";
import { AnyMetric } from "../contentModels/types";
import { typefaces } from "../UiLibrary";
import SystemNarrativeNav from "./SystemNarrativeNav";
import { SystemNarrativeSectionProps } from "./types";
import { currentSectionIndex } from "./utils";

const COPY_WIDTH = 408;

const Section = styled.section``;

const SectionCopy = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${NAV_BAR_HEIGHT});
  justify-content: center;
  position: fixed;
  top: ${NAV_BAR_HEIGHT};
  width: ${rem(COPY_WIDTH)};
`;

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

const VizContainer = styled.div`
  margin-left: ${rem(COPY_WIDTH + 176)};
  height: 125vh;
`;

const SectionViz: React.FC<{ metric: AnyMetric }> = ({ metric }) => {
  return (
    <VizContainer>
      <h3>Placeholder for {metric.name}</h3>
    </VizContainer>
  );
};

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
      <SystemNarrativeNav narrative={narrative} sectionNumber={sectionNumber} />
      <SectionCopy>
        <SectionTitle>{section.title}</SectionTitle>
        <SectionBody>{HTMLReactParser(section.body)}</SectionBody>
      </SectionCopy>
      <SectionViz metric={section.metric} />
    </Section>
  );
};

export default SystemNarrativeSection;
