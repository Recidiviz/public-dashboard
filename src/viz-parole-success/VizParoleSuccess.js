import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React from "react";
import MonthlyTimeseries from "../monthly-timeseries";
import { addEmptyMonthsToData } from "../utils";

function makeTimeseriesRecord(record) {
  return {
    month: `${record.year}-${record.month}`,
    value: parseFloat(record.success_rate),
  };
}

// consistently using `year` and `month` in all monthly data structures
// makes it easier to generalize for common transformations
function normalizeMonth(record) {
  return {
    ...record,
    year: record.projected_year,
    month: record.projected_month,
  };
}

export default function VizParoleSuccess({
  data: { successByMonth },
  districtId,
}) {
  const chartData = addEmptyMonthsToData({
    dataPoints: successByMonth
      .filter((record) => record.district === districtId)
      .map(normalizeMonth),
    monthCount: 36,
    valueKey: "success_rate",
    emptyValue: 0,
  })
    .map(makeTimeseriesRecord)
    .sort((a, b) => ascending(a.month, b.month));

  return <MonthlyTimeseries data={chartData} />;
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
