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

import { Link } from "@reach/router";
import { typography } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import OtherNarrativeLinks from "../OtherNarrativeLinks";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { colors } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";

const Container = styled.nav`
  padding: ${rem(120)} ${rem(32)} 0;

  .NarrativeFooter__BackLink {
    ${typography.Sans16}
    color: ${colors.link};
    display: inline-block;
    margin-top: ${rem(48)};
    text-decoration: none;
  }
`;

const Heading = styled.h2`
  ${typography.Serif34}
`;

const Footer: React.FC = () => {
  const { tenant } = useDataStore();

  if (!tenant) return null;

  return (
    <Container aria-label="data narratives">
      <Heading>Continue Reading</Heading>
      <OtherNarrativeLinks />
      <Link
        className="NarrativeFooter__BackLink"
        to={getUrlForResource({
          page: "tenant",
          params: { tenantId: tenant.id },
        })}
      >
        <Arrow direction="left" /> Back to Data Narratives
      </Link>
    </Container>
  );
};

export default observer(Footer);
