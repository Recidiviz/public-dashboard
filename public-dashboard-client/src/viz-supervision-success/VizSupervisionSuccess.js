import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components/macro";
import { DIMENSION_DATA_KEYS, DIMENSION_LABELS } from "../constants";
import MonthlyTimeseries from "../monthly-timeseries";
import Statistic from "../statistic";
import {
  addEmptyMonthsToData,
  demographicsAscending,
  formatAsPct,
  formatDemographicValue,
  recordIsTotalByDimension,
} from "../utils";

function makeTimeseriesRecord(record) {
  return {
    month: `${record.year}-${record.month}`,
    projected: Number(record.projected_completion_count),
    actual: Number(record.successful_termination_count),
    rate: parseFloat(record.success_rate),
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

const BreakdownsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
  text-align: center;
`;

const BreakdownStat = styled.div`
  flex: 1 1 auto;
  margin: 0 24px 24px;
`;

export default function VizSupervisionSuccess({
  data: { successByDemographics, successByMonth },
  dimension,
  locationId,
}) {
  // this may be undefined when first mounted; wait for it
  if (!dimension) return null;

  // record accessor functions that depend on props
  const getDimensionValue = (record) =>
    record[DIMENSION_DATA_KEYS[dimension]] || DIMENSION_LABELS[dimension];

  const isSelectedLocation = (record) => record.district === locationId;

  const chartData = addEmptyMonthsToData({
    dataPoints: successByMonth.filter(isSelectedLocation).map(normalizeMonth),
    monthCount: 36,
    valueKey: "success_rate",
    emptyValue: 0,
  })
    .map(makeTimeseriesRecord)
    .sort((a, b) => {
      const [yearA, monthA] = a.month.split("-");
      const [yearB, monthB] = b.month.split("-");
      return (
        ascending(yearA, yearB) || ascending(Number(monthA), Number(monthB))
      );
    });

  const breakdownData = successByDemographics
    .filter(isSelectedLocation)
    .filter(recordIsTotalByDimension(dimension))
    .sort((a, b) =>
      demographicsAscending(getDimensionValue(a), getDimensionValue(b))
    );

  return (
    <>
      <BreakdownsWrapper>
        {breakdownData.map((record) => (
          <BreakdownStat key={getDimensionValue(record)}>
            <Statistic
              fluidSize
              label={formatDemographicValue(
                getDimensionValue(record),
                dimension
              )}
              value={formatAsPct(record.success_rate)}
            />
          </BreakdownStat>
        ))}
      </BreakdownsWrapper>
      <MonthlyTimeseries data={chartData} />
    </>
  );
}

VizSupervisionSuccess.propTypes = {
  data: PropTypes.shape({
    successByDemographics: PropTypes.arrayOf(
      PropTypes.shape({
        age_bucket: PropTypes.string.isRequired,
        district: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        projected_completion_count: PropTypes.string.isRequired,
        race_or_ethnicity: PropTypes.string.isRequired,
        success_rate: PropTypes.number.isRequired,
        successful_termination_count: PropTypes.string.isRequired,
      })
    ).isRequired,
    successByMonth: PropTypes.arrayOf(
      PropTypes.shape({
        district: PropTypes.string.isRequired,
        projected_month: PropTypes.string.isRequired,
        projected_year: PropTypes.string.isRequired,
        success_rate: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  dimension: PropTypes.string,
  locationId: PropTypes.string,
};

VizSupervisionSuccess.defaultProps = {
  dimension: undefined,
  locationId: undefined,
};
