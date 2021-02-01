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

import { sum } from "d3-array";
import React, { useState } from "react";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import styled from "styled-components/macro";
import { ValuesType } from "utility-types";
import MeasureWidth from "../MeasureWidth";
import { animation, colors, zIndex } from "../UiLibrary";
import ColorLegend from "./ColorLegend";
import ResponsiveTooltipController from "./ResponsiveTooltipController";
import { ItemToHighlight } from "./types";
import { getDataWithPct, highlightFade } from "./utils";

const ProportionalBarContainer = styled.figure`
  width: 100%;
`;

const ProportionalBarChartWrapper = styled.div`
  background: ${colors.chartNoData};
  position: relative;
  z-index: ${zIndex.base + 1};

  .ProportionalBarChart__segment {
    stroke: ${colors.background};
    stroke-width: 2;
  }
`;

const ProportionalBarMetadata = styled.figcaption`
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 4px;
  width: 100%;
  z-index: ${zIndex.base};
`;

const ProportionalBarTitle = styled.div`
  color: ${colors.caption};
  flex: 0 1 auto;
  font-size: 12px;
  margin-right: 15px;
`;

const ProportionalBarLegendWrapper = styled.div`
  /*
    setting a non-auto basis lets the legend try to wrap internally
    before the container wraps the entire legend to its own line
  */
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
`;

type ProportionalBarProps = {
  data: { label: string; color: string; value: number }[];
  height: number;
  highlighted?: ItemToHighlight;
  setHighlighted?: (item?: ItemToHighlight) => void;
  showLegend?: boolean;
  title: string;
};

export default function ProportionalBar({
  data,
  height,
  highlighted: externalHighlighted,
  setHighlighted: setExternalHighlighted,
  showLegend = true,
  title,
}: ProportionalBarProps): React.ReactElement {
  const [localHighlighted, setLocalHighlighted] = useState<ItemToHighlight>();

  const dataWithPct = getDataWithPct(data);
  const noData = data.length === 0 || sum(data.map(({ value }) => value)) === 0;

  const highlighted = localHighlighted || externalHighlighted;

  return (
    <MeasureWidth>
      {({ measureRef, width }) => (
        <ProportionalBarContainer
          ref={measureRef}
          // figure caption does not seem to get consistently picked up as accessible name
          aria-label={title}
        >
          <ProportionalBarChartWrapper>
            <ResponsiveTooltipController
              pieceHoverAnnotation
              // we don't ever want mark hover to affect other charts
              // so it can only control the local highlight state
              setHighlighted={setLocalHighlighted}
            >
              <OrdinalFrame
                baseMarkProps={{
                  transitionDuration: { fill: animation.defaultDuration },
                }}
                data={dataWithPct}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                // returning a static value here groups them all in a single column
                oAccessor={() => title}
                pieceClass="ProportionalBarChart__segment"
                projection="horizontal"
                rAccessor="value"
                renderKey="label"
                size={[width, height]}
                style={(d: ValuesType<ProportionalBarProps["data"]>) => ({
                  fill:
                    highlighted && highlighted.label !== d.label
                      ? highlightFade(d.color)
                      : d.color,
                })}
                type="bar"
              />
            </ResponsiveTooltipController>
          </ProportionalBarChartWrapper>
          <ProportionalBarMetadata>
            <ProportionalBarTitle>
              {title}
              {noData && ", No Data"}
            </ProportionalBarTitle>
            {showLegend && (
              <ProportionalBarLegendWrapper>
                <ColorLegend
                  highlighted={highlighted}
                  items={data}
                  // legend may cover multiple charts in some layouts,
                  // so it prefers the external highlight when present
                  setHighlighted={setExternalHighlighted || setLocalHighlighted}
                />
              </ProportionalBarLegendWrapper>
            )}
          </ProportionalBarMetadata>
        </ProportionalBarContainer>
      )}
    </MeasureWidth>
  );
}
