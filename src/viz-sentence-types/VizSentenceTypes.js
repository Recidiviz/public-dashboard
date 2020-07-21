import PropTypes from "prop-types";
import React from "react";
import Measure from "react-measure";
import styled from "styled-components";
import {
  DIMENSION_DATA_KEYS,
  DIMENSION_MAPPINGS,
  DIMENSION_KEYS,
  DIMENSION_LABELS,
} from "../constants";
import SentenceTypesChart from "../sentence-types-chart";
import { recordIsTotalByDimension } from "../utils";

const VizSentenceTypesWrapper = styled.div`
  width: 100%;
`;

export default function VizSentenceTypes({
  data: { sentenceTypes },
  dimension,
  locationId,
}) {
  const chartData = sentenceTypes
    .filter(({ district }) => district === locationId)
    .filter(recordIsTotalByDimension(dimension))
    .map((record) => {
      let target;
      if (dimension === DIMENSION_KEYS.total) {
        target = DIMENSION_LABELS[DIMENSION_KEYS.total];
      } else {
        target = DIMENSION_MAPPINGS.get(dimension).get(
          record[DIMENSION_DATA_KEYS[dimension]]
        );
      }
      return [
        { source: "Incarceration", target, value: record.incarceration_count },
        { source: "Probation", target, value: record.probation_count },
      ];
    })
    .reduce((flat, val) => flat.concat(val), []);

  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => (
        <VizSentenceTypesWrapper ref={measureRef}>
          <SentenceTypesChart data={chartData} width={width} />
        </VizSentenceTypesWrapper>
      )}
    </Measure>
  );
}

VizSentenceTypes.propTypes = {
  data: PropTypes.shape({
    sentenceTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
  locationId: PropTypes.string,
};

VizSentenceTypes.defaultProps = {
  dimension: undefined,
  locationId: undefined,
};
