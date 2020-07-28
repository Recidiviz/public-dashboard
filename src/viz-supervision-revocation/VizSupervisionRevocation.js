import { ascending, group } from "d3-array";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { THEME, VIOLATION_LABELS, VIOLATION_COUNT_KEYS } from "../constants";
import SingleDimensionViz from "../single-dimension-viz";
import { getDimensionalBreakdown, transposeFieldsToRecords } from "../utils";

function typeCastRecords(records) {
  return records.map((record) => ({
    ...record,
    year: +record.year,
    month: +record.month,
  }));
}

function groupByMonth(records) {
  // order chronologically for convenience
  const sorted = typeCastRecords([...records]).sort(
    (a, b) => ascending(a.year, b.year) || ascending(a.month, b.month)
  );
  return group(sorted, ({ month, year }) => `${year}-${month}`);
}

const VIOLATION_REASONS_COLORS = THEME.colors.violationReasons;

export default function VizSupervisionRevocationContainer({
  data: { supervisionRevocationByMonth },
  month,
  setMonthList,
  dimension,
}) {
  const [monthlyData] = useState(groupByMonth(supervisionRevocationByMonth));

  useEffect(() => {
    setMonthList(Array.from(monthlyData.keys()));
  }, [monthlyData, setMonthList]);

  if (!month) {
    return null;
  }

  const currentMonthData = new Map(
    getDimensionalBreakdown({
      data: monthlyData.get(month),
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

  return <SingleDimensionViz data={currentMonthData} dimension={dimension} />;
}

VizSupervisionRevocationContainer.propTypes = {
  data: PropTypes.shape({
    supervisionRevocationByMonth: PropTypes.arrayOf(PropTypes.object)
      .isRequired,
  }).isRequired,
  dimension: PropTypes.string,
  month: PropTypes.string,
  setMonthList: PropTypes.func.isRequired,
};

VizSupervisionRevocationContainer.defaultProps = {
  dimension: undefined,
  month: undefined,
};
