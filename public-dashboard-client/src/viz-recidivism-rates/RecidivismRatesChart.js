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

import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import XYFrame from "semiotic/lib/XYFrame";
import styled from "styled-components";
import ChartWrapperBase from "../chart-wrapper";
import ColorLegend from "../color-legend";
import { THEME } from "../theme";
import { formatAsPct, highlightFade } from "../utils";
import XHoverController from "../x-hover-controller";

const BASE_MARK_PROPS = {
  transitionDuration: {
    fill: THEME.transition.defaultDurationMs,
    stroke: THEME.transition.defaultDurationMs,
  },
};

const CHART_TITLE = "Cumulative Recidivism Rate";
const LINE_COLORS = THEME.colors.dataViz;
const MARGIN = { bottom: 65, left: 56, right: 16, top: 48 };

const ChartWrapper = styled(ChartWrapperBase)`
  .frame {
    .visualization-layer {
      shape-rendering: geometricPrecision;
    }
  }
`;

const LegendWrapper = styled.div`
  margin-left: ${MARGIN.left}px;
`;

const Wrapper = styled.div``;

function addColorToRecord(record, i) {
  return { ...record, color: LINE_COLORS[i % LINE_COLORS.length] };
}

export default function RecidivismRatesChart({ data }) {
  const [highlighted, setHighlighted] = useState();

  const chartData = data.map(addColorToRecord);
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
              lines={chartData}
              margin={MARGIN}
              size={[width, 475]}
              tooltipControllerProps={{
                getTooltipProps: (d) => {
                  const currentPeriod = d.followupYears;
                  return {
                    title: `${currentPeriod} year${
                      currentPeriod > 1 ? "s" : ""
                    } since release`,
                    records: d.points
                      .filter((p) => p.data.followupYears === currentPeriod)
                      .map((p) => ({
                        label: p.parentLine.label,
                        pct: p.data.recidivismRate,
                        value: `${p.data.recidivated_releases} of ${p.data.releases}`,
                      })),
                  };
                },
              }}
              xAccessor="followupYears"
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
                    label: "Years since release",
                    orient: "bottom",
                    tickLineGenerator: () => null,
                    ticks: 10,
                  },
                ]}
                baseMarkProps={BASE_MARK_PROPS}
                lineStyle={(d) => {
                  return {
                    fill: "none",
                    stroke:
                      highlighted && highlighted.label !== d.label
                        ? highlightFade(d.color)
                        : d.color,
                    strokeWidth: 2,
                  };
                }}
                lines={chartData}
                pointStyle={(d) => {
                  return {
                    fill:
                      highlighted && highlighted.label !== d.parentLine.label
                        ? highlightFade(d.parentLine.color)
                        : d.parentLine.color,
                    r: 5,
                  };
                }}
                showLinePoints
                title={
                  <text x={width ? 0 - width / 2 + MARGIN.left : 0}>
                    {CHART_TITLE}
                  </text>
                }
                xAccessor="followupYears"
                yAccessor="recidivismRate"
                yExtent={[0, 1]}
              />
            </XHoverController>
          </ChartWrapper>
          <LegendWrapper>
            <ColorLegend
              highlighted={highlighted}
              items={chartData}
              setHighlighted={setHighlighted}
            />
          </LegendWrapper>
        </Wrapper>
      )}
    </Measure>
  );
}

RecidivismRatesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      coordinates: PropTypes.arrayOf(
        PropTypes.shape({
          followupYears: PropTypes.number.isRequired,
          recidivismRate: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
