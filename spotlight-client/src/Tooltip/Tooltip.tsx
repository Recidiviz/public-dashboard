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
import { formatAsPct, formatAsNumber } from "../utils";

const TooltipWrapper = styled.div`
  background: ${colors.tooltipBackground};
  border-radius: ${rem(4)};
  box-shadow: 0 ${rem(2)} ${rem(10)} rgba(0, 0, 0, 0.1);
  color: ${colors.textLight};
  font-size: ${rem(14)};
  padding: ${rem(16)};
  position: relative;
  z-index: ${zIndex.tooltip};

  .TooltipMobile & {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    padding-bottom: ${rem(32)};
    width: 100%;
  }
`;

const LabelColorSwatch = styled.div`
  background-color: ${(props) => props.color};
  border-radius: 0.5em;
  display: inline-block;
  height: 0.8em;
  margin-right: 0.5em;
  vertical-align: baseline;
  width: 0.8em;
`;

const TooltipTitle = styled.div`
  color: ${colors.accent};
  letter-spacing: -0.01em;
  margin-bottom: ${rem(16)};

  .TooltipMobile & {
    font-size: ${rem(16)};
    padding: 0 ${rem(32)};
    margin-bottom: ${rem(24)};
  }
`;

const TooltipRecordList = styled.div`
  .TooltipMobile & {
    align-items: flex-end;
    display: flex;
    overflow-x: auto;
    padding: ${rem(8)} ${rem(32)};
  }
`;

const TooltipRecord = styled.div`
  display: flex;
  margin-bottom: ${rem(16)};
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  .TooltipMobile & {
    display: block;
    flex: 0 0 auto;
    font-size: ${rem(24)};
    line-height: 1.3;
    margin-right: ${rem(24)};
    margin-bottom: 0;
    width: auto;

    &:last-child {
      padding-right: ${rem(32)};
    }
  }
`;

const RecordLabel = styled.div`
  margin-right: auto;
  padding-right: ${rem(24)};

  .TooltipMobile & {
    color: ${colors.caption};
    font-size: ${rem(15)};
    margin-right: 0;
  }
`;

const RecordValue = styled.div`
  display: inline-block;
  font-weight: 500;

  .TooltipMobile & {
    display: block;
    font-weight: 400;
    margin: ${rem(8)} 0;
  }
`;

const RecordPct = styled.div`
  display: inline-block;
  margin-left: 0.3em;

  &::before {
    content: "(";
  }

  &::after {
    content: ")";
  }

  .TooltipMobile & {
    display: block;
    margin: ${rem(8)} 0;

    &::before,
    &::after {
      content: "";
    }
  }
`;

export type TooltipContentProps = {
  title: string;
  records: {
    color?: string;
    label?: string;
    value: number | string;
    pct?: number;
  }[];
};

export const Tooltip: React.FC<TooltipContentProps> = ({ title, records }) => {
  return (
    <TooltipWrapper>
      <TooltipTitle>{title}</TooltipTitle>
      <TooltipRecordList>
        {records.map(({ color, label, value, pct }, i) => (
          <TooltipRecord key={label || i}>
            {label && (
              <RecordLabel>
                {color && <LabelColorSwatch color={color} />}
                <span className="TooltipLabel__text">{label}</span>
              </RecordLabel>
            )}
            <RecordValue>
              {typeof value === "number" ? formatAsNumber(value) : value}
            </RecordValue>
            {pct !== undefined && !Number.isNaN(pct) && (
              <RecordPct>{formatAsPct(pct)}</RecordPct>
            )}
          </TooltipRecord>
        ))}
      </TooltipRecordList>
    </TooltipWrapper>
  );
};

export default Tooltip;
