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
import React, { useMemo } from "react";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import { Dropdown } from "../UiLibrary";

const OPTIONS = [
  {
    id: "1",
    label: "1 Year",
  },
  {
    id: "3",
    label: "3 Years",
  },
  {
    id: "5",
    label: "5 Years",
  },
];

type FollowupPeriodFilterSelectProps = {
  metric: RecidivismRateMetric;
};

const FollowupPeriodFilterSelect: React.FC<FollowupPeriodFilterSelectProps> = ({
  metric,
}) => {
  const onChange = action(
    "change followup period filter",
    (newFilter: string) => {
      // eslint-disable-next-line no-param-reassign
      metric.followUpYears = Number(newFilter);
    }
  );

  // 5 year followup is not guaranteed to be supported;
  // technically none of them are "guaranteed", but 3 years is industry standard,
  // so in practice maxFollowupPeriod should never be less than that
  const options = useMemo(() => {
    return OPTIONS.filter((opt) => Number(opt.id) <= metric.maxFollowupPeriod);
  }, [metric.maxFollowupPeriod]);

  return (
    <Dropdown
      label="Follow-up Period"
      onChange={onChange}
      options={options}
      selectedId={`${metric.followUpYears}`}
    />
  );
};

export default observer(FollowupPeriodFilterSelect);
