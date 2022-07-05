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
import styled, { keyframes } from "styled-components/macro";

import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";
import { animation, colors } from "../UiLibrary";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: ${rem(360)};
  width: 100%;
`;

const LoadingSpinnerIcon = styled(SpinnerIcon)`
  animation: ${rotate} ${animation.defaultDuration}ms linear infinite;
`;

const LoadingSpinnerText = styled.div`
  ${typography.Sans14}
  color: ${colors.caption};
`;

export default function Loading(): JSX.Element {
  return (
    <LoadingWrapper role="status" data-testid="LoadingIndicator">
      <LoadingSpinnerIcon />
      <LoadingSpinnerText>Data is loading</LoadingSpinnerText>
    </LoadingWrapper>
  );
}
