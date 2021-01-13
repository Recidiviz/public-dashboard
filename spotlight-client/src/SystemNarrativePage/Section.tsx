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

import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React from "react";
import Sticker from "react-stickyfill";
import styled from "styled-components/macro";
import { NAV_BAR_HEIGHT } from "../constants";
import Metric from "../contentModels/Metric";
import { SystemNarrativeSection } from "../contentModels/SystemNarrative";
import MetricVizMapper from "../MetricVizMapper";
import { colors, typefaces } from "../UiLibrary";
import { X_PADDING } from "./constants";

const COPY_WIDTH = 408;

const Container = styled.section`
  border-bottom: 1px solid ${colors.rule};
  display: flex;
  min-height: 100vh;
  padding-right: ${rem(X_PADDING)};
`;

const SectionCopy = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  justify-content: center;
  position: sticky;
  top: ${rem(NAV_BAR_HEIGHT)};
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
  margin-left: ${rem(176)};
  flex: 1 1 auto;
  padding: ${rem(240)} 0;
`;

const SectionViz: React.FC<{ metric: Metric }> = ({ metric }) => {
  return (
    <VizContainer>
      <MetricVizMapper metric={metric} />
    </VizContainer>
  );
};

const Section: React.FC<{ section: SystemNarrativeSection }> = ({
  section,
}) => {
  return (
    <Container>
      <Sticker>
        <SectionCopy>
          <SectionTitle>{section.title}</SectionTitle>
          <SectionBody>{HTMLReactParser(section.body)}</SectionBody>
        </SectionCopy>
      </Sticker>
      <SectionViz metric={section.metric} />
    </Container>
  );
};

export default Section;
