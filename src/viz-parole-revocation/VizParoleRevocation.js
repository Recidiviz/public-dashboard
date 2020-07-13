import { ascending, group } from "d3-array";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Measure from "react-measure";
import styled from "styled-components";
import BubbleChart from "../bubble-chart";
import {
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  THEME,
  TOTAL_KEY,
  VIOLATION_LABELS,
  VIOLATION_COUNT_KEYS,
} from "../constants";
import ProportionalBar from "../proportional-bar";
import {
  demographicsAscending,
  formatDemographicValue,
  recordIsTotal,
} from "../utils";

const HEIGHT = 450;

const VizParoleRevocationWrapper = styled.div`
  height: ${HEIGHT}px;
  width: 100%;
`;

const BreakdownBarWrapper = styled.div`
  height: ${(props) => props.height}px;
  padding-bottom: 24px;
`;

function Breakdowns({ data }) {
  const breakdownHeight = HEIGHT / data.size;
  return Array.from(data, ([key, value], i) => (
    <BreakdownBarWrapper key={key} height={breakdownHeight}>
      <ProportionalBar
        title={formatDemographicValue(key)}
        data={value}
        showLegend={i === data.size - 1}
      />
    </BreakdownBarWrapper>
  ));
}

function VizParoleRevocation({ currentMonthData, dimension }) {
  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => {
        return (
          <VizParoleRevocationWrapper ref={measureRef}>
            {dimension === DIMENSION_KEYS.total ? (
              width && (
                <BubbleChart
                  data={currentMonthData.get(TOTAL_KEY)}
                  height={HEIGHT}
                  width={width}
                />
              )
            ) : (
              <Breakdowns data={currentMonthData} />
            )}
          </VizParoleRevocationWrapper>
        );
      }}
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
      value: record[dataKey],
    }))
    .sort((a, b) => ascending(a.label, b.label));
}

function recordIsTotalByDimension(dimension) {
  const keysEnum = { ...DIMENSION_DATA_KEYS };
  delete keysEnum[dimension];
  const otherDataKeys = Object.values(keysEnum);
  return (record) =>
    // filter out totals
    record[DIMENSION_DATA_KEYS[dimension]] !== TOTAL_KEY &&
    // filter out subset permutations
    otherDataKeys.every((key) => record[key] === TOTAL_KEY);
}

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
    const monthlyTotals = monthlyData.get(month).find(recordIsTotal);

    currentMonthData.set(TOTAL_KEY, splitByViolationType(monthlyTotals));
  } else {
    monthlyData
      .get(month)
      .filter(recordIsTotalByDimension(dimension))
      .sort((a, b) =>
        demographicsAscending(
          a[DIMENSION_DATA_KEYS[dimension]],
          b[DIMENSION_DATA_KEYS[dimension]]
        )
      )
      .forEach((record) => {
        currentMonthData.set(
          record[DIMENSION_DATA_KEYS[dimension]],
          splitByViolationType(record)
        );
      });
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
