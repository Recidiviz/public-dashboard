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

function prepareChartData(rawData) {
  return Array.from(
    group(rawData.map(typeCast), (d) => d.releaseCohort),
    ([key, value]) => {
      return {
        label: key,
        coordinates: value,
      };
    }
  );
}

export default function VizRecidivismRates({ data: { recidivismRates } }) {
  const chartData = prepareChartData(recidivismRates);

  return <RecidivismRatesChart data={chartData} />;
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
  }).isRequired,
};
