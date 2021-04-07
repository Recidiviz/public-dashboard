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
import React, { useState, useCallback } from "react";
import { FacetController, OrdinalFrame } from "semiotic";
import styled from "styled-components/macro";
import ChartWrapper from "../chart-wrapper";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";

import { formatAsPct, highlightFade } from "../utils";

const CHART_HEIGHT = 360;
const CHART_MIN_WIDTH = 320;

const MARGIN = { top: 40, bottom: 56, left: 48, right: 0 };

const Wrapper = styled(ChartWrapper)`
  display: flex;
  flex-wrap: wrap;

  /* optionally, hide every other Y axis in the trellis */
  .ordinalframe:nth-of-type(2n) {
    .axis {
      .left.y {
        display: ${(props) => (props.alternatingAxes ? "none" : "inherit")};
      }
    }
  }
`;

const ChartTitle = styled.text`
  text-anchor: start;
`;

const ColumnLabel = styled.text`
  text-anchor: middle;
`;

const BarAxisLabel = styled.text`
  text-anchor: middle;
`;

export default function BarChartTrellis({
  barAxisLabel,
  data,
  formatBarLabel,
  renderTooltip,
  setSelectedChartTitle,
  width,
}) {
  const [highlightedLabel, setHighlightedLabel] = useState();

  // ResponsiveTooltipController expects this to be a stable reference
  const setHighlighted = useCallback(
    (d) => setHighlightedLabel(d ? d.column.name : undefined),
    [setHighlightedLabel]
  );

  let chartWidth = data.length > 1 ? width / 2 : width;

  // if we are doing a two-column layout, only show Y axis in the left column
  let alternatingAxes = true;
  if (chartWidth < CHART_MIN_WIDTH) {
    chartWidth = width;
    alternatingAxes = false;
  }

  return (
    <Wrapper alternatingAxes={alternatingAxes}>
      <ResponsiveTooltipController
        getTooltipProps={renderTooltip}
        hoverAnnotation
        render={({
          customClickBehavior,
          customHoverBehavior,
          ...responsiveTooltipProps
        }) => (
          <FacetController
            // it's important to provide this to all facets even if we hide the axis,
            // because it determines how values are formatted in ARIA labels
            axes={[
              {
                baseline: false,
                orient: "left",
                tickFormat: formatAsPct,
                tickLineGenerator: () => null,
              },
            ]}
            backgroundGraphics={
              barAxisLabel ? (
                // this functions as an axis label, but there is no Semiotic API for this;
                // it's hidden from screen readers either way, so not a real a11y concern
                <BarAxisLabel
                  // Semiotic axis labels use this class, we want to pick up those styles here
                  className="axis-title"
                  x={
                    MARGIN.left + (chartWidth - MARGIN.left - MARGIN.right) / 2
                  }
                  y={CHART_HEIGHT - MARGIN.bottom / 3}
                >
                  {barAxisLabel}
                </BarAxisLabel>
              ) : undefined
            }
            baseMarkProps={{
              transitionDuration: { fill: THEME.transition.defaultDurationMs },
            }}
            margin={MARGIN}
            oAccessor="label"
            oLabel={(label) => (
              <ColumnLabel>{formatBarLabel(label)}</ColumnLabel>
            )}
            oPadding={8}
            rAccessor="pct"
            rExtent={[0, 1]}
            size={[chartWidth, CHART_HEIGHT]}
            style={(d) => ({
              fill:
                highlightedLabel && highlightedLabel !== d.label
                  ? highlightFade(d.color)
                  : d.color,
            })}
            type="bar"
          >
            {data.map(({ title, data: chartData }, index) => (
              <OrdinalFrame
                // we have to extend these custom behavior functions
                // to get the chart title into state for the tooltip;
                // they are guaranteed to be provided by ResponsiveTooltipController
                customClickBehavior={(d) => {
                  setSelectedChartTitle(title);
                  customClickBehavior(d);
                }}
                customHoverBehavior={(d) => {
                  setSelectedChartTitle(title);
                  customHoverBehavior(d);
                }}
                data={chartData}
                // using indices actually makes a better experience here;
                // the charts animate in and out based on how many there are
                // and we avoid bugs that happen when values change but the
                // identifiers (i.e. titles) stay the same
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                title={
                  <ChartTitle x={0 - chartWidth / 2 + MARGIN.left}>
                    {title}
                  </ChartTitle>
                }
                {...responsiveTooltipProps}
              />
            ))}
          </FacetController>
        )}
        setHighlighted={setHighlighted}
      />
    </Wrapper>
  );
}

BarChartTrellis.propTypes = {
  barAxisLabel: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
          pct: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  formatBarLabel: PropTypes.func,
  renderTooltip: PropTypes.func.isRequired,
  setSelectedChartTitle: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

BarChartTrellis.defaultProps = {
  barAxisLabel: undefined,
  formatBarLabel: (label) => label,
};
