import { scaleTime } from "d3-scale";
import { isEqual, format } from "date-fns";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import XYFrame from "semiotic/lib/XYFrame";
import styled from "styled-components";
import BaseChartWrapper from "../chart-wrapper";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";
import { formatAsNumber, getDataWithPct, highlightFade } from "../utils";
import ColorLegend from "../color-legend";

const MARGIN = { bottom: 40, left: 56, right: 8, top: 8 };

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

    .xyframe-line {
      transition: fill ${(props) => props.theme.transition.defaultTimeSettings};
    }

    .axis.x {
      text.axis-label {
        transform: rotate(-45deg);
      }
    }
  }
`;

const getDateLabel = (date) => format(date, "MMM d y");

export default function VizPopulationOverTime({ data }) {
  const [highlighted, setHighlighted] = useState();

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
              <XYFrame
                axes={[
                  {
                    orient: "left",
                    tickFormat: formatAsNumber,
                    tickLineGenerator: () => null,
                  },
                  {
                    orient: "bottom",
                    tickFormat: (time) => format(time, "y"),
                    tickLineGenerator: () => null,
                  },
                ]}
                baseMarkProps={{
                  // this disables JS animations
                  // (we have implemented CSS transitions instead, which perform better here)
                  forceUpdate: true,
                }}
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
                pointStyle={{ display: "none" }}
                size={[width, 430]}
                xAccessor="time"
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
};

VizPopulationOverTime.defaultProps = {};
