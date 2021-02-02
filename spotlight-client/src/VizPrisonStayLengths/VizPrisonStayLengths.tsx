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
import React, { useState } from "react";
import Measure from "react-measure";
import { animated, useSpring, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import {
  ProjectedDataPoint,
  BarChartTrellis,
  singleChartHeight,
} from "../charts";
import DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import FiltersWrapper from "../FiltersWrapper";
import { prisonStayLengthFields } from "../metricsApi";
import NoMetricData from "../NoMetricData";

const ChartsWrapper = styled.div`
  position: relative;
`;

type VizPrisonStayLengthsProps = {
  metric: DemographicsByCategoryMetric;
};

const VizPrisonStayLengths: React.FC<VizPrisonStayLengthsProps> = ({
  metric,
}) => {
  const [selectedChartTitle, setSelectedChartTitle] = useState<string>();

  const getTooltipProps = (columnData: ProjectedDataPoint) => {
    // this isn't in the Semiotic type defs but it does exist;
    // this type gets picked up from the input data format
    const summary = columnData.summary as { data: ProjectedDataPoint }[];
    const {
      data: { label, pct, value },
    } = summary[0];
    return {
      title: selectedChartTitle || "",
      records: [
        {
          label: `${label}${
            // special case: the first category already has "year" in it
            label !== prisonStayLengthFields[0].categoryLabel ? " years" : ""
          }`,
          pct,
          value,
        },
      ],
    };
  };

  const { dataSeries, demographicView } = metric;

  const [chartContainerStyles, setChartContainerStyles] = useSpring(() => ({
    from: { height: singleChartHeight },
    height: singleChartHeight,
    config: { friction: 40, tension: 220, clamp: true },
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
                <ChartsWrapper key={key} ref={measureRef}>
                  <animated.div style={{ ...props, top: 0 }}>
                    {
                      // for type safety we have to check this again
                      // but it should always be defined if we've gotten this far
                      item.dataSeries && (
                        <BarChartTrellis
                          data={item.dataSeries}
                          getTooltipProps={getTooltipProps}
                          setSelectedChartTitle={setSelectedChartTitle}
                        />
                      )
                    }
                  </animated.div>
                </ChartsWrapper>
              ))}
            </animated.div>
          </>
        )}
      </Measure>
    );
  }

  return <NoMetricData metric={metric} />;
};

export default observer(VizPrisonStayLengths);
