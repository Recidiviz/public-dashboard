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
import { NAV_BAR_HEIGHT } from "../constants";
import OtherNarrativeLinks from "../OtherNarrativeLinks";
import { useDataStore } from "../StoreProvider";
import { breakpoints, CopyBlock, PageSection, PageTitle } from "../UiLibrary";
import withRouteSync from "../withRouteSync";

const Introduction = styled(PageSection)`
  padding-bottom: ${rem(48)};
  padding-top: ${rem(48)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* try to keep the links "above the fold" */
    min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)} - ${rem(130)});

    @media (min-height: ${rem(900)}) {
      /* stop scaling height to viewport because it looks ridiculous */
      min-height: ${rem(900 - NAV_BAR_HEIGHT - 130)};
    }
  }
`;

const Links = styled(PageSection)``;

const Title = styled(PageTitle)`
  font-size: ${rem(40)};
  max-width: ${rem(1100)};
`;

// const Description = styled(CopyBlock)`
//   font-size: ${rem(20)};
//   line-height: 1.7;
//   max-width: ${rem(1240)};
// `;

const PageTenant: React.FC<RouteComponentProps> = () => {
  const { tenant } = useDataStore();

  if (!tenant) return null;

  return (
    // tenant may be briefly undefined during initial page load
    <article>
      <Introduction>
        <Title>{HTMLReactParser(tenant.description)}</Title>
      </Introduction>
      <Links>
        <OtherNarrativeLinks />
      </Links>
    </article>
  );
};

export default withRouteSync(observer(PageTenant));
