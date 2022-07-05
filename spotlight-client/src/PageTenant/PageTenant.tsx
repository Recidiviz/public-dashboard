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
import { palette, typography } from "@recidiviz/design-system";
import HTMLReactParser from "html-react-parser";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { DEFAULT_SELECTED_TAB, NAV_BAR_HEIGHT } from "../constants";
import { NarrativeTypeId } from "../contentApi/types";
import OtherNarrativeLinksPreview from "../OtherNarrativeLinksPreview";
import { useDataStore } from "../StoreProvider";
import { breakpoints, PageSection } from "../UiLibrary";
import ExploreNarrativeButton from "../UiLibrary/ExploreNarrativeButton";
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
    gap: ${rem(70)};
  }
`;

const Introduction = styled(PageSection)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: ${rem(48)};
  padding-top: ${rem(48)};

  @media screen and (min-width: ${breakpoints.xl[0]}px) {
    padding-left: 0;
    padding-right: 0;
    max-width: 40%;
  }

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    a {
      margin-right: auto;
    }

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

const Title = styled.h1`
  ${typography.Header34}

  @media screen and (max-width: ${breakpoints.tablet[0]}px) {
    ${typography.Header24}
  }
`;

const Subtitle = styled.h2`
  ${typography.Body19}
  color: ${palette.slate85};
`;

const PageTenant: React.FC<RouteComponentProps> = () => {
  const { tenant } = useDataStore();
  const [narrativeId, setNarrativeId] = React.useState<NarrativeTypeId>(
    DEFAULT_SELECTED_TAB
  );

  if (!tenant) return null;

  return (
    // tenant may be briefly undefined during initial page load
    <Page>
      <Introduction>
        <Title data-testid="PageTitle">
          {HTMLReactParser(tenant.description)}
        </Title>
        {tenant.ctaCopy && (
          <Subtitle>{HTMLReactParser(tenant.ctaCopy)}</Subtitle>
        )}
        <ExploreNarrativeButton
          narrativeId={narrativeId}
          tenantId={tenant.id}
        />
      </Introduction>
      <Links>
        <OtherNarrativeLinksPreview
          onTabChange={(selectedTab) => setNarrativeId(selectedTab)}
        />
      </Links>
    </Page>
  );
};

export default withRouteSync(observer(PageTenant));
