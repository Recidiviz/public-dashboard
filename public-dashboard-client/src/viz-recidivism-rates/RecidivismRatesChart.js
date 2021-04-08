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
import React, { useEffect, useState } from "react";
import Measure from "react-measure";
import XYFrame from "semiotic/lib/XYFrame";
import styled from "styled-components/macro";
import ChartWrapperBase from "../chart-wrapper";
import ColorLegend from "../color-legend";
import { DIMENSION_DATA_KEYS } from "../constants";
import { THEME } from "../theme";
import { formatAsPct, highlightFade } from "../utils";
import XHoverController from "../x-hover-controller";

/**
 * Extracts point data for the highlighted series from chart data.
 * Returns an empty array if there is no highlight or no matching series.
 */
function getPointData({ data, highlighted }) {
  // we only show points as part of highlight behavior
  if (!highlighted) return [];

  const highlightedSeries = data.find((d) => d.label === highlighted.label);
  // this can be missing if, e.g., the series has been filtered out
  if (!highlightedSeries) return [];

  return highlightedSeries.coordinates.map((point) => {
    return {
      ...point,
      // this big ol' string ensures uniqueness for both cohort and demographic series
      key: `${point.releaseCohort}-${point[DIMENSION_DATA_KEYS.race]}${
        point[DIMENSION_DATA_KEYS.age]
      }${point[DIMENSION_DATA_KEYS.gender]}-${point.followupYears}`,
    };
  });
}

function getPointColor({ data, highlighted }) {
  // we only show points as part of highlight behavior
  if (!highlighted) return undefined;
  // this can be missing if, e.g., the series has been filtered out
  return (data.find((d) => d.label === highlighted.label) || {}).color;
}

const BASE_MARK_PROPS = {
  transitionDuration: {
    fill: THEME.transition.defaultDurationMs,
    stroke: THEME.transition.defaultDurationMs,
  },
};

const CHART_TITLE = "Cumulative Recidivism Rate";
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

export default function RecidivismRatesChart({ data, highlightedCohort }) {
  const [highlighted, setHighlighted] = useState();

  useEffect(() => {
    setHighlighted(highlightedCohort);
  }, [highlightedCohort]);

  const points = getPointData({ data, highlighted });
  const pointColor = getPointColor({ data, highlighted });

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
                xExtent: [0, 10],
              }}
              size={[width, 475]}
              tooltipControllerProps={{
                getTooltipProps: (d) => {
                  const currentPeriod = d.followupYears;
                  return {
                    title: `${currentPeriod} year${
                      currentPeriod === 1 ? "" : "s"
                    } since release`,
                    records: d.points
                      .filter((p) => p.data.followupYears === currentPeriod)
                      .map((p) => ({
                        color: p.parentLine.color,
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
                        ? // transparency helps this chart because the lines can overlap
                          highlightFade(d.color, { useOpacity: true })
                        : d.color,
                    strokeWidth: 2,
                  };
                }}
                lines={data}
                points={points}
                pointStyle={{
                  fill: pointColor,
                  r: 5,
                }}
                renderKey={(d) => d.key}
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
              items={data}
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
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      coordinates: PropTypes.arrayOf(
        PropTypes.shape({
          followupYears: PropTypes.number.isRequired,
          recidivismRate: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  highlightedCohort: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
};

RecidivismRatesChart.defaultProps = {
  highlightedCohort: undefined,
};
