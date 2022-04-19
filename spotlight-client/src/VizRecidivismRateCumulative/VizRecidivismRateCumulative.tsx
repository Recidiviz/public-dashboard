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
import RateTrend, {
  CHART_HEIGHT,
  MIN_LEGEND_HEIGHT,
} from "../charts/RateTrend";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import MetricVizControls from "../MetricVizControls";
import { animation } from "../UiLibrary";
import VizNotes from "../VizNotes";
import withMetricHydrator from "../withMetricHydrator";
import CohortFilterSelect from "./CohortFilterSelect";

const ChartWrapper = styled.div`
  /* px instead of rem for consistency with Semiotic */
  min-height: ${CHART_HEIGHT + MIN_LEGEND_HEIGHT}px;
  position: relative;
`;

type VizRecidivismRateCumulativeProps = {
  metric: RecidivismRateMetric;
};

const VizRecidivismRateCumulative: React.FC<VizRecidivismRateCumulativeProps> = ({
  metric,
}) => {
  const {
    cohortDataSeries,
    selectedCohorts,
    highlightedCohort,
    demographicView,
    unknowns,
  } = metric;

  const chartTransitions = useTransition(
    { demographicView, cohortDataSeries },
    (item) => item.demographicView,
    animation.crossFade
  );

  if (cohortDataSeries && selectedCohorts) {
    return (
      <>
        <MetricVizControls
          filters={[
            <CohortFilterSelect metric={metric} />,
            metric.includesDemographics && (
              <DemographicFilterSelect
                disabled={selectedCohorts.length !== 1}
                metric={metric}
              />
            ),
          ]}
          metric={metric}
        />
        <ChartWrapper>
          {chartTransitions.map(({ item, props, key }) => (
            <animated.div key={key} style={props}>
              {item.cohortDataSeries && (
                <RateTrend
                  data={item.cohortDataSeries}
                  title="Cumulative Recidivism Rate"
                  xAccessor="followupYears"
                  // we don't want the X axis to get shorter when cohorts are filtered
                  xExtent={[0, metric.maxFollowupPeriod]}
                  xLabel="Years since release"
                  xTicks={
                    metric.maxFollowupPeriod < 10
                      ? metric.maxFollowupPeriod
                      : undefined
                  }
                  highlighted={
                    highlightedCohort
                      ? { label: `${highlightedCohort}` }
                      : undefined
                  }
                />
              )}
            </animated.div>
          ))}
        </ChartWrapper>
        <VizNotes smallData unknowns={unknowns} download={metric.download} />
      </>
    );
  }

  return null;
};

export default withMetricHydrator(observer(VizRecidivismRateCumulative));
