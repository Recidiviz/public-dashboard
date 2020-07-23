import PropTypes from "prop-types";
import React, { useState } from "react";
import { FacetController, OrdinalFrame } from "semiotic";
import styled from "styled-components";
import { THEME } from "../constants";
import ChartWrapper from "../chart-wrapper";
import Tooltip from "../tooltip";

const CHART_HEIGHT = 360;

const MARGIN = { top: 40, bottom: 56, left: 48, right: 0 };

const Wrapper = styled(ChartWrapper)`
  display: flex;
  flex-wrap: wrap;
`;

const ChartTitle = styled.text`
  text-anchor: start;
`;

const renderTooltip = (chartTitle) => ({ pieces: [d] }) => (
  <Tooltip>
    {chartTitle}
    <br />
    {d.value} serving {d.label} years
  </Tooltip>
);

export default function BarChartTrellis({ data, width }) {
  const [highlightedLabel, setHighlightedLabel] = useState();

  const chartWidth = data.length > 1 ? width / 2 : width;

  const axes = [
    { baseline: false, orient: "left", tickLineGenerator: () => null },
  ];

  return (
    <Wrapper>
      <FacetController
        baseMarkProps={{
          transitionDuration: { default: THEME.transition.defaultDurationMs },
        }}
        margin={MARGIN}
        oAccessor="label"
        oLabel
        oPadding={8}
        rAccessor="value"
        sharedRExtent
        size={[chartWidth, CHART_HEIGHT]}
        style={(d) => ({
          fill: highlightedLabel === d.label ? THEME.colors.highlight : d.color,
        })}
        type="bar"
      >
        {data.map(({ title, data: chartData }, index) => (
          <OrdinalFrame
            axes={index % 2 ? undefined : axes}
            customHoverBehavior={(d) =>
              d ? setHighlightedLabel(d.column.name) : setHighlightedLabel()
            }
            data={chartData}
            hoverAnnotation
            key={title}
            title={
              <ChartTitle x={0 - chartWidth / 2 + MARGIN.left}>
                {title}
              </ChartTitle>
            }
            tooltipContent={renderTooltip(title)}
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
