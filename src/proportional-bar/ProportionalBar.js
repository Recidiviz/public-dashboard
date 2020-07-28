import { sum } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ColorLegend from "../color-legend";
import { THEME } from "../constants";
import { getDataWithPct } from "../utils";
import ResponsiveTooltipController from "../responsive-tooltip-controller";

const ProportionalBarContainer = styled.figure`
  height: 100%;
  margin: 0;
  width: 100%;
`;

const ProportionalBarChartWrapper = styled.div`
  background: ${(props) => props.theme.colors.noData};
  height: 100%;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base + 1};

  .ProportionalBarChart__segment {
    stroke: ${(props) => props.theme.colors.background};
    stroke-width: 2;
  }
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

export default function ProportionalBar({ data, height, showLegend, title }) {
  const [highlighted, setHighlighted] = useState();

  const dataWithPct = getDataWithPct(data);
  const noData = data.length === 0 || sum(data.map(({ value }) => value)) === 0;

  return (
    <ProportionalBarContainer>
      <ProportionalBarChartWrapper>
        <ResponsiveTooltipController
          pieceHoverAnnotation
          setHighlighted={setHighlighted}
        >
          <ResponsiveOrdinalFrame
            baseMarkProps={{
              transitionDuration: { fill: THEME.transition.defaultDurationMs },
            }}
            data={dataWithPct}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            oAccessor={() => title}
            pieceClass="ProportionalBarChart__segment"
            projection="horizontal"
            rAccessor="value"
            renderKey="label"
            responsiveWidth
            // the width value is just a placeholder, it will be 100% per responsiveWidth
            size={[0, height]}
            style={(d) => ({
              fill:
                (highlighted || {}).label === d.label
                  ? THEME.colors.highlight
                  : d.color,
            })}
            type="bar"
          />
        </ResponsiveTooltipController>
      </ProportionalBarChartWrapper>
      <ProportionalBarMetadata>
        <ProportionalBarTitle>
          {title}
          {noData && ", No Data"}
        </ProportionalBarTitle>
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
