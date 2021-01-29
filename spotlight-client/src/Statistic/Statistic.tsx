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
import { colors, fluidFontSizeStyles, typefaces } from "../UiLibrary";

const StatisticsWrapper = styled.figure``;

const ValueWrapper = styled.div<{ minSize: number; maxSize: number }>`
  color: ${colors.text};
  font-family: ${typefaces.display};
  line-height: 100%;
  letter-spacing: -0.07em;

  ${(props) => fluidFontSizeStyles(props.minSize, props.maxSize)}
`;

const LabelWrapper = styled.figcaption`
  color: ${colors.caption};
  font-size: ${rem(13)};
  font-weight: 500;
  letter-spacing: -0.01;
  line-height: 1.5;
  margin-top: ${rem(8)};
`;

type StatisticProps = {
  value?: string | number;
  label?: string;
  maxSize: number;
  minSize: number;
};

const Statistic: React.FC<StatisticProps> = ({
  label,
  maxSize,
  minSize,
  value = "No data",
}) => {
  return (
    // figcaption does not seem to get consistently picked up as the accessible name,
    // so including it as a label here too for insurance
    <StatisticsWrapper aria-label={label}>
      <ValueWrapper {...{ maxSize, minSize }}>{value}</ValueWrapper>
      {label && <LabelWrapper>{label}</LabelWrapper>}
    </StatisticsWrapper>
  );
};

export default Statistic;
