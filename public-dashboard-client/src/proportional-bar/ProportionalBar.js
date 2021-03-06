import { sum } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import styled from "styled-components";
import ColorLegend from "../color-legend";
import { THEME } from "../theme";
import { getDataWithPct, highlightFade } from "../utils";
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
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 4px;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.base};
`;
const ProportionalBarTitle = styled.div`
  flex: 0 1 auto;
  font-size: 12px;
  margin-right: 15px;
`;

const ProportionalBarLegendWrapper = styled.div`
  /*
    setting a non-auto basis lets the legend try to wrap internally
    before the container wraps the entire legend to its own line
  */
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
`;

export default function ProportionalBar({
  data,
  height,
  highlighted: externalHighlighted,
  setHighlighted: setExternalHighlighted,
  showLegend,
  title,
}) {
  const [localHighlighted, setLocalHighlighted] = useState();

  const dataWithPct = getDataWithPct(data);
  const noData = data.length === 0 || sum(data.map(({ value }) => value)) === 0;

  const highlighted = localHighlighted || externalHighlighted;

  return (
    <ProportionalBarContainer>
      <ProportionalBarChartWrapper>
        <ResponsiveTooltipController
          pieceHoverAnnotation
          // we don't ever want mark hover to affect other charts
          // so it can only control the local highlight state
          setHighlighted={setLocalHighlighted}
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
                highlighted && highlighted.label !== d.label
                  ? highlightFade(d.color)
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
        {showLegend && (
          <ProportionalBarLegendWrapper>
            <ColorLegend
              highlighted={highlighted}
              items={data}
              // legend may cover multiple charts in some layouts,
              // so it prefers the external highlight when present
              setHighlighted={setExternalHighlighted || setLocalHighlighted}
            />
          </ProportionalBarLegendWrapper>
        )}
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
  highlighted: PropTypes.shape({ label: PropTypes.string.isRequired }),
  setHighlighted: PropTypes.func,
  showLegend: PropTypes.bool,
  title: PropTypes.node.isRequired,
};

ProportionalBar.defaultProps = {
  highlighted: undefined,
  setHighlighted: undefined,
  showLegend: true,
};
