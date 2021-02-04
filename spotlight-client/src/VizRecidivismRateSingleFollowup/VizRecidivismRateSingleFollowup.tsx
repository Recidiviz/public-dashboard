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
import {
  BarChartTrellis,
  CommonDataPoint,
  TooltipContentFunction,
} from "../charts";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import FiltersWrapper from "../FiltersWrapper";
import NoMetricData from "../NoMetricData";
import FollowupPeriodFilterSelect from "./FollowupPeriodFilterSelect";

const getTooltipProps: TooltipContentFunction = (columnData) => {
  const {
    summary: [
      {
        data: { label, pct, value, denominator },
      },
    ],
  } = columnData as {
    // can't find any Semiotic type definition that describes what is actually
    // passed to this function, but the part we care about looks like this
    // (the properties are picked up from the input data)
    summary: { data: CommonDataPoint & { denominator: number } }[];
  };

  return {
    title: `${label}`,
    records: [
      {
        pct,
        value: `${value} of ${denominator}`,
      },
    ],
  };
};

type VizRecidivismRateSingleFollowupProps = {
  metric: RecidivismRateMetric;
};

const VizRecidivismRateSingleFollowup: React.FC<VizRecidivismRateSingleFollowupProps> = ({
  metric,
}) => {
  const { singleFollowupDemographics } = metric;

  if (singleFollowupDemographics) {
    return (
      <>
        <FiltersWrapper
          filters={[
            <FollowupPeriodFilterSelect metric={metric} />,
            <DemographicFilterSelect metric={metric} />,
          ]}
        />
        <BarChartTrellis
          barAxisLabel="Release Cohort"
          data={singleFollowupDemographics}
          getTooltipProps={getTooltipProps}
        />
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizRecidivismRateSingleFollowup);
