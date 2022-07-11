// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import React, { useState, useCallback } from "react";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import useBreakpoint from "@w11r/use-breakpoint";
import { animated, useTransition } from "react-spring/web.cjs";
import styled, { css } from "styled-components/macro";
import { ChartWrapper as BaseChartWrapper } from "@recidiviz/design-system";
import ColorLegend from "./ColorLegend";
import ResponsiveTooltipController, {
  ResponsiveTooltipControllerProps,
} from "./ResponsiveTooltipController";
import { highlightFade, useHighlightedItem } from "./utils";
import MeasureWidth from "../MeasureWidth";
import { animation, colors, zIndex } from "../UiLibrary";
import { formatAsPct } from "../utils";
import { RateByCategoryAndDemographicsRecords } from "../contentModels/types";

const CHART_HEIGHT = 400;
const CHART_MIN_WIDTH = 736;

const Container = styled.figure`
  width: 100%;
`;

const horizontalScrollStyles = css`
  overflow-x: overlay !important;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ChartWrapper = styled(BaseChartWrapper)<{
  isScrollable?: boolean;
}>`
  position: relative;
  z-index: ${zIndex.base + 1};

  .foreground-graphics .ordinal-labels text {
    transform: rotate(-45deg) translate(0rem, 0rem);
  }

  ${(props) => props.isScrollable && horizontalScrollStyles}

  .BarChartCluster__segment {
    stroke: ${colors.background};
    stroke-width: 2;
  }
`;

const Metadata = styled.figcaption`
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 4px;
  width: 100%;
  z-index: ${zIndex.base};
`;

const LegendWrapper = styled.div`
  /*
    setting a non-auto basis lets the legend try to wrap internally
    before the container wraps the entire legend to its own line
  */
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
`;

type BarChartClucterProps = {
  demographicView: string;
  data: RateByCategoryAndDemographicsRecords[];
  accessors: string[];
  getTooltipProps: ResponsiveTooltipControllerProps["getTooltipProps"];
};

/**
 * Renders bar chart with clusters of data by accessors
 */
export function BarChartCluster({
  demographicView,
  data,
  accessors,
  getTooltipProps,
}: BarChartClucterProps): React.ReactElement {
  const isMobile = useBreakpoint(false, ["mobile-", true]);

  const chartTransitions = useTransition(
    { demographicView, data },
    (item) => item.demographicView,
    animation.crossFade
  );

  const { highlighted, setHighlighted } = useHighlightedItem();
  const [highlightedSegmentKey, setHighlightedSegmentKey] = useState();

  const setHighlightedSegment = useCallback(
    (d) => setHighlightedSegmentKey(d ? d.renderKey + 1 : undefined),
    [setHighlightedSegmentKey]
  );

  return (
    <MeasureWidth>
      {({ measureRef, width }) => {
        const isScrollable = isMobile && width < 600;
        return (
          <Container
            ref={measureRef}
            // figure caption does not seem to get consistently picked up as accessible name
            aria-label={demographicView}
          >
            {width > 0 && (
              <>
                {chartTransitions.map(({ item, key, props }) => (
                  <ChartWrapper key={key} isScrollable={isScrollable}>
                    <animated.div style={props}>
                      <ResponsiveTooltipController
                        pieceHoverAnnotation
                        setHighlighted={setHighlightedSegment}
                        getTooltipProps={getTooltipProps}
                      >
                        <OrdinalFrame
                          baseMarkProps={{
                            transitionDuration: {
                              fill: animation.defaultDuration,
                            },
                          }}
                          data={item.data}
                          pieceClass="BarChartCluster__segment"
                          type="clusterbar"
                          oPadding={40}
                          margin={{ bottom: 120, left: 56, right: 0, top: 8 }}
                          oAccessor="label"
                          // @ts-expect-error Semiotic typedefs are wrong,
                          // we can use label as string here
                          oLabel={(label: string) => (
                            <text textAnchor="end">{label}</text>
                          )}
                          // @ts-expect-error Semiotic typedefs are wrong,
                          // we can use array of strings, when type of chart is "clusterbar"
                          rAccessor={accessors}
                          size={[
                            isScrollable ? CHART_MIN_WIDTH : width,
                            CHART_HEIGHT,
                          ]}
                          style={({ rName, rIndex, renderKey }) => {
                            const color = colors.dataViz[rIndex];
                            if (highlightedSegmentKey)
                              return {
                                fill:
                                  highlightedSegmentKey !== renderKey + 1
                                    ? highlightFade(color)
                                    : color,
                              };

                            return {
                              fill:
                                highlighted && highlighted.label !== rName
                                  ? highlightFade(color)
                                  : color,
                            };
                          }}
                          axes={[
                            {
                              baseline: false,
                              orient: "left",
                              tickFormat: formatAsPct,
                              ticks: 3,
                              tickSize: 0,
                            },
                          ]}
                        />
                      </ResponsiveTooltipController>
                    </animated.div>
                  </ChartWrapper>
                ))}
                <Metadata>
                  <LegendWrapper>
                    <ColorLegend
                      highlighted={highlighted}
                      items={accessors.map((accessor, index) => {
                        return {
                          label: accessor,
                          color: colors.dataViz[index],
                        };
                      })}
                      setHighlighted={setHighlighted}
                    />
                  </LegendWrapper>
                </Metadata>
              </>
            )}
          </Container>
        );
      }}
    </MeasureWidth>
  );
}
