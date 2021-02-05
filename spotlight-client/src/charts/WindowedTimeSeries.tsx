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

import useBreakpoint from "@w11r/use-breakpoint";
import { scaleTime } from "d3-scale";
import { format, isEqual } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import MinimapXYFrame from "semiotic/lib/MinimapXYFrame";
import styled from "styled-components/macro";
import { animation, colors } from "../UiLibrary";
import { formatAsNumber } from "../utils";
import BaseChartWrapper from "./ChartWrapper";
import { highlightFade, useHighlightedItem } from "./utils";
import ColorLegend from "./ColorLegend";
import XHoverController from "./XHoverController";
import { HistoricalPopulationBreakdownRecord } from "../metricsApi";
import { DataSeries } from "./types";
import MeasureWidth from "../MeasureWidth";
import calculatePct from "../contentModels/calculatePct";

const CHART_HEIGHT = 430;
const MARGIN = { bottom: 65, left: 56, right: 8, top: 8 };
const MINIMAP_HEIGHT = 80;

const Wrapper = styled.div``;

const LegendWrapper = styled.div`
  margin-top: 24px;
  padding-left: ${MARGIN.left}px;
`;

const ChartWrapper = styled(BaseChartWrapper)`
  .frame {
    .visualization-layer {
      shape-rendering: geometricPrecision;
    }

    .axis.x {
      text.axis-label {
        text-anchor: end;
        transform: translate(6px, -14px) rotate(-45deg);
      }
    }
  }
`;

const getDateLabel = (date: Date) => format(date, "MMM d y");

function getDataForDate({
  date,
  dataSeries,
}: {
  date: Date;
  dataSeries: DataSeries<HistoricalPopulationBreakdownRecord>[];
}) {
  return calculatePct(
    dataSeries.map(({ label, coordinates }) => {
      const point = coordinates.find((record) => isEqual(record.date, date));
      // if missing data was properly imputed this should never happen
      if (point === undefined)
        throw new Error(`unable to find ${label} data for ${date}`);
      return { label, value: point.count };
    })
  );
}

const BASE_MARK_PROPS = {
  transitionDuration: {
    fill: animation.defaultDuration,
  },
};

const WindowSizeIdList = ["20", "10", "5", "1", "custom"] as const;
export type WindowSizeId = typeof WindowSizeIdList[number];
export function isWindowSizeId(x: string): x is WindowSizeId {
  return WindowSizeIdList.includes(x as never);
}

const WindowedTimeSeries: React.FC<{
  data: DataSeries<HistoricalPopulationBreakdownRecord>[];
  defaultRangeEnd: Date;
  defaultRangeStart?: Date;
  setTimeRangeId: (id: WindowSizeId) => void;
}> = ({ data, defaultRangeEnd, defaultRangeStart, setTimeRangeId }) => {
  const { highlighted, setHighlighted } = useHighlightedItem();
  const [dateRangeStart, setDateRangeStart] = useState<Date | undefined>();
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | undefined>();
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (defaultRangeStart) {
      // maintain sanity here by requiring start to precede end
      if (defaultRangeStart > defaultRangeEnd) {
        throw new RangeError(
          "Start of time range must precede the current month."
        );
      }
      setDateRangeStart(defaultRangeStart);
      setDateRangeEnd(defaultRangeEnd);
    }
  }, [defaultRangeEnd, defaultRangeStart]);

  const isNewRange = useCallback(
    ({ start, end }) => {
      if (dateRangeStart && dateRangeEnd) {
        return (
          start !== dateRangeStart.valueOf() || end !== dateRangeEnd.valueOf()
        );
      }
      return undefined;
    },
    [dateRangeEnd, dateRangeStart]
  );

  return (
    <MeasureWidth>
      {({ measureRef, width }) => {
        return (
          <Wrapper ref={measureRef}>
            <ChartWrapper>
              <XHoverController
                lines={data}
                margin={MARGIN}
                otherChartProps={{
                  // @ts-expect-error Semiotic typedefs are wrong,
                  // we can use dates as long as the scale accepts them
                  xExtent: [dateRangeStart, dateRangeEnd],
                  // @ts-expect-error Semiotic typedefs are wrong, we can
                  // use a time scale here, not just a numeric one.
                  // xExtent depends on this
                  xScaleType: scaleTime(),
                  yExtent: [0],
                }}
                size={[width, CHART_HEIGHT]}
                tooltipControllerProps={{
                  /**
                   * This function collects a "vertical slice" of all the areas
                   * to display all values matching the targeted date
                   */
                  getTooltipProps: (d) => {
                    // d.date is present because it's in our record format
                    const dateHovered = d.date as Date;
                    return {
                      title: getDateLabel(dateHovered),
                      records: getDataForDate({
                        date: dateHovered,
                        dataSeries: data,
                      }),
                    };
                  },
                }}
                xAccessor="date"
              >
                <MinimapXYFrame
                  axes={[
                    {
                      orient: "left",
                      tickFormat: formatAsNumber,
                      tickSize: 0,
                    },
                    {
                      orient: "bottom",
                      tickFormat: (time: Date) =>
                        time.getDate() === 1 ? format(time, "MMM y") : null,
                      ticks: isMobile ? 5 : 10,
                      tickSize: 0,
                    },
                  ]}
                  baseMarkProps={BASE_MARK_PROPS}
                  lines={data}
                  lineStyle={(d: DataSeries) => ({
                    fill:
                      highlighted && highlighted.label !== d.label
                        ? highlightFade(d.color)
                        : d.color,
                    stroke: colors.background,
                    strokeWidth: 1,
                  })}
                  // @ts-expect-error Semiotic typedefs are incomplete, this works
                  lineType={{ type: "stackedarea", sort: null }}
                  // @ts-expect-error Semiotic typedefs are wrong, can be true for default matte
                  matte
                  minimap={{
                    // @ts-expect-error Semiotic typedefs are incomplete
                    axes: [],
                    baseMarkProps: BASE_MARK_PROPS,
                    brushEnd: (brushExtent: Date[]) => {
                      const [start, end] = brushExtent || [];
                      if (start && end) {
                        if (isNewRange({ start, end })) {
                          setTimeRangeId("custom");
                        }

                        setDateRangeStart(new Date(start));
                        setDateRangeEnd(new Date(end));
                      }
                    },
                    margin: { ...MARGIN, bottom: 0 },
                    size: [width, MINIMAP_HEIGHT],
                    // suppress brush area if width is 0 to prevent SVG rendering errors
                    xBrushable: Boolean(width),
                    xBrushExtent: [dateRangeStart, dateRangeEnd],
                    yBrushable: false,
                  }}
                  pointStyle={{ display: "none" }}
                  xAccessor="date"
                  yAccessor="count"
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
          </Wrapper>
        );
      }}
    </MeasureWidth>
  );
};

export default WindowedTimeSeries;
