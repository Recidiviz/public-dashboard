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

import { startOfMonth } from "date-fns";
import { observer } from "mobx-react-lite";
import React from "react";
import { WindowedTimeSeries } from "../charts";
import type HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";

const VizHistoricalPopulationBreakdown: React.FC<{
  metric: HistoricalPopulationBreakdownMetric;
}> = ({ metric }) => {
  // TODO(#278): implement filter UI to change this
  const defaultRangeEnd = startOfMonth(new Date());

  if (metric.dataSeries)
    return (
      <WindowedTimeSeries
        data={metric.dataSeries}
        setTimeRangeId={() => undefined}
        defaultRangeEnd={defaultRangeEnd}
      />
    );

  if (metric.error) throw metric.error;

  return <div>loading...</div>;
};

export default observer(VizHistoricalPopulationBreakdown);
