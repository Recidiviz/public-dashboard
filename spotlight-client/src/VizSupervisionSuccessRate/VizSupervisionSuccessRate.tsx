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
import { rem } from "polished";
import React from "react";
import Measure from "react-measure";
import { animated, useSpring, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import RateCohorts, { CHART_HEIGHT } from "../charts/RateCohorts";
import SupervisionSuccessRateMetric from "../contentModels/SupervisionSuccessRateMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import MetricVizControls from "../MetricVizControls";
import LocalityFilterSelect from "../LocalityFilterSelect";
import NoMetricData from "../NoMetricData";
import Statistic from "../Statistic";
import { animation } from "../UiLibrary";
import { formatAsPct } from "../utils";
import SmallDataDisclaimer from "../SmallDataDisclaimer";

const DEMOGRAPHICS_MARGIN = 56;

const DEFAULT_DEMOGRAPHICS_HEIGHT = 99;

const CohortChartWrapper = styled.div`
  position: relative;
  /* using px instead of rem for consistency with Semiotic  */
  min-height: ${CHART_HEIGHT}px;
`;

const DemographicsWrapper = styled.div`
  text-align: center;
  width: 100%;
`;

const StatWrapper = styled.div`
  display: inline-block;
  padding: 0 ${rem(24)} ${rem(24)};

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`;

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
  const {
    cohortRecords,
    demographicRecords,
    demographicView,
    localityId,
  } = metric;

  const [demographicsWrapperStyles, setDemographicsWrapperStyles] = useSpring(
    () => ({
      from: { height: DEFAULT_DEMOGRAPHICS_HEIGHT },
      height: DEFAULT_DEMOGRAPHICS_HEIGHT,
      config: { friction: 40, tension: 220, clamp: true },
    })
  );

  const cohortTransitions = useTransition(
    { cohortRecords, localityId },
    (item) => item.localityId,
    animation.crossFade
  );

  const demographicTransitions = useTransition(
    { demographicView, demographicRecords, localityId },
    (item) => `${item.demographicView}_${item.localityId}`,
    animation.crossFade
  );

  if (cohortRecords && demographicRecords) {
    return (
      <>
        <MetricVizControls
          filters={[
            <LocalityFilterSelect metric={metric} />,
            <DemographicFilterSelect metric={metric} />,
          ]}
          metric={metric}
        />
        <CohortChartWrapper>
          {cohortTransitions.map(({ item, key, props }) => (
            <animated.div key={key} style={props}>
              {item.cohortRecords && (
                <RateCohorts
                  data={item.cohortRecords}
                  getBarLabel={getCohortLabel}
                />
              )}
            </animated.div>
          ))}
        </CohortChartWrapper>
        <Measure
          bounds
          onResize={({ bounds }) => {
            if (bounds) setDemographicsWrapperStyles({ height: bounds.height });
          }}
        >
          {({ measureRef }) => (
            <animated.div
              style={{
                ...demographicsWrapperStyles,
                position: "relative",
                marginTop: DEMOGRAPHICS_MARGIN,
              }}
            >
              {demographicTransitions.map(({ item, key, props }) => (
                <animated.div key={key} style={{ ...props, width: "100%" }}>
                  <DemographicsWrapper ref={measureRef}>
                    {item.demographicRecords &&
                      item.demographicRecords.map(({ label, rate }) => (
                        <StatWrapper key={label}>
                          <Statistic
                            maxSize={48}
                            minSize={48}
                            label={label}
                            value={formatAsPct(rate)}
                          />
                        </StatWrapper>
                      ))}
                  </DemographicsWrapper>
                </animated.div>
              ))}
            </animated.div>
          )}
        </Measure>
        <SmallDataDisclaimer />
      </>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizSupervisionSuccessRate);
