import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { DIMENSION_KEYS, TOTAL_KEY } from "../constants";
import BubbleChart from "../bubble-chart";

const VizParoleRevocationContainer = styled.div`
  height: 450px;
  width: 100%;
`;

const HEIGHT = 450;
const WIDTH = 994;

export default function VizParoleRevocation({ currentMonthData, dimension }) {
  return (
    <VizParoleRevocationContainer>
      {dimension === DIMENSION_KEYS.total && (
        <BubbleChart
          data={currentMonthData.get(TOTAL_KEY)}
          height={HEIGHT}
          width={WIDTH}
        />
      )}
    </VizParoleRevocationContainer>
  );
}

VizParoleRevocation.propTypes = {
  currentMonthData: PropTypes.instanceOf(Map).isRequired,
  dimension: PropTypes.string.isRequired,
};
