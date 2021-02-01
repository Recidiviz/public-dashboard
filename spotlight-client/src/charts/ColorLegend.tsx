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

import classNames from "classnames";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { animation, colors } from "../UiLibrary";
import { ItemToDisplay, ItemToHighlight } from "./types";
import { highlightFade } from "./utils";

const ColorLegendWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: ${rem(12)};
`;

const ColorLegendItem = styled.div`
  align-items: center;
  color: ${colors.caption};
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  margin-right: 8px;
  padding-bottom: 4px;
  position: relative;
  white-space: nowrap;

  &:last-child {
    margin-right: 0;
  }

  &::after {
    background: ${(props) => props.color};
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 50%;
    position: absolute;
    transition: width ${animation.defaultDuration}ms,
      left ${animation.defaultDuration}ms;
    width: 0;
  }

  &.highlighted::after {
    width: 100%;
    left: 0;
  }
`;

const ColorLegendItemLabel = styled.div``;
const swatchSize = 8;
const ColorLegendItemSwatch = styled.div`
  background: ${(props) => props.color};
  border-radius: ${swatchSize / 2}px;
  height: ${swatchSize}px;
  margin-left: ${swatchSize / 2}px;
  transition: background-color ${animation.defaultDuration}ms;
  width: ${swatchSize}px;
`;

const ColorLegend: React.FC<{
  highlighted?: ItemToHighlight;
  items: ItemToDisplay[];
  setHighlighted: (item?: ItemToHighlight) => void;
}> = ({ highlighted, items, setHighlighted }) => {
  return (
    <ColorLegendWrapper aria-hidden>
      {items.map(({ label, color }) => (
        <ColorLegendItem
          className={classNames({
            highlighted: (highlighted || {}).label === label,
          })}
          color={color}
          key={label}
          onBlur={() => setHighlighted()}
          onFocus={() => setHighlighted({ label })}
          onMouseLeave={() => setHighlighted()}
          onMouseEnter={() => setHighlighted({ label })}
        >
          <ColorLegendItemLabel>{label}</ColorLegendItemLabel>
          <ColorLegendItemSwatch
            color={
              highlighted && highlighted.label !== label
                ? highlightFade(color)
                : color
            }
          />
        </ColorLegendItem>
      ))}
    </ColorLegendWrapper>
  );
};

export default ColorLegend;
