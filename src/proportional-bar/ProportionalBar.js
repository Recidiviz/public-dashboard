import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ColorLegend from "../color-legend";
import Tooltip from "../tooltip";
import { getDataWithPct } from "../utils";
import formatAsPct from "../utils/formatAsPct";

const ProportionalBarContainer = styled.figure`
  height: 100%;
  margin: 0;
  position: relative;
  width: 100%;
`;

const ProportionalBarChartWrapper = styled.div`
  height: 100%;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base + 1};
`;

const ProportionalBarMetadata = styled.figcaption`
  align-items: baseline;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  position: absolute;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.base};
`;
const ProportionalBarTitle = styled.div`
  color: ${(props) => props.theme.colors.body};
  flex: 0 0 auto;
  font: ${(props) => props.theme.fonts.body};
  margin-right: 15px;
`;

const ProportionalBarTooltipText = styled.p`
  ${(props) => (props.bold ? `font: ${props.theme.fonts.bodyBold};` : "")}
  line-height: 2;
  margin: 0;
  white-space: nowrap;
`;

// if the legend doesn't wrap it should be roughly this size;
// the chart height will adjust as necessary
const INITIAL_METADATA_HEIGHT = 28;

export default function ProportionalBar({ data, showLegend, title }) {
  // to both avoid janky chart animations and avoid height overflows
  // when the legend wraps to multiple lines, we need to measure its height
  // explicitly to determine the chart height
  const [metadataHeight, setMetadataHeight] = useState(INITIAL_METADATA_HEIGHT);

  const TOOLTIP_PADDING = 3;

  const dataWithPct = getDataWithPct(data);

  return (
    <ProportionalBarContainer>
      <ProportionalBarChartWrapper>
        <ResponsiveOrdinalFrame
          data={dataWithPct}
          // bottom margin leaves room for the title and legend
          margin={{ top: 0, left: 0, right: 0, bottom: metadataHeight }}
          oAccessor={() => title}
          pieceHoverAnnotation
          projection="horizontal"
          rAccessor="value"
          renderKey="label"
          responsiveHeight
          responsiveWidth
          style={(d) => ({ fill: d.color })}
          tooltipContent={(d) => {
            return (
              <Tooltip
                style={{
                  // d.y is the vertical center of the hover target; since we know there is only one bar,
                  // we know it is the vertical center of the entire chart and we can use it
                  // to push the tooltip below the chart
                  transform: `translateX(-50%) translateY(${
                    d.y + TOOLTIP_PADDING
                  }px)`,
                }}
              >
                <ProportionalBarTooltipText>
                  {d.label}
                </ProportionalBarTooltipText>
                <ProportionalBarTooltipText bold>
                  {d.value} ({formatAsPct(d.pct)})
                </ProportionalBarTooltipText>
              </Tooltip>
            );
          }}
          type="bar"
        />
      </ProportionalBarChartWrapper>
      <Measure
        bounds
        onResize={(contentRect) => setMetadataHeight(contentRect.bounds.height)}
      >
        {({ measureRef }) => (
          <ProportionalBarMetadata ref={measureRef}>
            <ProportionalBarTitle>{title}</ProportionalBarTitle>
            {showLegend && <ColorLegend items={data} />}
          </ProportionalBarMetadata>
        )}
      </Measure>
    </ProportionalBarContainer>
  );
}

ProportionalBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  showLegend: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

ProportionalBar.defaultProps = {
  showLegend: true,
};
