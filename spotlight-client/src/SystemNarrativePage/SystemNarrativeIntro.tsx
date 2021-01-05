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

import { RouteComponentProps } from "@reach/router";
import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { typefaces } from "../UiLibrary";
import SystemNarrativeNav from "./SystemNarrativeNav";
import { SystemNarrativePageProps } from "./types";

const Container = styled.div``;

const Title = styled.h1`
  font-family: ${typefaces.display};
  font-size: ${rem(88)};
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: ${rem(64)};
`;

const Intro = styled.p`
  font-size: ${rem(48)};
  line-height: 1.5;
  letter-spacing: -0.025em;
`;

const SystemNarrativeIntro: React.FC<
  SystemNarrativePageProps & RouteComponentProps
> = ({ narrative }) => {
  return (
    <Container>
      <Title>{narrative.title}</Title>
      <Intro>{HTMLReactParser(narrative.introduction)}</Intro>
      <SystemNarrativeNav narrative={narrative} />
    </Container>
  );
};

export default SystemNarrativeIntro;
