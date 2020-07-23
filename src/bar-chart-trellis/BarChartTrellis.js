import PropTypes from "prop-types";
import React from "react";
import { FacetController, OrdinalFrame } from "semiotic";
import styled from "styled-components";
import ChartWrapper from "../chart-wrapper";

const CHART_HEIGHT = 376;

const MARGIN = { top: 40, bottom: 56, left: 48, right: 0 };

const Wrapper = styled(ChartWrapper)`
  display: flex;
  flex-wrap: wrap;
`;

const ChartTitle = styled.text`
  text-anchor: start;
`;

export default function BarChartTrellis({ data, width }) {
  const chartWidth = data.length > 1 ? width / 2 : width;

  const axes = [
    { baseline: false, orient: "left", tickLineGenerator: () => null },
  ];

  return (
    <Wrapper>
      <FacetController
        margin={MARGIN}
        oAccessor="label"
        oLabel
        oPadding={8}
        rAccessor="value"
        sharedRExtent
        size={[chartWidth, CHART_HEIGHT]}
        style={(d) => ({ fill: d.color })}
        type="bar"
      >
        {data.map(({ title, data: chartData }, index) => (
          <OrdinalFrame
            axes={index % 2 ? undefined : axes}
            data={chartData}
            key={title}
            title={
              <ChartTitle x={0 - chartWidth / 2 + MARGIN.left}>
                {title}
              </ChartTitle>
            }
          />
        ))}
      </FacetController>
    </Wrapper>
  );
}

BarChartTrellis.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  width: PropTypes.number.isRequired,
};
