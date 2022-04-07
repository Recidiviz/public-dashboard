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

import React, { useEffect, useState } from "react";
import { XYFrameProps } from "semiotic/lib/types/xyTypes";
import XYFrame from "semiotic/lib/XYFrame";
import styled from "styled-components/macro";
import { ChartWrapper as BaseChartWrapper } from "@recidiviz/design-system";
import ColorLegend from "./ColorLegend";
import { formatAsNumber, formatAsPct } from "../utils";
import XHoverController from "./XHoverController";
import { animation } from "../UiLibrary";
import { highlightFade } from "./utils";
import MeasureWidth from "../MeasureWidth";
import { DataSeries, ItemToHighlight, TooltipContentFunction } from "./types";
import { RateFields } from "../metricsApi";
import { TooltipContentProps } from "../Tooltip";

type ChartData = DataSeries<RateFields & { [key: string]: number }>[];

/**
 * Extracts point data for the highlighted series from chart data.
 * Returns an empty array if there is no highlight or no matching series.
 */
function getPointData({
  data,
  highlighted,
  xAccessor,
}: {
  data: ChartData;
  highlighted?: ItemToHighlight;
  xAccessor: string;
}) {
  // we only show points as part of highlight behavior
  if (!highlighted) return [];

  const highlightedSeries = data.find((d) => d.label === highlighted.label);
  // this can be missing if, e.g., the series has been filtered out
  if (!highlightedSeries) return [];

  return highlightedSeries.coordinates.map((point) => {
    return {
      ...point,
      // key ensures uniqueness per series, otherwise we get weird dot animations
      key: `${point[xAccessor]}-${highlighted.label}`,
    };
  });
}

function getPointColor({
  data,
  highlighted,
}: {
  data: ChartData;
  highlighted?: ItemToHighlight;
}) {
  // we only show points as part of highlight behavior
  if (!highlighted) return undefined;
  // this can be missing if, e.g., the series has been filtered out
  return (data.find((d) => d.label === highlighted.label) || {}).color;
}

const BASE_MARK_PROPS = {
  transitionDuration: {
    fill: animation.defaultDuration,
    stroke: animation.defaultDuration,
  },
};

const MARGIN = { bottom: 65, left: 56, right: 16, top: 48 };

export const CHART_HEIGHT = 475;
export const MIN_LEGEND_HEIGHT = 16;

const ChartWrapper = styled(BaseChartWrapper)`
  .frame {
    .visualization-layer {
      shape-rendering: geometricPrecision;
    }
  }
`;

const LegendWrapper = styled.div`
  /* px instead of rem for consistency with Semiotic */
  margin-left: ${MARGIN.left}px;
  min-height: ${MIN_LEGEND_HEIGHT}px;
`;

const Wrapper = styled.div``;

type RateTrendProps = {
  data: ChartData;
  highlighted?: ItemToHighlight;
  title?: string;
  xAccessor: string;
  xExtent?: XYFrameProps["xExtent"];
  xLabel?: string;
  xTicks?: number;
};

/**
 * Renders a line chart with the provided data.
 * `xAccessor` must be a property name in `data.coordinates` objects!
 */
export default function RateTrend({
  data,
  highlighted: externalHighlighted,
  title,
  xAccessor,
  xExtent,
  xLabel,
  xTicks = 10,
}: RateTrendProps): React.ReactElement {
  const [highlighted, setHighlighted] = useState<ItemToHighlight | undefined>();

  useEffect(() => {
    setHighlighted(externalHighlighted);
  }, [externalHighlighted]);

  const points = getPointData({ data, highlighted, xAccessor });
  const pointColor = getPointColor({ data, highlighted });
  const getTooltipProps: TooltipContentFunction = (d) => {
    const currentX = d[xAccessor];
    const records: TooltipContentProps["records"] = [];

    data.forEach((dataSeries) => {
      const matchingRecord = dataSeries.coordinates.find(
        (record) => record[xAccessor] === currentX
      );
      if (!matchingRecord) return;

      let pct: number | undefined = matchingRecord.rate;
      let value = `${formatAsNumber(
        matchingRecord.rateNumerator
      )} of ${formatAsNumber(matchingRecord.rateDenominator)}`;

      if (Number.isNaN(matchingRecord.rateNumerator)) {
        value = `${formatAsPct(pct)} of ${formatAsNumber(
          matchingRecord.rateDenominator
        )}`;

        pct = undefined;
      }

      records.push({
        color: dataSeries.color,
        label: dataSeries.label,
        pct,
        value,
      });
    });

    return {
      title: `${xLabel}: ${currentX}`,
      records,
    };
  };

  return (
    <MeasureWidth>
      {({ measureRef, width }) => (
        <Wrapper ref={measureRef}>
          {width <= 0 ? null : (
            <>
              <ChartWrapper>
                <XHoverController
                  lines={data}
                  margin={MARGIN}
                  otherChartProps={{
                    xExtent,
                  }}
                  size={[width, CHART_HEIGHT]}
                  tooltipControllerProps={{ getTooltipProps }}
                  xAccessor={xAccessor}
                >
                  <XYFrame
                    axes={[
                      {
                        baseline: false,
                        orient: "left",
                        tickFormat: formatAsPct,
                        ticks: 10,
                      },
                      {
                        baseline: false,
                        orient: "bottom",
                        tickSize: 0,
                        // @ts-expect-error seems to be a typing error in Semiotic,
                        // this needs to be a string
                        label: xLabel,
                        ticks: xTicks,
                      },
                    ]}
                    baseMarkProps={BASE_MARK_PROPS}
                    lineStyle={(d) => {
                      return {
                        fill: "none",
                        stroke:
                          highlighted && highlighted.label !== d?.label
                            ? // transparency helps this chart because the lines can overlap
                              highlightFade(d?.color, { useOpacity: true })
                            : d?.color,
                        strokeWidth: 2,
                      };
                    }}
                    lines={data}
                    points={points}
                    pointStyle={{
                      fill: pointColor,
                      r: 5,
                    }}
                    renderKey={(d) => d?.key || d?.label}
                    title={
                      title && (
                        <text x={width ? 0 - width / 2 + MARGIN.left : 0}>
                          {title}
                        </text>
                      )
                    }
                    xAccessor={xAccessor}
                    yAccessor="rate"
                    yExtent={[0, 1]}
                  />
                </XHoverController>
              </ChartWrapper>
              <LegendWrapper>
                <ColorLegend
                  highlighted={highlighted}
                  items={data}
                  setHighlighted={setHighlighted}
                />
              </LegendWrapper>
            </>
          )}
        </Wrapper>
      )}
    </MeasureWidth>
  );
}
