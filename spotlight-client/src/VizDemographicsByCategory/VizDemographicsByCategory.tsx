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
import React, { useState } from "react";
import Measure from "react-measure";
import { animated, useSpring, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { ItemToHighlight, ProportionalBar } from "../charts";
import BubbleChart from "../charts/BubbleChart";
import DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import FiltersWrapper from "../FiltersWrapper";
import NoMetricData from "../NoMetricData";
import { zIndex } from "../UiLibrary";

const SECTION_HEIGHT = 450;
const GUTTER = 42;

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
  const [highlighted, setHighlighted] = useState<ItemToHighlight>();

  const { demographicView, dataSeries } = metric;

  const [chartContainerStyles, setChartContainerStyles] = useSpring(() => ({
    from: { height: SECTION_HEIGHT },
    height: SECTION_HEIGHT,
    config: { friction: 40, tension: 280, clamp: true },
  }));

  const chartTransitions = useTransition(
    { demographicView, dataSeries },
    (item) => item.demographicView,
    {
      initial: { opacity: 1 },
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0, position: "absolute" },
      config: { friction: 40, tension: 280 },
    }
  );

  if (demographicView === "nofilter")
    throw new Error(
      "Unable to display this metric without demographic filter."
    );

  if (dataSeries) {
    return (
      <Measure
        bounds
        onResize={({ bounds }) => {
          if (bounds) setChartContainerStyles({ height: bounds.height });
        }}
      >
        {({ measureRef }) => (
          <>
            <FiltersWrapper
              filters={[<DemographicFilterSelect metric={metric} />]}
            />
            <animated.div style={chartContainerStyles}>
              {chartTransitions.map(({ item, key, props }) => (
                <ChartWrapper key={key} ref={measureRef}>
                  <animated.div style={{ ...props, top: 0 }}>
                    {
                      // for type safety we have to check this again
                      // but it should always be defined if we've gotten this far
                      item.dataSeries &&
                        (item.demographicView === "total" ? (
                          <BubbleChart
                            height={SECTION_HEIGHT}
                            data={item.dataSeries[0].records}
                          />
                        ) : (
                          item.dataSeries.map(
                            ({ label, records }, index, categories) => (
                              <CategoryBarWrapper
                                key={label}
                                style={{
                                  // prevents subsequent charts from covering up the tooltip for this one
                                  zIndex:
                                    zIndex.base + categories.length - index,
                                }}
                              >
                                <ProportionalBar
                                  data={records}
                                  height={
                                    SECTION_HEIGHT / categories.length - GUTTER
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
            </animated.div>
          </>
        )}
      </Measure>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizDemographicsByCategory);