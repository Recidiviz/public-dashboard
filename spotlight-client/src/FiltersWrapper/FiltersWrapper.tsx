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

import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { colors, zIndex } from "../UiLibrary";

const FiltersRow = styled.div`
  background: ${colors.background};
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${rem(16)};
  padding-bottom: ${rem(16)};
  z-index: ${zIndex.control};
`;

const FilterWrapper = styled.div`
  margin: 0 ${rem(16)};

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

type FilterWrapperProps = {
  filters: React.ReactElement[];
};

const FiltersWrapper = ({
  filters,
}: FilterWrapperProps): React.ReactElement => {
  return (
    <FiltersRow>
      {filters.map((filter, index) => (
        // there's nothing else to use as a key, but these should be pretty static
        // so there isn't any real performance concern
        // eslint-disable-next-line react/no-array-index-key
        <FilterWrapper key={index}>{filter}</FilterWrapper>
      ))}
    </FiltersRow>
  );
};

export default FiltersWrapper;
