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

import { Link } from "@reach/router";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { breakpoints, CopyBlock, PageSection, PageTitle } from "../UiLibrary";

const Wrapper = styled(PageSection)`
  margin: ${rem(48)} 0;

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    margin: ${rem(160)} 0;
  }
`;

const NotFound = (): React.ReactElement => {
  return (
    <Wrapper>
      <PageTitle>Page not found.</PageTitle>
      <CopyBlock>
        <Link to="/">Return home,</Link> or use the navigation menu above to
        find your destination.
      </CopyBlock>
    </Wrapper>
  );
};

export default NotFound;
