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
import styled from "styled-components/macro";
import { TopologicalMap } from "../charts";
import ProgramParticipationCurrentMetric from "../contentModels/ProgramParticipationCurrentMetric";
import MetricVizControls from "../MetricVizControls";
import withMetricHydrator from "../withMetricHydrator";

const MapWrapper = styled.figure``;

type VizProgramParticipationCurrentProps = {
  metric: ProgramParticipationCurrentMetric;
  preview?: boolean;
};

const VizProgramParticipationCurrent: React.FC<VizProgramParticipationCurrentProps> = ({
  metric,
  preview,
}) => {
  const { dataMapping } = metric;

  if (dataMapping) {
    return !preview ? (
      <>
        <MetricVizControls filters={[]} metric={metric} />
        <MapWrapper aria-label={`${metric.localityLabels.label} map chart`}>
          <TopologicalMap
            aspectRatio={metric.mapData.aspectRatio}
            localityData={dataMapping}
            topology={metric.mapData.topology}
          />
        </MapWrapper>
      </>
    ) : (
      <MapWrapper aria-label={`${metric.localityLabels.label} map chart`}>
        <TopologicalMap
          aspectRatio={1.9}
          localityData={dataMapping}
          topology={metric.mapData.topology}
        />
      </MapWrapper>
    );
  }

  return null;
};

export default withMetricHydrator(observer(VizProgramParticipationCurrent));
