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
import React from "react";
import { WindowedTimeSeries } from "../charts";
import { DataSeries } from "../charts/types";

type VizHistoricalPopulationBreakdownProps = {
  data: DataSeries[] | null;
  error?: Error;
};

const VizHistoricalPopulationBreakdown: React.FC<VizHistoricalPopulationBreakdownProps> = ({
  data,
  error,
}) => {
  // TODO(#278): implement filter UI to change this
  const defaultRangeEnd = startOfMonth(new Date());

  if (data)
    return (
      <WindowedTimeSeries
        data={data}
        setTimeRangeId={() => undefined}
        defaultRangeEnd={defaultRangeEnd}
      />
    );

  if (error) throw error;

  return <div>loading...</div>;
};

export default VizHistoricalPopulationBreakdown;
