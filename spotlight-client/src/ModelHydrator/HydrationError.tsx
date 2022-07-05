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

import { typography } from "@recidiviz/design-system";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import imgPath from "../assets/loading-error.svg";
import { colors } from "../UiLibrary";

const Wrapper = styled.div`
  ${typography.Sans14}
  color: ${colors.caption};
  text-align: center;
  width: ${rem(208)};
`;

const Image = styled.img`
  height: ${rem(106)};
  margin-bottom: ${rem(24)};
  width: ${rem(148)};
`;
const Message = styled.div``;

export default function HydrationError(): React.ReactElement {
  return (
    <Wrapper role="status">
      <Image src={imgPath} />
      <Message>Some data could not be loaded because of an error.</Message>
    </Wrapper>
  );
}
