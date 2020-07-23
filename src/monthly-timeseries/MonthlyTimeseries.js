import PropTypes from "prop-types";
import React from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ChartWrapper from "../chart-wrapper";
import { THEME } from "../constants";
import { formatAsPct } from "../utils";

const MonthlyTimeseriesWrapper = styled(ChartWrapper)`
  height: 350px;
  width: 100%;
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
        oLabel={(labelText) => {
          const [year, month] = labelText.split("-");
          return month === "1" ? <TimeLabel>{year}</TimeLabel> : null;
        }}
        rAccessor="value"
        rExtent={[0, 1]}
        renderKey="month"
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
