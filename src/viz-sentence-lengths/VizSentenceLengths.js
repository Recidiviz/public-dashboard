import PropTypes from "prop-types";
import React from "react";
import Measure from "react-measure";
import styled from "styled-components";
import BarChartTrellis from "../bar-chart-trellis";
import {
  recordIsTotalByDimension,
  recordIsTotal,
  categoryIsNotUnknown,
} from "../utils";
import {
  DIMENSION_MAPPINGS,
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  SENTENCE_LENGTHS,
  THEME,
} from "../constants";

const Wrapper = styled.div`
  width: 100%;
`;

export default function VizSentenceLengths({
  data: { sentenceLengths },
  dimension,
  locationId,
}) {
  if (!dimension || !locationId) return null;
  // TODO: factor out all this filtering logic for other breakdown sections?
  const filteredData = sentenceLengths
    .filter(({ district }) => district === locationId)
    .filter(recordIsTotalByDimension(dimension));
  const categories = DIMENSION_MAPPINGS.get(dimension);

  const chartData = [...categories]
    .filter(categoryIsNotUnknown)
    .map(([value, label]) => {
      const matchingRow = filteredData.find((record) =>
        dimension === DIMENSION_KEYS.total
          ? recordIsTotal(record)
          : record[DIMENSION_DATA_KEYS[dimension]] === value
      );
      return {
        title: label,
        data: [...SENTENCE_LENGTHS].map(([key, lengthLabel]) => ({
          color: THEME.colors.sentenceLengths[key],
          label: lengthLabel,
          value: matchingRow ? matchingRow[key] : 0,
        })),
      };
    });

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
