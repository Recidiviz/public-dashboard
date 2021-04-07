import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import styled from "styled-components/macro";
import BarChartTrellis from "../bar-chart-trellis";
import { getDataWithPct, getDimensionalBreakdown } from "../utils";
import { SENTENCE_LENGTHS, SENTENCE_LENGTH_KEYS } from "../constants";
import { THEME } from "../theme";
import Disclaimer from "../disclaimer";

const Wrapper = styled.div`
  width: 100%;
`;

/**
 * Adds a "year" label postfix to the first bar label so it says "<1 year"
 */
function addInitialBarLabel(label) {
  if (label === SENTENCE_LENGTHS.get(SENTENCE_LENGTH_KEYS.lessThanOne)) {
    return `${label} year`;
  }
  return label;
}

export default function VizSentenceLengths({
  data: { sentenceLengths },
  dimension,
  locationId,
}) {
  const [selectedChartTitle, setSelectedChartTitle] = useState();

  if (!dimension) return null;

  const chartData = getDimensionalBreakdown({
    data: sentenceLengths.filter(({ district }) => district === locationId),
    dimension,
  }).map(({ label, record }) => ({
    title: label,
    data: getDataWithPct(
      [...SENTENCE_LENGTHS].map(([key, lengthLabel]) => ({
        color: THEME.colors.sentenceLengths,
        label: lengthLabel,
        value: record ? Number(record[key]) : 0,
      }))
    ),
  }));

  const renderTooltip = (columnData) => {
    const {
      summary: [d],
    } = columnData;
    return {
      title: selectedChartTitle || "",
      records: [
        {
          label: `${d.data.label} year${
            d.data.label ===
            SENTENCE_LENGTHS.get(SENTENCE_LENGTH_KEYS.lessThanOne)
              ? ""
              : "s"
          }`,
          pct: d.data.pct,
          value: d.data.value,
        },
      ],
    };
  };

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
            <BarChartTrellis
              data={chartData}
              formatBarLabel={addInitialBarLabel}
              renderTooltip={renderTooltip}
              setSelectedChartTitle={setSelectedChartTitle}
              width={width || 0}
            />
            <Disclaimer type="small-data" />
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
