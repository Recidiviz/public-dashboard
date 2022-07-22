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
import CategoriesByDemographicMetric from "../contentModels/CategoriesByDemographicMetric";
import type DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import type HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import RateByCategoryAndDemographicsMetric from "../contentModels/RateByCategoryAndDemographicsMetric";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import SentenceTypeByLocationMetric from "../contentModels/SentenceTypeByLocationMetric";
import SupervisionSuccessRateMetric from "../contentModels/SupervisionSuccessRateMetric";
import {
  DemographicView,
  DemographicViewList,
  getDemographicViewLabel,
  isDemographicView,
} from "../demographics";
import { Dropdown } from "../UiLibrary";

type DemographicFilterOption = { id: DemographicView; label: string };

type DemographicFilterSelectProps = {
  disabled?: boolean;
  isTotalAvailable?: boolean;
  metric:
    | HistoricalPopulationBreakdownMetric
    | DemographicsByCategoryMetric
    | RecidivismRateMetric
    | SentenceTypeByLocationMetric
    | SupervisionSuccessRateMetric
    | CategoriesByDemographicMetric
    | RateByCategoryAndDemographicsMetric;
};

const DemographicFilterSelect: React.FC<DemographicFilterSelectProps> = ({
  disabled,
  isTotalAvailable = true,
  metric,
}) => {
  const options: DemographicFilterOption[] = DemographicViewList.filter(
    (view): view is Exclude<DemographicView, "nofilter"> =>
      isTotalAvailable
        ? view !== "nofilter"
        : view !== "nofilter" && view !== "total"
  ).map((view) => ({
    id: view,
    label: getDemographicViewLabel(view),
  }));

  const onChange = action("change demographic filter", (newFilter: string) => {
    if (isDemographicView(newFilter)) {
      // eslint-disable-next-line no-param-reassign
      metric.demographicView = newFilter;
    }
  });

  return (
    <Dropdown
      disabled={disabled}
      label="View"
      onChange={onChange}
      options={options}
      selectedId={metric.demographicView}
    />
  );
};

export default observer(DemographicFilterSelect);
