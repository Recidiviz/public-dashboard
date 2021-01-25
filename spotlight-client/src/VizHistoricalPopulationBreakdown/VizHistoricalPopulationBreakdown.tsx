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

import { startOfMonth, sub } from "date-fns";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { isWindowSizeId, WindowedTimeSeries, WindowSizeId } from "../charts";
import type HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import { colors, Dropdown, zIndex } from "../UiLibrary";

const FilterRow = styled.div`
  background: ${colors.background};
  display: flex;
  justify-content: flex-end;
  padding-bottom: ${rem(16)};
  z-index: ${zIndex.control};
`;

const FilterWrapper = styled.div`
  margin: 0 ${rem(16)};

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const VizHistoricalPopulationBreakdown: React.FC<{
  metric: HistoricalPopulationBreakdownMetric;
}> = ({ metric }) => {
  const [windowSizeId, setWindowSizeId] = useState<WindowSizeId>("20");

  let defaultRangeEnd = startOfMonth(new Date());
  if (!metric.dataIncludesCurrentMonth) {
    defaultRangeEnd = sub(defaultRangeEnd, { months: 1 });
  }

  let defaultRangeStart: Date | undefined;
  if (windowSizeId !== "custom") {
    defaultRangeStart = sub(defaultRangeEnd, {
      years: Number(windowSizeId),
      // make the range start-exclusive to correct for an off-by-one error
      months: -1,
    });
  }

  if (metric.dataSeries)
    return (
      <>
        <FilterRow>
          <FilterWrapper>
            <Dropdown
              label="Range"
              onChange={(id) => {
                if (isWindowSizeId(id)) setWindowSizeId(id);
              }}
              options={[
                { id: "20", label: "20 years" },
                { id: "10", label: "10 years" },
                { id: "5", label: "5 years" },
                { id: "1", label: "1 year" },
                { id: "custom", label: "Custom", hidden: true },
              ]}
              selectedId={windowSizeId}
            />
          </FilterWrapper>
          <FilterWrapper>
            <DemographicFilterSelect metric={metric} />
          </FilterWrapper>
        </FilterRow>
        <WindowedTimeSeries
          data={metric.dataSeries}
          setTimeRangeId={setWindowSizeId}
          defaultRangeEnd={defaultRangeEnd}
          defaultRangeStart={defaultRangeStart}
        />
      </>
    );

  if (metric.error) throw metric.error;

  return <div>loading...</div>;
};

export default observer(VizHistoricalPopulationBreakdown);
