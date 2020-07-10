import { ascending, group } from "d3-array";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Measure from "react-measure";
import styled from "styled-components";
import BubbleChart from "../bubble-chart";
import {
  DIMENSION_KEYS,
  TOTAL_KEY,
  VIOLATION_TYPES,
  THEME,
} from "../constants";

const HEIGHT = 450;

const VizParoleRevocationWrapper = styled.div`
  height: ${HEIGHT}px;
  width: 100%;
`;

function VizParoleRevocation({ currentMonthData, dimension }) {
  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => (
        <VizParoleRevocationWrapper ref={measureRef}>
          {width && dimension === DIMENSION_KEYS.total && (
            <BubbleChart
              data={currentMonthData.get(TOTAL_KEY)}
              height={HEIGHT}
              width={width}
            />
          )}
        </VizParoleRevocationWrapper>
      )}
    </Measure>
  );
}

VizParoleRevocation.propTypes = {
  currentMonthData: PropTypes.instanceOf(Map).isRequired,
  dimension: PropTypes.string.isRequired,
};

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

const VIOLATION_REASONS_COLORS = THEME.colors.violationReasons;

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
  dimension: PropTypes.string,
  month: PropTypes.string,
  setMonthList: PropTypes.func.isRequired,
};

VizParoleRevocationContainer.defaultProps = {
  dimension: undefined,
  month: undefined,
};
