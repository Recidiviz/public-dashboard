import PropTypes from "prop-types";
import React from "react";
import { RELEASE_TYPE_KEYS, RELEASE_TYPE_LABELS, THEME } from "../constants";
import SingleDimensionViz from "../single-dimension-viz";
import { getDimensionalBreakdown } from "../utils";

const RELEASE_TYPE_COLORS = THEME.colors.releaseTypes;

function splitByReleaseType(record) {
  return Array.from(RELEASE_TYPE_KEYS, ([releaseType, dataKey]) => ({
    color: RELEASE_TYPE_COLORS[releaseType],
    label: RELEASE_TYPE_LABELS[releaseType],
    value: record ? Number(record[dataKey]) : 0,
  }));
}

export default function VizPrisonReleases({
  data: { releaseTypes },
  dimension,
}) {
  if (!dimension) return null;

  const chartData = new Map(
    getDimensionalBreakdown({
      data: releaseTypes,
      dimension,
    }).map(({ id, record }) => [id, splitByReleaseType(record)])
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
