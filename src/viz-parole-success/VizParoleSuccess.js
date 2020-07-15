import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React from "react";
import MonthlyTimeseries from "../monthly-timeseries";

function makeTimeseriesRecord(record) {
  return {
    month: `${record.projected_year}-${record.projected_month}`,
    value: parseFloat(record.success_rate),
  };
}

export default function VizParoleSuccess({
  data: { successByMonth },
  districtId,
}) {
  return (
    <MonthlyTimeseries
      data={successByMonth
        .filter((record) => record.district === districtId)
        .map(makeTimeseriesRecord)
        .sort((a, b) => ascending(a.month, b.month))}
    />
  );
}

VizParoleSuccess.propTypes = {
  data: PropTypes.shape({
    successByMonth: PropTypes.arrayOf(
      PropTypes.shape({
        projected_month: PropTypes.string.isRequired,
        projected_year: PropTypes.string.isRequired,
        success_rate: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  districtId: PropTypes.string,
};

VizParoleSuccess.defaultProps = {
  districtId: undefined,
};
