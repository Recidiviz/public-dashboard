import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ColorLegend from "../color-legend";

const ProportionalBarContainer = styled.figure`
  height: 100%;
  margin: 0;
  position: relative;
  width: 100%;
`;

const ProportionalBarChartWrapper = styled.div`
  height: 100%;
`;

const ProportionalBarMetadata = styled.figcaption`
  align-items: baseline;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  position: absolute;
  width: 100%;
`;
const ProportionalBarTitle = styled.div`
  color: ${(props) => props.theme.colors.body};
  flex: 0 0 auto;
  font: ${(props) => props.theme.fonts.body};
  margin-right: 15px;
`;

// if the legend doesn't wrap it should be roughly this size;
// the chart height will adjust as necessary
const INITIAL_METADATA_HEIGHT = 28;

export default function ProportionalBar({ data, title }) {
  // to both avoid janky chart animations and avoid height overflows
  // when the legend wraps to multiple lines, we need to measure its height
  // explicitly to determine the chart height
  const [metadataHeight, setMetadataHeight] = useState(INITIAL_METADATA_HEIGHT);
  return (
    <ProportionalBarContainer>
      <ProportionalBarChartWrapper>
        <ResponsiveOrdinalFrame
          data={data}
          // bottom margin leaves room for the title and legend
          margin={{ top: 0, left: 0, right: 0, bottom: metadataHeight }}
          oAccessor={() => title}
          projection="horizontal"
          rAccessor="value"
          renderKey="label"
          responsiveHeight
          responsiveWidth
          style={(d) => ({ fill: d.color })}
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
            <ColorLegend items={data} />
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
  title: PropTypes.string.isRequired,
};
