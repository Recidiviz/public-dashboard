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
import { animated, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { BubbleChart, ProportionalBar } from "../charts";
import { useHighlightedItem } from "../charts/utils";
import DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import MetricVizControls from "../MetricVizControls";
import { animation, VerticallyExpandable, zIndex } from "../UiLibrary";
import VizNotes from "../VizNotes";
import withMetricHydrator from "../withMetricHydrator";

const bubbleChartHeight = 325;

const barChartsHeight = 460;
const barChartsGutter = 42;

const ChartWrapper = styled.div`
  position: relative;
`;

const CategoryBarWrapper = styled.div`
  padding-bottom: ${rem(16)};
  position: relative;
  width: 100%;
`;

type VizDemographicsByCategoryProps = {
  metric: DemographicsByCategoryMetric;
};

const VizDemographicsByCategory: React.FC<VizDemographicsByCategoryProps> = ({
  metric,
}) => {
  const { highlighted, setHighlighted } = useHighlightedItem();

  const { demographicView, dataSeries, unknowns } = metric;

  const chartTransitions = useTransition(
    { demographicView, dataSeries },
    (item) => item.demographicView,
    animation.crossFade
  );

  if (demographicView === "nofilter")
    throw new Error(
      "Unable to display this metric without demographic filter."
    );

  if (dataSeries) {
    return (
      <>
        <MetricVizControls
          filters={[<DemographicFilterSelect metric={metric} />]}
          metric={metric}
        />
        <VerticallyExpandable initialHeight={bubbleChartHeight}>
          {chartTransitions.map(({ item, key, props }) => (
            <ChartWrapper key={key}>
              <animated.div style={props}>
                {
                  // for type safety we have to check this again
                  // but it should always be defined if we've gotten this far
                  item.dataSeries &&
                    (item.demographicView === "total" ? (
                      <BubbleChart
                        height={bubbleChartHeight}
                        data={item.dataSeries[0].records}
                      />
                    ) : (
                      item.dataSeries.map(
                        ({ label, records }, index, categories) => (
                          <CategoryBarWrapper
                            key={label}
                            style={{
                              // prevents subsequent charts from covering up the tooltip for this one
                              zIndex: zIndex.base + categories.length - index,
                            }}
                          >
                            <ProportionalBar
                              data={records}
                              height={
                                barChartsHeight / categories.length -
                                barChartsGutter
                              }
                              title={label}
                              showLegend={index === categories.length - 1}
                              {...{ highlighted, setHighlighted }}
                            />
                          </CategoryBarWrapper>
                        )
                      )
                    ))
                }
              </animated.div>
            </ChartWrapper>
          ))}
        </VerticallyExpandable>
        <VizNotes smallData unknowns={unknowns} />
      </>
    );
  }

  return null;
};

export default withMetricHydrator(observer(VizDemographicsByCategory));
