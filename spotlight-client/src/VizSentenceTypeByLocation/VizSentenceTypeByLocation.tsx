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
import FiltersWrapper from "../FiltersWrapper";
import LocalityFilterSelect from "../LocalityFilterSelect";
import NoMetricData from "../NoMetricData";
import SentenceTypeChart, {
  CHART_BOTTOM_PADDING,
  CHART_HEIGHT,
} from "./SentenceTypeChart";

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
    {
      initial: { opacity: 1 },
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0, position: "absolute" },
      config: { friction: 40, tension: 280 },
    }
  );

  if (metric.dataGraph) {
    return (
      <>
        <FiltersWrapper
          filters={[
            <LocalityFilterSelect metric={metric} />,
            <DemographicFilterSelect metric={metric} />,
          ]}
        />
        <ChartWrapper>
          {chartTransitions.map(
            ({ item, key, props }) =>
              item.dataGraph && (
                <animated.div key={key} style={{ ...props, top: 0 }}>
                  <SentenceTypeChart {...item.dataGraph} />
                </animated.div>
              )
          )}
        </ChartWrapper>
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizSentenceTypeByLocation);
