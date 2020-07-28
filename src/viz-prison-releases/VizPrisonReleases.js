import PropTypes from "prop-types";
import React from "react";
import { RELEASE_TYPE_KEYS, RELEASE_TYPE_LABELS, THEME } from "../constants";
import SingleDimensionViz from "../single-dimension-viz";
import { getDimensionalBreakdown, transposeFieldsToRecords } from "../utils";

const RELEASE_TYPE_COLORS = THEME.colors.releaseTypes;

export default function VizPrisonReleases({
  data: { releaseTypes },
  dimension,
}) {
  if (!dimension) return null;

  const chartData = new Map(
    getDimensionalBreakdown({
      data: releaseTypes,
      dimension,
    }).map(({ id, record }) => [
      id,
      transposeFieldsToRecords(record, {
        colors: RELEASE_TYPE_COLORS,
        keys: RELEASE_TYPE_KEYS,
        labels: RELEASE_TYPE_LABELS,
      }),
    ])
  );

  return <SingleDimensionViz data={chartData} dimension={dimension} />;
}

VizPrisonReleases.propTypes = {
  data: PropTypes.shape({
    releaseTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
};

VizPrisonReleases.defaultProps = {
  dimension: undefined,
};
