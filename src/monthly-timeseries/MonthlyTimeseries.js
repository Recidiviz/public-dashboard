import { parse, format } from "date-fns";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ChartWrapper from "../chart-wrapper";
import Disclaimer from "../disclaimer";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";
import { formatAsPct, formatAsNumber, hoverColor } from "../utils";

const MonthlyTimeseriesWrapper = styled(ChartWrapper)`
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

const makeTooltipData = ({ summary: [d] }) => {
  return {
    title: format(parse(d.column, "yyyy-M", new Date()), "MMM y"),
    records: [
      {
        label: "Completion rate",
        value: `${formatAsNumber(d.data.actual || 0)} of ${formatAsNumber(
          d.data.projected || 0
        )}`,
        pct: d.data.rate,
      },
    ],
  };
};

export default function MonthlyTimeseries({ data }) {
  const [highlighted, setHighlighted] = useState();
  return (
    <MonthlyTimeseriesWrapper>
      <ResponsiveTooltipController
        getTooltipProps={makeTooltipData}
        hoverAnnotation
        setHighlighted={setHighlighted}
      >
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
          baseMarkProps={{
            transitionDuration: { fill: THEME.transition.defaultDurationMs },
          }}
          data={data}
          margin={chartMargins}
          oAccessor="month"
          oLabel={(labelText) => {
            const [year, month] = labelText.split("-");
            return month === "1" ? <TimeLabel>{year}</TimeLabel> : null;
          }}
          oPadding={2}
          rAccessor="rate"
          rExtent={[0, 1]}
          renderKey="month"
          responsiveWidth
          size={[undefined, 350]}
          style={(d) => ({
            fill:
              highlighted && d.column === highlighted.column.name
                ? hoverColor(THEME.colors.monthlyTimeseriesBar)
                : THEME.colors.monthlyTimeseriesBar,
          })}
          type="bar"
        />
      </ResponsiveTooltipController>
      <Disclaimer type="small-data" />
    </MonthlyTimeseriesWrapper>
  );
}

MonthlyTimeseries.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      projected: PropTypes.number.isRequired,
      actual: PropTypes.number.isRequired,
      rate: PropTypes.number.isRequired,
    })
  ).isRequired,
};
