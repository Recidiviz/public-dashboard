// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/macro";
import RateTrend from "../charts/RateTrend";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import NoMetricData from "../NoMetricData";

type VizRecidivismRateCumulativeProps = {
  metric: RecidivismRateMetric;
};

const VizRecidivismRateCumulative: React.FC<VizRecidivismRateCumulativeProps> = ({
  metric,
}) => {
  const { cohortDataSeries } = metric;

  if (cohortDataSeries) {
    return (
      <>
        <RateTrend
          data={cohortDataSeries}
          title="Cumulative Recidivism Rate"
          xAccessor="followupYears"
          // we don't want the X axis to get shorter when cohorts are filtered
          xExtent={[0, 10]}
          xLabel="Years since release"
        />
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizRecidivismRateCumulative);
