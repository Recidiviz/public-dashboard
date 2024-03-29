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
import { animated, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import SentenceTypeByLocationMetric from "../contentModels/SentenceTypeByLocationMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import MetricVizControls from "../MetricVizControls";
import LocalityFilterSelect from "../LocalityFilterSelect";
import { animation } from "../UiLibrary";
import SentenceTypeChart, {
  CHART_BOTTOM_PADDING,
  CHART_HEIGHT,
} from "./SentenceTypeChart";
import withMetricHydrator from "../withMetricHydrator";
import VizNotes from "../VizNotes";

const ChartWrapper = styled.div`
  /* px rather than rem for consistency with Semiotic */
  height: ${CHART_HEIGHT + CHART_BOTTOM_PADDING}px;
  position: relative;
`;

type VizSentenceTypeByLocationProps = {
  metric: SentenceTypeByLocationMetric;
};

const VizSentenceTypeByLocation: React.FC<VizSentenceTypeByLocationProps> = ({
  metric,
}) => {
  const { demographicView, dataGraph, localityId } = metric;

  if (demographicView === "nofilter")
    throw new Error(
      "Unable to display this metric without demographic filter."
    );

  const chartTransitions = useTransition(
    { demographicView, dataGraph, localityId },
    (item) => `${item.demographicView} ${item.localityId}`,
    animation.crossFade
  );

  if (metric.dataGraph) {
    return (
      <>
        <MetricVizControls
          filters={[
            <LocalityFilterSelect metric={metric} />,
            <DemographicFilterSelect metric={metric} />,
          ]}
          metric={metric}
          smallData
        />
        <ChartWrapper>
          {chartTransitions.map(
            ({ item, key, props }) =>
              item.dataGraph && (
                <animated.div key={key} style={props}>
                  <SentenceTypeChart {...item.dataGraph} />
                </animated.div>
              )
          )}
        </ChartWrapper>
        <VizNotes unknowns={metric.unknowns} download={metric.download} />
      </>
    );
  }

  return null;
};

export default withMetricHydrator(observer(VizSentenceTypeByLocation));
