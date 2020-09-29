import useBreakpoint from "@w11r/use-breakpoint";
import { scaleTime } from "d3-scale";
import { isEqual, format, startOfMonth } from "date-fns";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import Measure from "react-measure";
import MinimapXYFrame from "semiotic/lib/MinimapXYFrame";
import styled from "styled-components";
import BaseChartWrapper from "../chart-wrapper";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";
import { formatAsNumber, getDataWithPct, highlightFade } from "../utils";
import ColorLegend from "../color-legend";
import { CUSTOM_ID } from "../controls/TwoYearRangeControl";

const MARGIN = { bottom: 65, left: 56, right: 8, top: 8 };

const Wrapper = styled.div``;

const LegendWrapper = styled.div`
  margin-top: 24px;
  padding-left: ${MARGIN.left}px;
`;

const ChartWrapper = styled(BaseChartWrapper)`
  .frame {
    circle.frame-hover {
      display: none;
    }

    path.subject {
      stroke: ${(props) => props.theme.colors.highlight};
    }

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
      const thisMonth = startOfMonth(new Date());
      if (defaultRangeStart > thisMonth) {
        throw new RangeError(
          "Start of time range must precede the current month."
        );
      }
      setDateRangeStart(defaultRangeStart);
      setDateRangeEnd(thisMonth);
    }
  }, [defaultRangeStart]);

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
            <ResponsiveTooltipController
              getTooltipProps={(d) => {
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
              }}
              hoverAnnotation={[
                { type: "x", disable: ["connector", "note"] },
                { type: "frame-hover" },
              ]}
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
                margin={MARGIN}
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
                  size: [width, 80],
                  xBrushable: true,
                  xBrushExtent: [dateRangeStart, dateRangeEnd],
                  yBrushable: false,
                }}
                pointStyle={{ display: "none" }}
                size={[width, 430]}
                xAccessor="time"
                xExtent={[dateRangeStart, dateRangeEnd]}
                xScaleType={scaleTime()}
                yAccessor="population"
                yExtent={[0]}
              />
            </ResponsiveTooltipController>
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
  defaultRangeStart: PropTypes.instanceOf(Date),
  setTimeRangeId: PropTypes.func.isRequired,
};

VizPopulationOverTime.defaultProps = {
  defaultRangeStart: undefined,
};
