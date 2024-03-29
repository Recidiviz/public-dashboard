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
import { sum } from "d3-array";
import React from "react";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import styled from "styled-components/macro";
import { ValuesType } from "utility-types";
import MeasureWidth from "../MeasureWidth";
import { animation, colors, zIndex } from "../UiLibrary";
import ColorLegend from "./ColorLegend";
import ResponsiveTooltipController from "./ResponsiveTooltipController";
import { CategoricalChartRecord, ItemToHighlight } from "./types";
import { useHighlightedItem, highlightFade, isSmallData } from "./utils";
import { useCreateHatchDefs } from "./useCreateHatchDefs";

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
  ${typography.Sans12}
  color: ${colors.caption};
  flex: 0 1 auto;
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
  data: CategoricalChartRecord[];
  height: number;
  highlighted?: ItemToHighlight;
  setHighlighted?: (item?: ItemToHighlight) => void;
  showLegend?: boolean;
  preview?: boolean;
  title: string;
};

export default function ProportionalBar({
  data,
  height,
  highlighted: externalHighlighted,
  setHighlighted: setExternalHighlighted,
  showLegend = true,
  preview = false,
  title,
}: ProportionalBarProps): React.ReactElement {
  const {
    highlighted: localHighlighted,
    setHighlighted: setLocalHighlighted,
  } = useHighlightedItem();
  const { getHatchDefs, generateHatchFill } = useCreateHatchDefs();

  const noData = data.length === 0 || sum(data.map(({ value }) => value)) === 0;

  const highlighted = localHighlighted || externalHighlighted;

  const hatchDefs = getHatchDefs(data);

  return (
    <MeasureWidth>
      {({ measureRef, width }) => (
        <ProportionalBarContainer
          ref={measureRef}
          // figure caption does not seem to get consistently picked up as accessible name
          aria-label={title}
        >
          {width > 0 && (
            <>
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
                    data={data}
                    margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    // returning a static value here groups them all in a single column
                    oAccessor={() => title}
                    pieceClass="ProportionalBarChart__segment"
                    projection="horizontal"
                    rAccessor="value"
                    renderKey="label"
                    size={[width, height]}
                    style={(d: ValuesType<ProportionalBarProps["data"]>) => {
                      if (isSmallData(data)) {
                        return {
                          fill: generateHatchFill(d.label, highlighted?.label),
                        };
                      }
                      return {
                        fill:
                          highlighted && highlighted.label !== d.label
                            ? highlightFade(d.color)
                            : d.color,
                      };
                    }}
                    type="bar"
                    additionalDefs={hatchDefs}
                  />
                </ResponsiveTooltipController>
              </ProportionalBarChartWrapper>
              <ProportionalBarMetadata>
                {!preview && (
                  <ProportionalBarTitle>
                    {title}
                    {noData && ", No Data"}
                  </ProportionalBarTitle>
                )}
                {showLegend && (
                  <ProportionalBarLegendWrapper>
                    <ColorLegend
                      highlighted={highlighted}
                      items={data}
                      // legend may cover multiple charts in some layouts,
                      // so it prefers the external highlight when present
                      setHighlighted={
                        setExternalHighlighted || setLocalHighlighted
                      }
                    />
                  </ProportionalBarLegendWrapper>
                )}
              </ProportionalBarMetadata>
            </>
          )}
        </ProportionalBarContainer>
      )}
    </MeasureWidth>
  );
}
