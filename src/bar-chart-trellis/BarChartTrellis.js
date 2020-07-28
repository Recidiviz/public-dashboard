import PropTypes from "prop-types";
import React, { useState } from "react";
import { FacetController, OrdinalFrame } from "semiotic";
import styled from "styled-components";
import { SENTENCE_LENGTH_KEYS, SENTENCE_LENGTHS, THEME } from "../constants";
import ChartWrapper from "../chart-wrapper";
import ResponsiveTooltipController from "../responsive-tooltip-controller";

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

export default function BarChartTrellis({ data, width }) {
  const [highlightedLabel, setHighlightedLabel] = useState();
  const [selectedChartTitle, setSelectedChartTitle] = useState();

  let chartWidth = data.length > 1 ? width / 2 : width;

  let alternatingAxes = true;
  if (chartWidth < CHART_MIN_WIDTH) {
    chartWidth = width;
    alternatingAxes = false;
  }

  const axes = [
    { baseline: false, orient: "left", tickLineGenerator: () => null },
  ];

  const renderTooltip = (columnData) => {
    const {
      summary: [d],
    } = columnData;

    return {
      title: selectedChartTitle || "",
      records: [
        {
          label: `${d.column} year${
            d.column === SENTENCE_LENGTHS.get(SENTENCE_LENGTH_KEYS.lessThanOne)
              ? ""
              : "s"
          }`,
          value: d.value,
        },
      ],
    };
  };

  return (
    <Wrapper>
      <ResponsiveTooltipController
        getTooltipProps={renderTooltip}
        hoverAnnotation
        render={({
          customClickBehavior,
          customHoverBehavior,
          ...responsiveTooltipProps
        }) => (
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
              fill:
                highlightedLabel === d.label ? THEME.colors.highlight : d.color,
            })}
            type="bar"
          >
            {data.map(({ title, data: chartData }, index) => (
              <OrdinalFrame
                axes={alternatingAxes && index % 2 ? undefined : axes}
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
        setHighlighted={(d) =>
          setHighlightedLabel(d ? d.column.name : undefined)
        }
      />
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
