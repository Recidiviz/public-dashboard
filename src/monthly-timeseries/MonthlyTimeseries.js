import PropTypes from "prop-types";
import React from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import { THEME } from "../constants";
import { formatAsPct } from "../utils";

const MonthlyTimeseriesWrapper = styled.div`
  height: 350px;
  width: 100%;

  /* classes provided by Semiotic */
  .frame {
    .axis-baseline {
      stroke: ${(props) => props.theme.colors.chartAxis};
    }

    .axis-label,
    .ordinal-labels {
      fill: ${(props) => props.theme.colors.chartAxis};
      font: ${(props) => props.theme.fonts.body};
      font-size: 12px;
    }

    .background-graphics,
    .visualization-layer {
      shape-rendering: crispEdges;
    }
  }
`;

const chartMargins = {
  top: 10,
  bottom: 20,
  left: 50,
  right: 0,
};

const TimeLabel = styled.text`
  text-anchor: middle;
`;

export default function MonthlyTimeseries({ data }) {
  return (
    <MonthlyTimeseriesWrapper>
      <ResponsiveOrdinalFrame
        axes={[
          {
            baseline: false,
            orient: "left",
            tickFormat: formatAsPct,
            tickLineGenerator: () => null,
            ticks: 3,
          },
        ]}
        data={data}
        margin={chartMargins}
        oAccessor="month"
        oLabel={(labelText) =>
          labelText.startsWith("1-") ? (
            <TimeLabel>{labelText.split("-")[1]}</TimeLabel>
          ) : null
        }
        rAccessor="value"
        rExtent={[0, 1]}
        responsiveHeight
        responsiveWidth
        style={{ fill: THEME.colors.monthlyTimeseriesBar }}
        type="bar"
      />
    </MonthlyTimeseriesWrapper>
  );
}

MonthlyTimeseries.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};
