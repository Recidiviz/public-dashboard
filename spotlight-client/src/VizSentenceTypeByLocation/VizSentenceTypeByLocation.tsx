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
import SentenceTypeByLocationMetric from "../contentModels/SentenceTypeByLocationMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import FiltersWrapper from "../FiltersWrapper";
import LocalityFilterSelect from "../LocalityFilterSelect";
import NoMetricData from "../NoMetricData";
import SentenceTypeChart from "./SentenceTypeChart";

type VizSentenceTypeByLocationProps = {
  metric: SentenceTypeByLocationMetric;
};

const VizSentenceTypeByLocation: React.FC<VizSentenceTypeByLocationProps> = ({
  metric,
}) => {
  if (metric.dataGraph) {
    return (
      <>
        <FiltersWrapper
          filters={[
            <LocalityFilterSelect metric={metric} />,
            <DemographicFilterSelect metric={metric} />,
          ]}
        />
        <SentenceTypeChart {...metric.dataGraph} />
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizSentenceTypeByLocation);
