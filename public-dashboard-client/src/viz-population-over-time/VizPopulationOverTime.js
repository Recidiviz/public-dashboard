// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import Measure from "react-measure";
import MinimapXYFrame from "semiotic/lib/MinimapXYFrame";
import styled from "styled-components";
import BaseChartWrapper from "../chart-wrapper";
import { THEME } from "../theme";
import { formatAsNumber, getDataWithPct, highlightFade } from "../utils";
import ColorLegend from "../color-legend";
import { CUSTOM_ID } from "../controls/TwoYearRangeControl";
import XHoverController from "../x-hover-controller";

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

const getDateLabel = (date) => format(date, "MMM d y");

const BASE_MARK_PROPS = {
  transitionDuration: {
    fill: THEME.transition.defaultDurationMs,
  },
};

export default function VizPopulationOverTime({
  data,
  defaultRangeEnd,
  defaultRangeStart,
  setTimeRangeId,
}) {
  const [highlighted, setHighlighted] = useState();
  const [dateRangeStart, setDateRangeStart] = useState();
  const [dateRangeEnd, setDateRangeEnd] = useState();
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
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => (
        <Wrapper ref={measureRef}>
          <ChartWrapper>
            <XHoverController
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
            >
              <MinimapXYFrame
                axes={[
                  {
                    orient: "left",
                    tickFormat: formatAsNumber,
                    tickLineGenerator: () => null,
                  },
                  {
                    orient: "bottom",
                    tickFormat: (time) =>
                      time.getDate() === 1 ? format(time, "MMM y") : null,
                    tickLineGenerator: () => null,
                    ticks: isMobile ? 5 : 10,
                  },
                ]}
                baseMarkProps={BASE_MARK_PROPS}
                lines={data}
                lineStyle={(d) => ({
                  fill:
                    highlighted && highlighted.label !== d.label
                      ? highlightFade(d.color)
                      : d.color,
                  stroke: THEME.colors.background,
                  strokeWidth: 1,
                })}
                lineType={{ type: "stackedarea", sort: null }}
                matte
                minimap={{
                  axes: [],
                  baseMarkProps: BASE_MARK_PROPS,
                  brushEnd: (brushExtent) => {
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
                }}
                pointStyle={{ display: "none" }}
                xAccessor="time"
                yAccessor="population"
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
      )}
    </Measure>
  );
}

VizPopulationOverTime.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultRangeEnd: PropTypes.instanceOf(Date).isRequired,
  defaultRangeStart: PropTypes.instanceOf(Date),
  setTimeRangeId: PropTypes.func.isRequired,
};

VizPopulationOverTime.defaultProps = {
  defaultRangeStart: undefined,
};
