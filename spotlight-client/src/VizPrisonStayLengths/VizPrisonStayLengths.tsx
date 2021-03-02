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
import Measure from "react-measure";
import { animated, useSpring, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import {
  CommonDataPoint,
  BarChartTrellis,
  singleChartHeight,
  TooltipContentFunction,
} from "../charts";
import DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import MetricVizControls from "../MetricVizControls";
import { prisonStayLengthFields } from "../metricsApi";
import NoMetricData from "../NoMetricData";
import { animation } from "../UiLibrary";

const ChartsWrapper = styled.div`
  position: relative;
`;

const getTooltipProps: TooltipContentFunction = (columnData) => {
  const {
    summary: [
      {
        data: { label, pct, value },
      },
    ],
  } = columnData as {
    // can't find any Semiotic type definition that describes what is actually
    // passed to this function, but the part we care about looks like this
    summary: { data: CommonDataPoint }[];
  };

  return {
    title: `${label}${
      // special case: the first category already has "year" in it
      label !== prisonStayLengthFields[0].categoryLabel ? " years" : ""
    }`,
    records: [
      {
        pct,
        value,
      },
    ],
  };
};

type VizPrisonStayLengthsProps = {
  metric: DemographicsByCategoryMetric;
};

const VizPrisonStayLengths: React.FC<VizPrisonStayLengthsProps> = ({
  metric,
}) => {
  const { dataSeries, demographicView } = metric;

  const [chartContainerStyles, setChartContainerStyles] = useSpring(() => ({
    from: { height: singleChartHeight },
    height: singleChartHeight,
    config: { friction: 40, tension: 220, clamp: true },
  }));

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
      <Measure
        bounds
        onResize={({ bounds }) => {
          if (bounds) setChartContainerStyles({ height: bounds.height });
        }}
      >
        {({ measureRef }) => (
          <>
            <MetricVizControls
              filters={[<DemographicFilterSelect metric={metric} />]}
              metric={metric}
            />
            <animated.div style={chartContainerStyles}>
              <ChartsWrapper ref={measureRef}>
                {chartTransitions.map(({ item, key, props }) => (
                  <animated.div key={key} style={props}>
                    {
                      // for type safety we have to check this again
                      // but it should always be defined if we've gotten this far
                      item.dataSeries && (
                        <BarChartTrellis
                          data={item.dataSeries}
                          getTooltipProps={getTooltipProps}
                        />
                      )
                    }
                  </animated.div>
                ))}
              </ChartsWrapper>
            </animated.div>
          </>
        )}
      </Measure>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizPrisonStayLengths);
