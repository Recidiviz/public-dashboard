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

import { scaleTime } from "d3-scale";
import { format, isEqual, parseISO } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import Measure from "react-measure";
import MinimapXYFrame from "semiotic/lib/MinimapXYFrame";
import styled from "styled-components/macro";
import BaseChartWrapper from "./ChartWrapper";
import { formatAsNumber, highlightFade } from "./utils";
import ColorLegend from "./ColorLegend";
import { ItemToHighlight } from "./types";
import { colors } from "../UiLibrary";
// import { CUSTOM_ID } from "../controls/TwoYearRangeControl";
// import XHoverController from "./XHoverController";

// TODO: magic string from filter UI
const CUSTOM_ID = "custom";

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

const BASE_MARK_PROPS = {
  transitionDuration: {
    // TODO: theme?
    fill: 500,
  },
};

const WindowedTimeSeries: React.FC<{
  data: any[];
  defaultRangeEnd: Date;
  defaultRangeStart?: Date;
  setTimeRangeId: (id: string) => void;
}> = ({ data, defaultRangeEnd, defaultRangeStart, setTimeRangeId }) => {
  const [highlighted, setHighlighted] = useState<ItemToHighlight>();
  const [dateRangeStart, setDateRangeStart] = useState<Date>();
  const [dateRangeEnd, setDateRangeEnd] = useState<Date>();

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
    <Measure bounds>
      {({ measureRef, contentRect: { bounds: { width } = { width: 0 } } }) => (
        <Wrapper ref={measureRef}>
          <ChartWrapper>
            {/* TODO: figure this out */}
            {/* <XHoverController
              lines={data}
              margin={MARGIN}
              otherChartProps={{
                xExtent: [dateRangeStart, dateRangeEnd],
                xScaleType: scaleTime(),
                yExtent: [0],
              }}
              size={[width, CHART_HEIGHT]}
              tooltipControllerProps={{
                getTooltipProps: (d) => {
                  const dateHovered = d.time;
                  return {
                    title: getDateLabel(dateHovered),
                    records: getDataWithPct(
                      d.points
                        .filter((p) => isEqual(p.data.time, dateHovered))
                        .map((p) => ({
                          label: p.parentLine.label,
                          value: p.data.population,
                        }))
                    ),
                  };
                },
              }}
              xAccessor="time"
            > */}
            <MinimapXYFrame
              axes={[
                {
                  orient: "left",
                  tickFormat: formatAsNumber,
                  tickSize: 0,
                },
                {
                  orient: "bottom",
                  tickFormat: (time: Date) => {
                    return time.getDate() === 1 ? format(time, "MMM y") : null;
                  },
                  tickSize: 0,
                  ticks: 10,
                },
              ]}
              baseMarkProps={BASE_MARK_PROPS}
              lines={data}
              lineStyle={(d = {}) => ({
                fill:
                  highlighted && highlighted.label !== d.label
                    ? highlightFade(d.color)
                    : d.color,
                stroke: colors.background,
                strokeWidth: 1,
              })}
              lineType={{ type: "stackedarea", sort: null } as any}
              matte={true as any}
              minimap={
                {
                  axes: [],
                  baseMarkProps: BASE_MARK_PROPS,
                  brushEnd: (brushExtent: any) => {
                    const [start, end] = brushExtent || [];
                    if (start && end) {
                      if (isNewRange({ start, end })) {
                        setTimeRangeId(CUSTOM_ID);
                      }

                      setDateRangeStart(new Date(start));
                      setDateRangeEnd(new Date(end));
                    }
                  },
                  margin: { ...MARGIN, bottom: 0 },
                  size: [width, MINIMAP_HEIGHT],
                  xBrushable: true,
                  xBrushExtent: [dateRangeStart, dateRangeEnd],
                  yBrushable: false,
                } as any
              }
              pointStyle={{ display: "none" }}
              // TODO: this was coming in as a Date object in v1?
              xAccessor={(d: any) => parseISO(d.date) as any}
              yAccessor="count"
              // TODO: these were part of xhovercontroller
              size={[width, CHART_HEIGHT]}
              margin={MARGIN}
              xExtent={[dateRangeStart, dateRangeEnd] as any}
              xScaleType={scaleTime() as any}
              yExtent={[0]}
            />
            {/* </XHoverController> */}
          </ChartWrapper>
          <LegendWrapper>
            <ColorLegend
              highlighted={highlighted}
              items={data}
              setHighlighted={setHighlighted}
            />
          </LegendWrapper>
        </Wrapper>
      )}
    </Measure>
  );
};

export default WindowedTimeSeries;
