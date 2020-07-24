import { ascending, group } from "d3-array";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Measure from "react-measure";
import styled from "styled-components";
import BubbleChart from "../bubble-chart";
import {
  DIMENSION_KEYS,
  THEME,
  TOTAL_KEY,
  VIOLATION_LABELS,
  VIOLATION_COUNT_KEYS,
} from "../constants";
import ProportionalBar from "../proportional-bar";
import { formatDemographicValue, getDimensionalBreakdown } from "../utils";

const SECTION_HEIGHT = 450;
const GUTTER = 42;

const VizSupervisionRevocationWrapper = styled.div`
  width: 100%;
`;

const BreakdownBarWrapper = styled.div`
  height: ${(props) => props.height}px;
  padding-bottom: 16px;
  position: relative;
  z-index: ${(props) => props.theme.zIndex.base + props.stackOrder};
`;

function Breakdowns({ data, dimension }) {
  const breakdownHeight = SECTION_HEIGHT / data.size;
  return Array.from(data, ([key, value], i) => (
    <BreakdownBarWrapper key={key} stackOrder={data.size - i}>
      <ProportionalBar
        data={value}
        height={breakdownHeight - GUTTER}
        title={formatDemographicValue(key, dimension)}
        showLegend={i === data.size - 1}
      />
    </BreakdownBarWrapper>
  ));
}

function VizSupervisionRevocation({ currentMonthData, dimension }) {
  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => {
        return (
          <VizSupervisionRevocationWrapper ref={measureRef}>
            {dimension === DIMENSION_KEYS.total ? (
              width && (
                <BubbleChart
                  data={currentMonthData.get(TOTAL_KEY)}
                  height={SECTION_HEIGHT}
                  width={width}
                />
              )
            ) : (
              <Breakdowns data={currentMonthData} dimension={dimension} />
            )}
          </VizSupervisionRevocationWrapper>
        );
      }}
    </Measure>
  );
}

VizSupervisionRevocation.propTypes = {
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
      value: record ? record[dataKey] : 0,
    }))
    .sort((a, b) => ascending(a.label, b.label));
}

export default function VizSupervisionRevocationContainer({
  data: { supervisionRevocationByMonth },
  month,
  setMonthList,
  dimension,
  ...passThruProps
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

  return (
    <VizSupervisionRevocation
      currentMonthData={currentMonthData}
      dimension={dimension}
      {...passThruProps}
    />
  );
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
