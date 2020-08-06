import PropTypes from "prop-types";
import React from "react";
import {
  INCARCERATION_REASON_KEYS,
  INCARCERATION_REASON_LABELS,
} from "../constants";
import SingleDimensionViz from "../single-dimension-viz";
import { THEME } from "../theme";
import { getDimensionalBreakdown, transposeFieldsToRecords } from "../utils";

export default function VizPrisonReasons({
  data: { incarcerationReasons },
  dimension,
}) {
  if (!dimension) return null;

  const chartData = new Map(
    getDimensionalBreakdown({
      data: incarcerationReasons,
      dimension,
    }).map(({ id, record }) => [
      id,
      transposeFieldsToRecords(record, {
        colors: THEME.colors.incarcerationReasons,
        keys: INCARCERATION_REASON_KEYS,
        labels: INCARCERATION_REASON_LABELS,
      }),
    ])
  );

  return <SingleDimensionViz data={chartData} dimension={dimension} />;
}

VizPrisonReasons.propTypes = {
  data: PropTypes.shape({
    incarcerationReasons: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
};

VizPrisonReasons.defaultProps = {
  dimension: undefined,
};
