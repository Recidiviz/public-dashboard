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
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import OtherNarrativeLinks from "../OtherNarrativeLinks";
import { useDataStore } from "../StoreProvider";
import { breakpoints, CopyBlock, PageSection, typefaces } from "../UiLibrary";
import withRouteSync from "../withRouteSync";

const Introduction = styled(PageSection)`
  margin: ${rem(48)} 0;

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    margin: ${rem(160)} 0;
  }
`;

const Links = styled(PageSection)``;

const Title = styled.h1`
  font-family: ${typefaces.display};
  font-size: ${rem(32)};
  letter-spacing: -0.04em;
  line-height: 1.4;
  margin-bottom: ${rem(32)};
  max-width: ${rem(760)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    font-size: ${rem(52)};
  }
`;

const Description = styled(CopyBlock)`
  font-size: ${rem(20)};
  line-height: 1.7;
  max-width: ${rem(760)};
`;

const PageTenant: React.FC<RouteComponentProps> = () => {
  const { tenant } = useDataStore();

  if (!tenant) return null;

  return (
    // tenant may be briefly undefined during initial page load
    <article>
      <Introduction>
        <Title>Explore correctional data from {tenant.name}.</Title>
        <Description>{HTMLReactParser(tenant.description)}</Description>
      </Introduction>
      <Links>
        <OtherNarrativeLinks />
      </Links>
    </article>
  );
};

export default withRouteSync(observer(PageTenant));
