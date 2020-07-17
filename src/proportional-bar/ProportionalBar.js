import PropTypes from "prop-types";
import React from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ColorLegend from "../color-legend";
import Tooltip from "../tooltip";
import { getDataWithPct } from "../utils";
import formatAsPct from "../utils/formatAsPct";

const ProportionalBarContainer = styled.figure`
  height: 100%;
  margin: 0;
  width: 100%;
`;

const ProportionalBarChartWrapper = styled.div`
  height: 100%;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base + 1};
`;

const ProportionalBarMetadata = styled.figcaption`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
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

export default function ProportionalBar({ data, height, showLegend, title }) {
  const TOOLTIP_PADDING = 3;

  const dataWithPct = getDataWithPct(data);

  return (
    <ProportionalBarContainer>
      <ProportionalBarChartWrapper>
        <ResponsiveOrdinalFrame
          data={dataWithPct}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          oAccessor={() => title}
          pieceHoverAnnotation
          projection="horizontal"
          rAccessor="value"
          renderKey="label"
          responsiveWidth
          // the width value is just a placeholder, it will be 100% per responsiveWidth
          size={[0, height]}
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
      <ProportionalBarMetadata>
        <ProportionalBarTitle>{title}</ProportionalBarTitle>
        {showLegend && <ColorLegend items={data} />}
      </ProportionalBarMetadata>
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
  height: PropTypes.number.isRequired,
  showLegend: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

ProportionalBar.defaultProps = {
  showLegend: true,
};
