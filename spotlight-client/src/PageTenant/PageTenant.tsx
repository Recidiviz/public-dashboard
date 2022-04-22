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
import OtherNarrativeLinksPreview from "../OtherNarrativeLinksPreview";
import { useDataStore } from "../StoreProvider";
import { breakpoints, PageSection, PageTitle } from "../UiLibrary";
import withRouteSync from "../withRouteSync";

const Page = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${breakpoints.xl[0]}px) {
    flex-direction: row;
    min-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
    padding: 0 ${rem(120)};
    gap: ${rem(170)};
  }
`;

const Introduction = styled(PageSection)`
  padding-bottom: ${rem(48)};
  padding-top: ${rem(48)};
  padding-left: 0;
  padding-right: 0;

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

const Links = styled(PageSection)`
  width: 100%;

  @media screen and (min-width: ${breakpoints.xl[0]}px) {
    width: 60%;
    padding: 0;
  }
`;

const Title = styled(PageTitle)`
  font-size: ${rem(34)};
  max-width: ${rem(650)};
`;

const Subtitle = styled(Title)`
  font-size: ${rem(18)};
  margin-top: ${rem(24)};
  margin-bottom: 0;
`;

const PageTenant: React.FC<RouteComponentProps> = () => {
  const { tenant } = useDataStore();

  if (!tenant) return null;

  return (
    // tenant may be briefly undefined during initial page load
    <Page>
      <Introduction>
        <Title>
          {HTMLReactParser(tenant.description)}
          <Subtitle>{tenant.coBrandingCopy}</Subtitle>
        </Title>
      </Introduction>
      <Links>
        <OtherNarrativeLinksPreview />
      </Links>
    </Page>
  );
};

export default withRouteSync(observer(PageTenant));
