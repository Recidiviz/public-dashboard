// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { group } from "d3-array";
import PropTypes from "prop-types";
import React from "react";
import {
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  DIMENSION_MAPPINGS,
} from "../constants";
import Disclaimer from "../disclaimer";
import {
  assignOrderedDatavizColor,
  demographicsAscending,
  recordIsTotalByDimension,
} from "../utils";
import RecidivismRatesChart from "./RecidivismRatesChart";

/**
 * When multiple cohorts are selected, or a single cohort and the `total` dimension,
 * will return one data series per cohort.
 * Otherwise (i.e., a single cohort and some dimensional breakdown is selected),
 * will return one data series per demographic subgroup.
 */
function prepareChartData({ data, dimension, selectedCohorts }) {
  const showDemographics =
    selectedCohorts &&
    selectedCohorts.length === 1 &&
    dimension !== DIMENSION_KEYS.total;

  const filteredData = data.filter(recordIsTotalByDimension(dimension));

  if (showDemographics) {
    return Array.from(
      group(
        // filter out unselected years first so we only have to do it once
        filteredData.filter(({ releaseCohort }) =>
          selectedCohorts.some(({ id }) => id === releaseCohort)
        ),
        (d) => d[DIMENSION_DATA_KEYS[dimension]]
      ),
      ([key, value]) => {
        return {
          key,
          label: DIMENSION_MAPPINGS.get(dimension).get(key),
          coordinates: value,
        };
      }
    )
      .sort((a, b) => demographicsAscending(a.key, b.key))
      .map(assignOrderedDatavizColor);
  }
  return (
    Array.from(
      group(filteredData, (d) => d.releaseCohort),
      ([key, value]) => {
        return {
          key,
          label: key,
          coordinates: value,
        };
      }
    )
      // color assignment and filtering is done last to ensure colors remain stable
      // as cohorts are selected and deselected
      .map(assignOrderedDatavizColor)
      .filter((record) => {
        if (!selectedCohorts) {
          return true;
        }
        return selectedCohorts.some(({ id }) => id === record.label);
      })
  );
}

export default function VizRecidivismRates({
  data: { dimension, recidivismRates, selectedCohorts, highlightedCohort },
}) {
  const chartData = prepareChartData({
    data: recidivismRates,
    dimension,
    selectedCohorts,
  });

  return (
    <>
      <RecidivismRatesChart
        data={chartData}
        highlightedCohort={highlightedCohort}
      />
      <Disclaimer type="small-data" />
    </>
  );
}

VizRecidivismRates.propTypes = {
  data: PropTypes.shape({
    dimension: PropTypes.string.isRequired,
    recidivismRates: PropTypes.arrayOf(
      PropTypes.shape({
        followupYears: PropTypes.number.isRequired,
        recidivismRate: PropTypes.number.isRequired,
        releaseCohort: PropTypes.string.isRequired,
      })
    ).isRequired,
    selectedCohorts: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string.isRequired })
    ),
    // this will be passed through to the chart, let that component validate it
    highlightedCohort: PropTypes.any,
  }).isRequired,
};
