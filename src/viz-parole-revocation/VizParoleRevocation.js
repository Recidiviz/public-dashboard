import PropTypes from "prop-types";
import React from "react";
import Measure from "react-measure";
import styled from "styled-components";
import { DIMENSION_KEYS, TOTAL_KEY } from "../constants";
import BubbleChart from "../bubble-chart";

const HEIGHT = 450;

const VizParoleRevocationContainer = styled.div`
  height: ${HEIGHT}px;
  width: 100%;
`;

export default function VizParoleRevocation({ currentMonthData, dimension }) {
  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => (
        <VizParoleRevocationContainer ref={measureRef}>
          {width && dimension === DIMENSION_KEYS.total && (
            <BubbleChart
              data={currentMonthData.get(TOTAL_KEY)}
              height={HEIGHT}
              width={width}
            />
          )}
        </VizParoleRevocationContainer>
      )}
    </Measure>
  );
}

VizParoleRevocation.propTypes = {
  currentMonthData: PropTypes.instanceOf(Map).isRequired,
  dimension: PropTypes.string.isRequired,
};
