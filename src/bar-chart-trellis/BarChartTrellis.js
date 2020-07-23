import PropTypes from "prop-types";
import React, { useState } from "react";
import { FacetController, OrdinalFrame } from "semiotic";
import styled from "styled-components";
import { SENTENCE_LENGTH_KEYS, SENTENCE_LENGTHS, THEME } from "../constants";
import ChartWrapper from "../chart-wrapper";
import Tooltip from "../tooltip";

const CHART_HEIGHT = 360;
const CHART_MIN_WIDTH = 320;

const MARGIN = { top: 40, bottom: 56, left: 48, right: 0 };

const Wrapper = styled(ChartWrapper)`
  display: flex;
  flex-wrap: wrap;
`;

const ChartTitle = styled.text`
  text-anchor: start;
`;

const ColumnLabel = styled.text`
  text-anchor: middle;
`;

const renderTooltip = (chartTitle) => ({ pieces: [d] }) => (
  <Tooltip>
    {chartTitle}
    <br />
    {d.value} serving {d.label} year(s)
  </Tooltip>
);

export default function BarChartTrellis({ data, width }) {
  const [highlightedLabel, setHighlightedLabel] = useState();

  let chartWidth = data.length > 1 ? width / 2 : width;

  let alternatingAxes = true;
  if (chartWidth < CHART_MIN_WIDTH) {
    chartWidth = width;
    alternatingAxes = false;
  }

  const axes = [
    { baseline: false, orient: "left", tickLineGenerator: () => null },
  ];

  return (
    <Wrapper>
      <FacetController
        baseMarkProps={{
          transitionDuration: { fill: THEME.transition.defaultDurationMs },
        }}
        margin={MARGIN}
        oAccessor="label"
        oLabel={(label) => {
          const postfix =
            label === SENTENCE_LENGTHS.get(SENTENCE_LENGTH_KEYS.lessThanOne)
              ? " year"
              : "";
          return <ColumnLabel>{`${label}${postfix}`}</ColumnLabel>;
        }}
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
            axes={alternatingAxes && index % 2 ? undefined : axes}
            customHoverBehavior={(d) =>
              d ? setHighlightedLabel(d.column.name) : setHighlightedLabel()
            }
            data={chartData}
            hoverAnnotation
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
