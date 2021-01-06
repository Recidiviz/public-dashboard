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

import { navigate, useParams } from "@reach/router";
import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React, { useEffect, useRef, useState } from "react";
import InView from "react-intersection-observer";
import styled from "styled-components/macro";
import getUrlForResource from "../routerUtils/getUrlForResource";
import normalizeRouteParams from "../routerUtils/normalizeRouteParams";
import { colors, typefaces } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";
import { X_PADDING } from "./constants";
import Section from "./Section";
import SectionNavigation from "./SectionNavigation";
import { SystemNarrativeSectionProps } from "./types";

const Container = styled.article`
  padding: ${rem(160)} ${rem(X_PADDING)};
  padding-right: 0;
`;

const IntroContainer = styled.div`
  padding-bottom: ${rem(172)};
  padding-right: ${rem(X_PADDING)};
  border-bottom: 1px solid ${colors.rule};
`;

const Title = styled.h1`
  font-family: ${typefaces.display};
  font-size: ${rem(88)};
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: ${rem(64)};
`;

const IntroCopy = styled.p`
  font-size: ${rem(48)};
  line-height: 1.5;
  letter-spacing: -0.025em;
`;

const ScrollIndicator = styled.div`
  align-items: center;
  color: ${colors.caption};
  display: flex;
  flex-direction: column;
  font-size: ${rem(12)};
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-top: ${rem(144)};

  span {
    margin-bottom: ${rem(16)};
  }
`;

const SectionsContainer = styled.div``;

const SystemNarrativePage: React.FC<SystemNarrativeSectionProps> = ({
  narrative,
}) => {
  const sectionsContainerRef = useRef() as React.MutableRefObject<
    HTMLDivElement
  >;

  return (
    <Container>
      <SectionNavigation narrative={narrative} />
      <InView
        as="div"
        threshold={0.3}
        onChange={(inView) => {
          if (inView) window.location.hash = "#";
        }}
      >
        <IntroContainer>
          <Title>{narrative.title}</Title>
          <IntroCopy>{HTMLReactParser(narrative.introduction)}</IntroCopy>
          <ScrollIndicator>
            <span>SCROLL</span>
            <Arrow direction="down" faded />
            <Arrow direction="down" />
          </ScrollIndicator>
        </IntroContainer>
      </InView>

      <SectionsContainer ref={sectionsContainerRef}>
        {narrative.sections.map((section, index) => {
          // the first viz section is "page 2"
          const pageId = index + 2;
          return (
            <InView
              as="div"
              id={`${pageId}`}
              key={section.title}
              threshold={0.3}
              onChange={(inView) => {
                if (inView) window.location.hash = `#${pageId}`;
              }}
            >
              <Section section={section} />
            </InView>
          );
        })}
      </SectionsContainer>
    </Container>
  );
};

export default SystemNarrativePage;
