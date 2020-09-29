import PropTypes from "prop-types";
import React from "react";
import { VIOLATION_LABELS, VIOLATION_COUNT_KEYS } from "../constants";
import SingleDimensionViz from "../single-dimension-viz";
import { THEME } from "../theme";
import { getDimensionalBreakdown, transposeFieldsToRecords } from "../utils";

const VIOLATION_REASONS_COLORS = THEME.colors.violationReasons;

export default function VizSupervisionRevocationContainer({
  data: { revocationsByDemographics },
  dimension,
}) {
  if (!dimension) {
    return null;
  }

  const chartData = new Map(
    getDimensionalBreakdown({
      data: revocationsByDemographics,
      dimension,
    }).map(({ id, record }) => [
      id,
      transposeFieldsToRecords(record, {
        colors: VIOLATION_REASONS_COLORS,
        keys: VIOLATION_COUNT_KEYS,
        labels: VIOLATION_LABELS,
      }),
    ])
  );

  return <SingleDimensionViz data={chartData} dimension={dimension} />;
}

VizSupervisionRevocationContainer.propTypes = {
  data: PropTypes.shape({
    revocationsByDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
};

VizSupervisionRevocationContainer.defaultProps = {
  dimension: undefined,
};
