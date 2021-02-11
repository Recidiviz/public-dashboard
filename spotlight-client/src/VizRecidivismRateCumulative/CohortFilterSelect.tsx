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

import { observer } from "mobx-react-lite";
import React from "react";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import { colors, Dropdown } from "../UiLibrary";

type CohortSelectProps = {
  metric: RecidivismRateMetric;
};

const CohortFilterSelect: React.FC<CohortSelectProps> = ({ metric }) => {
  const { allCohorts, selectedCohorts } = metric;

  if (allCohorts === undefined || selectedCohorts === undefined) return null;

  const updateSelection = (newSelection: string[]) => {
    metric.setSelectedCohorts(newSelection.map((cohort) => Number(cohort)));
  };

  return (
    <Dropdown
      label="Cohort"
      multiple
      onChangeMultiple={updateSelection}
      options={allCohorts.map((year, index) => ({
        id: `${year}`,
        label: `${year}`,
        color: colors.dataViz[index],
      }))}
      selectedId={selectedCohorts.map((year) => `${year}`)}
      onHighlight={(id) =>
        id
          ? // this works because cohort IDs and labels are the same
            metric.setHighlightedCohort({ label: id })
          : metric.setHighlightedCohort()
      }
    />
  );
};

export default observer(CohortFilterSelect);
