import PropTypes from "prop-types";
import { ascending, group } from "d3-array";
import React, { useState, useEffect } from "react";
import VizParoleRevocation from "./VizParoleRevocation";
import { DIMENSION_KEYS, TOTAL_KEY } from "../constants";

// TODO: may not be necessary if source files change
function typeCastRecords(records) {
  return records.map((record) => ({
    ...record,
    year: +record.year,
    month: +record.month,
    revocation_count: +record.revocation_count,
  }));
}

function groupByMonth(records) {
  // order chronologically for convenience
  const sorted = typeCastRecords([...records]).sort(
    (a, b) => ascending(a.year, b.year) || ascending(a.month, b.month)
  );
  return group(sorted, ({ month, year }) => `${year}-${month}`);
}

const VIOLATION_TYPES = {
  ABSCONDED: "Absconsion",
  FELONY: "New Offense",
  TECHNICAL: "Technical Violation",
  EXTERNAL_UNKNOWN: "Unknown Type",
};

const VIOLATION_REASONS_COLORS = {
  ABSCONDED: "#327672",
  FELONY: "#659795",
  TECHNICAL: "#005450",
  EXTERNAL_UNKNOWN: "#97b9b7",
};

export default function VizParoleRevocationContainer({
  data: { paroleRevocationByMonth },
  month,
  setMonthList,
  dimension,
  ...passThruProps
}) {
  const [monthlyData] = useState(groupByMonth(paroleRevocationByMonth));

  useEffect(() => {
    setMonthList(Array.from(monthlyData.keys()));
  }, [monthlyData, setMonthList]);

  // TODO: loading state
  if (!month) {
    return null;
  }
  const currentMonthData = new Map();

  if (dimension === DIMENSION_KEYS.total) {
    currentMonthData.set(
      TOTAL_KEY,
      monthlyData
        .get(month)
        .filter(
          (record) =>
            record.race_or_ethnicity === TOTAL_KEY &&
            record.gender === TOTAL_KEY &&
            record.age_bucket === TOTAL_KEY
        )
        .map((record) => ({
          color: VIOLATION_REASONS_COLORS[record.source_violation_type],
          label: VIOLATION_TYPES[record.source_violation_type],
          value: record.revocation_count,
        }))
        .sort((a, b) => ascending(a.label, b.label))
    );
  }

  return (
    <VizParoleRevocation
      currentMonthData={currentMonthData}
      dimension={dimension}
      {...passThruProps}
    />
  );
}

VizParoleRevocationContainer.propTypes = {
  data: PropTypes.shape({
    paroleRevocationByMonth: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  dimension: PropTypes.string.isRequired,
  month: PropTypes.string,
  setMonthList: PropTypes.func.isRequired,
};

VizParoleRevocationContainer.defaultProps = {
  month: undefined,
};
