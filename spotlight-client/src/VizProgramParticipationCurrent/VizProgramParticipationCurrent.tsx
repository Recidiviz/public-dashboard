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
import NoMetricData from "../NoMetricData";

const MapWrapper = styled.figure``;

type VizProgramParticipationCurrentProps = {
  metric: ProgramParticipationCurrentMetric;
};

const VizProgramParticipationCurrent: React.FC<VizProgramParticipationCurrentProps> = ({
  metric,
}) => {
  const { dataMapping } = metric;

  if (dataMapping) {
    return (
      <MapWrapper aria-label={`${metric.localityLabels.label} Map`}>
        <TopologicalMap
          aspectRatio={metric.mapData.aspectRatio}
          localityData={dataMapping}
          topology={metric.mapData.topology}
        />
      </MapWrapper>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizProgramParticipationCurrent);
