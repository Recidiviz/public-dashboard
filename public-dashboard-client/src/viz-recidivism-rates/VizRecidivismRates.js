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
import { assignOrderedDatavizColor } from "../utils";
import RecidivismRatesChart from "./RecidivismRatesChart";

function typeCast(recidivismRecord) {
  const {
    followup_years: followupYears,
    recidivism_rate: recidivismRate,
    release_cohort: releaseCohort,
    ...otherProps
  } = recidivismRecord;

  return {
    followupYears: Number(followupYears),
    recidivismRate: Number(recidivismRate),
    releaseCohort,
    ...otherProps,
  };
}

function prepareChartData({ data, selectedCohorts }) {
  return Array.from(
    group(data.map(typeCast), (d) => d.releaseCohort),
    ([key, value]) => {
      return {
        label: key,
        coordinates: value,
      };
    }
  )
    .map(assignOrderedDatavizColor)
    .filter((record) => {
      if (!selectedCohorts) {
        return true;
      }
      return selectedCohorts.some((cohortId) => cohortId === record.label);
    });
}

export default function VizRecidivismRates({
  data: { recidivismRates, selectedCohorts, highlightedCohort },
}) {
  const chartData = prepareChartData({
    data: recidivismRates,
    selectedCohorts,
  });

  return (
    <RecidivismRatesChart
      data={chartData}
      highlightedCohort={highlightedCohort}
    />
  );
}

VizRecidivismRates.propTypes = {
  data: PropTypes.shape({
    recidivismRates: PropTypes.arrayOf(
      PropTypes.shape({
        followup_years: PropTypes.string.isRequired,
        recidivism_rate: PropTypes.string.isRequired,
        release_cohort: PropTypes.string.isRequired,
      })
    ).isRequired,
    selectedCohorts: PropTypes.arrayOf(PropTypes.string),
    // this will be passed through to the chart, let that component validate it
    highlightedCohort: PropTypes.any,
  }).isRequired,
};
