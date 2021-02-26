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
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { ProportionalBar } from "../charts";
import PopulationBreakdownByLocationMetric from "../contentModels/PopulationBreakdownByLocationMetric";
import MetricVizControls from "../MetricVizControls";
import LocalityFilterSelect from "../LocalityFilterSelect";
import NoMetricData from "../NoMetricData";
import Statistic from "../Statistic";
import { formatAsNumber } from "../utils";

const ChartWrapper = styled.div`
  margin-bottom: ${rem(16)};
`;

const StatisticWrapper = styled.div`
  margin-top: ${rem(32)};
`;

type VizPopulationBreakdownByLocationProps = {
  metric: PopulationBreakdownByLocationMetric;
};

const VizPopulationBreakdownByLocation: React.FC<VizPopulationBreakdownByLocationProps> = ({
  metric,
}) => {
  if (metric.dataSeries) {
    return (
      <>
        <MetricVizControls
          filters={[<LocalityFilterSelect metric={metric} />]}
          metric={metric}
        />
        {metric.dataSeries.map(({ label: viewName, records }) => (
          <ChartWrapper key={viewName}>
            <ProportionalBar title={viewName} data={records} height={88} />
          </ChartWrapper>
        ))}
        <StatisticWrapper>
          <Statistic
            label={metric.totalLabel}
            maxSize={160}
            minSize={72}
            value={
              metric.totalPopulation && formatAsNumber(metric.totalPopulation)
            }
          />
        </StatisticWrapper>
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizPopulationBreakdownByLocation);
