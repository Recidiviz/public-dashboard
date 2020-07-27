import { ascending, group } from "d3-array";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { THEME, VIOLATION_LABELS, VIOLATION_COUNT_KEYS } from "../constants";
import SingleDimensionViz from "../single-dimension-viz";
import { getDimensionalBreakdown } from "../utils";

function typeCastRecords(records) {
  return records.map((record) => ({
    ...record,
    year: +record.year,
    month: +record.month,
    // convert all of the enumerated count keys and replace them
    ...Object.values(VIOLATION_COUNT_KEYS).reduce(
      (acc, key) => ({ ...acc, [key]: +record[key] }),
      {}
    ),
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

function splitByViolationType(record) {
  return Object.entries(VIOLATION_COUNT_KEYS)
    .map(([violationType, dataKey]) => ({
      color: VIOLATION_REASONS_COLORS[violationType],
      label: VIOLATION_LABELS[violationType],
      value: record ? record[dataKey] : 0,
    }))
    .sort((a, b) => ascending(a.label, b.label));
}

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
    }).map(({ id, record }) => [id, splitByViolationType(record)])
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
