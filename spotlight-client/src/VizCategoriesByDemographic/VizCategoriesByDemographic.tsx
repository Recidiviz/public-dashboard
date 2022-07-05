// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
import CategoriesByDemographicMetric from "../contentModels/CategoriesByDemographicMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import BarChartPair from "../RacialDisparitiesNarrativePage/BarChartPair";
import withMetricHydrator from "../withMetricHydrator";

type VizDemographicsByCategoryProps = {
  metric: CategoriesByDemographicMetric;
};

const VizCategoriesByDemographic: React.FC<VizDemographicsByCategoryProps> = ({
  metric,
}) => {
  const {
    demographicView,
    dataSeries,
    unknowns,
    download,
    methodology,
  } = metric;

  if (demographicView === "nofilter")
    throw new Error(
      "Unable to display this metric without demographic filter."
    );

  if (!dataSeries) return null;

  return (
    <BarChartPair
      data={dataSeries}
      filters={[
        <DemographicFilterSelect metric={metric} isTotalAvailable={false} />,
      ]}
      download={download}
      methodology={methodology}
      unknowns={unknowns}
    />
  );
};

export default withMetricHydrator(observer(VizCategoriesByDemographic));
