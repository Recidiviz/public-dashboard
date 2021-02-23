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
import type PopulationBreakdownByLocationMetric from "../contentModels/PopulationBreakdownByLocationMetric";
import type SentenceTypeByLocationMetric from "../contentModels/SentenceTypeByLocationMetric";
import type SupervisionSuccessRateMetric from "../contentModels/SupervisionSuccessRateMetric";
import { Dropdown } from "../UiLibrary";

type LocalityFilterSelectProps = {
  metric:
    | PopulationBreakdownByLocationMetric
    | SentenceTypeByLocationMetric
    | SupervisionSuccessRateMetric;
};

const LocalityFilterSelect: React.FC<LocalityFilterSelectProps> = ({
  metric,
}) => {
  const onChange = action("change locality filter", (newFilter: string) => {
    // eslint-disable-next-line no-param-reassign
    metric.localityId = newFilter;
  });

  return (
    <Dropdown
      label={metric.localityLabels.label}
      onChange={onChange}
      options={metric.localityLabels.entries}
      selectedId={metric.localityId}
    />
  );
};

export default observer(LocalityFilterSelect);
