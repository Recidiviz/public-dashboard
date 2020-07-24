import PropTypes from "prop-types";
import React from "react";
import Measure from "react-measure";
import styled from "styled-components";
import BarChartTrellis from "../bar-chart-trellis";
import { getDimensionalBreakdown } from "../utils";
import { SENTENCE_LENGTHS, THEME } from "../constants";

const Wrapper = styled.div`
  width: 100%;
`;

export default function VizSentenceLengths({
  data: { sentenceLengths },
  dimension,
  locationId,
}) {
  if (!dimension || !locationId) return null;

  const chartData = getDimensionalBreakdown({
    data: sentenceLengths.filter(({ district }) => district === locationId),
    dimension,
  }).map(({ label, record }) => ({
    title: label,
    data: [...SENTENCE_LENGTHS].map(([key, lengthLabel]) => ({
      color: THEME.colors.sentenceLengths[key],
      label: lengthLabel,
      value: record ? record[key] : 0,
    })),
  }));

  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => {
        return (
          <Wrapper ref={measureRef}>
            <BarChartTrellis data={chartData} width={width || 0} />
          </Wrapper>
        );
      }}
    </Measure>
  );
}

VizSentenceLengths.propTypes = {
  data: PropTypes.shape({
    sentenceLengths: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
  locationId: PropTypes.string,
};

VizSentenceLengths.defaultProps = {
  dimension: undefined,
  locationId: undefined,
};
