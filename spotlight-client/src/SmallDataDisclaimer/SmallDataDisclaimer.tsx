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
import { colors } from "../UiLibrary";

const Wrapper = styled.div`
  color: ${colors.caption};
  font-size: ${rem(13)};
  font-weight: 500;
  line-height: 1.7;
  margin-top: ${rem(40)};
`;

const SmallDataDisclaimer = (): React.ReactElement => {
  return (
    <Wrapper>
      Please always take note of the number of people associated with each
      proportion presented here; in cases where the counts are especially low,
      the proportion may not be statistically significant and therefore not
      indicative of long-term trends.
    </Wrapper>
  );
};

export default SmallDataDisclaimer;
