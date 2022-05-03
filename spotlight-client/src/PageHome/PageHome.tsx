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

import { Link, Redirect } from "@reach/router";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import getTenantList from "../contentApi/getTenantList";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { CopyBlock, PageSection, PageTitle } from "../UiLibrary";
import withRouteSync from "../withRouteSync";

const PageContainer = styled(PageSection)`
  padding-bottom: ${rem(48)};
  padding-top: ${rem(48)};
`;

const PageHome = (): React.ReactElement => {
  const {
    tenantStore: { locked, currentTenantId },
  } = useDataStore();

  if (locked && currentTenantId) {
    return (
      <Redirect
        noThrow
        to={getUrlForResource({
          page: "tenant",
          params: { tenantId: currentTenantId },
        })}
      />
    );
  }

  return (
    <PageContainer>
      <PageTitle>Spotlight</PageTitle>
      <CopyBlock>
        {getTenantList().map(({ id, name }) => (
          <p key={id}>
            <Link
              to={getUrlForResource({
                page: "tenant",
                params: { tenantId: id },
              })}
            >
              {name}
            </Link>
          </p>
        ))}
      </CopyBlock>
    </PageContainer>
  );
};

export default withRouteSync(observer(PageHome));
