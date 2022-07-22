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
import RateByCategoryAndDemographicsMetric from "../contentModels/RateByCategoryAndDemographicsMetric";
import { RiderCohort, RiderCohortList } from "../demographics";
import { formatAsPct } from "../utils";
import withMetricHydrator from "../withMetricHydrator";
import MetricVizControls from "../MetricVizControls";
import DemographicFilterSelect from "../DemographicFilterSelect";
import { TooltipContentFunction } from "../charts";
import { RateByCategoryAndDemographicsRecords } from "../contentModels/types";
import { BarChartCluster } from "../charts/BarChartCluster";
import VizNotes from "../VizNotes";

type VizRateByCategoryAndDemographicsProps = {
  metric: RateByCategoryAndDemographicsMetric;
};

const getTooltipProps: TooltipContentFunction = (columnData) => {
  const { data, label } = columnData as {
    data: RateByCategoryAndDemographicsRecords;
    label: string;
  };

  return {
    title: `${columnData.rName}, ${label}`,
    records: [
      {
        value: formatAsPct(data[columnData.rName as RiderCohort]),
      },
    ],
  };
};

const VizRateByCategoryAndDemographics: React.FC<VizRateByCategoryAndDemographicsProps> = ({
  metric,
}) => {
  const { demographicView, dataSeries } = metric;

  if (demographicView === "nofilter")
    throw new Error(
      "Unable to display this metric without demographic filter."
    );

  if (!dataSeries) return null;

  return (
    <>
      <MetricVizControls
        filters={[
          <DemographicFilterSelect metric={metric} isTotalAvailable={false} />,
        ]}
        metric={metric}
      />
      <BarChartCluster
        demographicView={demographicView}
        data={dataSeries}
        accessors={RiderCohortList}
        getTooltipProps={getTooltipProps}
      />
      <VizNotes unknowns={metric.unknowns} download={metric.download} />
    </>
  );
};

export default withMetricHydrator(observer(VizRateByCategoryAndDemographics));
