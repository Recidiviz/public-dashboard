import { ascending } from "d3-array";
import { parseISO, startOfMonth, sub } from "date-fns";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { THEME } from "../theme";
import { addEmptyMonthsToData, recordIsTotalByDimension } from "../utils";
import {
  DEMOGRAPHIC_UNKNOWN,
  DIMENSION_MAPPINGS,
  DIMENSION_DATA_KEYS,
  TOTAL_KEY,
} from "../constants";
import VizPopulationOverTime from "./VizPopulationOverTime";

const EXPECTED_MONTHS = 240; // 20 years

export default function VizPopulationOverTimeContainer({
  data: { populationOverTime },
  dimension,
  timeRangeId,
  ...passThruProps
}) {
  const dataForDimension = useMemo(() => {
    if (!dimension) return null;
    return populationOverTime.filter(recordIsTotalByDimension(dimension));
  }, [dimension, populationOverTime]);

  const includeCurrentMonth = useMemo(() => {
    // if the current month is completely missing from data, we will assume it is
    // actually missing due to reporting lag. But if any record contains it, we will
    // assume that it should be replaced with an empty record when it is missing
    const thisMonth = startOfMonth(new Date()).toDateString();
    return populationOverTime.some(
      (record) => record.population_date === thisMonth
    );
  }, [populationOverTime]);

  const chartData = useMemo(() => {
    if (!dimension) return null;

    return (
      Array.from(DIMENSION_MAPPINGS.get(dimension))
        // don't need to include unknown in this chart;
        // they are minimal to nonexistent in historical data and make the legend confusing
        .filter(([value]) => value !== DEMOGRAPHIC_UNKNOWN)
        .map(([value, label]) => ({
          label,
          color:
            value === TOTAL_KEY
              ? THEME.colors.populationTimeseriesTotal
              : THEME.colors[dimension][value],
          coordinates: addEmptyMonthsToData({
            dataPoints: dataForDimension.filter((record) =>
              value === TOTAL_KEY
                ? true
                : record[DIMENSION_DATA_KEYS[dimension]] === value
            ),
            monthCount: EXPECTED_MONTHS,
            valueKey: "population_count",
            emptyValue: "0",
            dateField: "population_date",
            includeCurrentMonth,
          })
            .map((record) => ({
              time: parseISO(record.population_date),
              population: Number(record.population_count),
            }))
            .sort((a, b) => ascending(a.time, b.time)),
        }))
    );
  }, [dataForDimension, dimension, includeCurrentMonth]);

  const defaultRangeEnd = useMemo(() => {
    let endMonth = startOfMonth(new Date());
    if (!includeCurrentMonth) {
      endMonth = sub(endMonth, { months: 1 });
    }
    return endMonth;
  }, [includeCurrentMonth]);

  const defaultRangeStart = useMemo(() => {
    if (!timeRangeId || timeRangeId === "custom") return undefined;

    const diff = {
      years: Number(timeRangeId),
      // make the range start-exclusive to correct for an off-by-one error
      months: -1,
    };
    return sub(defaultRangeEnd, diff);
  }, [defaultRangeEnd, timeRangeId]);

  if (!dimension || !timeRangeId) return null;

  return (
    <VizPopulationOverTime
      data={chartData}
      defaultRangeEnd={defaultRangeEnd}
      defaultRangeStart={defaultRangeStart}
      {...passThruProps}
    />
  );
}

VizPopulationOverTimeContainer.propTypes = {
  data: PropTypes.shape({
    populationOverTime: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  timeRangeId: PropTypes.string,
  dimension: PropTypes.string,
};

VizPopulationOverTimeContainer.defaultProps = {
  dimension: undefined,
  timeRangeId: undefined,
};
