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

import React from "react";
import styled from "styled-components/macro";
import { colors, zIndex } from "../UiLibrary";
import { formatAsPct, formatAsNumber } from "../utils";

const TooltipWrapper = styled.div`
  background: ${colors.tooltipBackground};
  border-radius: 4px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  color: ${colors.textLight};
  font-size: 14px;
  padding: 16px;
  position: relative;
  z-index: ${zIndex.tooltip};

  .InfoPanel & {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow-x: auto;
    padding: 0 32px 32px;
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
  color: ${colors.textLight};

  .InfoPanel & {
    margin-bottom: 24px;
  }
`;

const TooltipRecordList = styled.div`
  .InfoPanel & {
    align-items: flex-end;
    display: flex;
  }
`;

const TooltipRecord = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .InfoPanel & {
    font-size: 24px;
    margin-right: 24px;
    margin-bottom: 0;
  }
`;

const TooltipLabel = styled.div`
  .InfoPanel & {
    font-size: 16px;

    .TooltipLabel__text {
      opacity: 0.6;
    }
  }
`;

const TooltipValue = styled.div`
  display: inline-block;

  .InfoPanel & {
    display: block;
  }
`;

const TooltipPct = styled.div`
  display: inline-block;
  margin-left: 8px;

  &::before {
    content: "(";
  }

  &::after {
    content: ")";
  }

  .InfoPanel & {
    display: block;
    margin-left: 0;

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
              <TooltipLabel>
                {color && <LabelColorSwatch color={color} />}
                <span className="TooltipLabel__text">{label}</span>
              </TooltipLabel>
            )}
            <TooltipValue>
              {typeof value === "number" ? formatAsNumber(value) : value}
            </TooltipValue>
            {pct !== undefined && !Number.isNaN(pct) && (
              <TooltipPct>{formatAsPct(pct)}</TooltipPct>
            )}
          </TooltipRecord>
        ))}
      </TooltipRecordList>
    </TooltipWrapper>
  );
};

export default Tooltip;
