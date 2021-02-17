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
import React from "react";
import RateCohorts from "../charts/RateCohorts";
import SupervisionSuccessRateMetric from "../contentModels/SupervisionSuccessRateMetric";
import FiltersWrapper from "../FiltersWrapper";
import LocalityFilterSelect from "../LocalityFilterSelect";
import NoMetricData from "../NoMetricData";

const getCohortLabel = (id: string) => {
  const [month, year] = id.split(" ");
  return month === "Jan" ? year : "";
};

type VizSupervisionSuccessRateProps = {
  metric: SupervisionSuccessRateMetric;
};

const VizSupervisionSuccessRate: React.FC<VizSupervisionSuccessRateProps> = ({
  metric,
}) => {
  const { cohortRecords } = metric;

  if (cohortRecords) {
    return (
      <>
        <FiltersWrapper filters={[<LocalityFilterSelect metric={metric} />]} />
        <RateCohorts data={cohortRecords} getBarLabel={getCohortLabel} />
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizSupervisionSuccessRate);
