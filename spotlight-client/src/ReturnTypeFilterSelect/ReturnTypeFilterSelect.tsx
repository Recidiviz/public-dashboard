// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2026 Recidiviz, Inc.
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
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import { isReturnType, ReturnType } from "../metricsApi";
import { Dropdown } from "../UiLibrary";

const OPTIONS: { id: ReturnType; label: string }[] = [
  { id: "ALL", label: "Any return" },
  { id: "INCARCERATION", label: "Return to prison" },
  { id: "SUPERVISION", label: "Return to supervision" },
];

type ReturnTypeFilterSelectProps = {
  metric: RecidivismRateMetric;
};

const ReturnTypeFilterSelect: React.FC<ReturnTypeFilterSelectProps> = ({
  metric,
}) => {
  const onChange = action("change return type filter", (newFilter: string) => {
    if (isReturnType(newFilter)) {
      // eslint-disable-next-line no-param-reassign
      metric.returnType = newFilter;
    }
  });

  return (
    <Dropdown
      label="Type of Return"
      onChange={onChange}
      options={OPTIONS}
      selectedId={metric.returnType}
    />
  );
};

export default observer(ReturnTypeFilterSelect);
