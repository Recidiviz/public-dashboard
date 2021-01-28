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

import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import { DemographicView, isDemographicView } from "../demographics";
import { Dropdown } from "../UiLibrary";

type DemographicFilterOption = { id: DemographicView; label: string };

type DemographicFilterSelectProps = {
  metric: HistoricalPopulationBreakdownMetric;
};

const DemographicFilterSelect: React.FC<DemographicFilterSelectProps> = ({
  metric,
}) => {
  const options: DemographicFilterOption[] = [
    { id: "total", label: "Total" },
    { id: "raceOrEthnicity", label: "Race" },
    { id: "gender", label: "Gender" },
    { id: "ageBucket", label: "Age" },
  ];

  const onChange = action("change demographic filter", (newFilter: string) => {
    if (isDemographicView(newFilter)) {
      // eslint-disable-next-line no-param-reassign
      metric.demographicView = newFilter;
    }
  });

  return (
    <Dropdown
      label="View"
      onChange={onChange}
      options={options}
      selectedId={metric.demographicView}
    />
  );
};

export default observer(DemographicFilterSelect);
