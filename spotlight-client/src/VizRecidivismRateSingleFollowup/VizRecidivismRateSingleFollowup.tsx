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
  BarChartTrellis,
  CommonDataPoint,
  singleChartHeight,
  TooltipContentFunction,
} from "../charts";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import DemographicFilterSelect from "../DemographicFilterSelect";
import MetricVizControls from "../MetricVizControls";
import { animation, VerticallyExpandable } from "../UiLibrary";
import { formatAsNumber, formatAsPct } from "../utils";
import VizNotes from "../VizNotes";
import withMetricHydrator from "../withMetricHydrator";
import FollowupPeriodFilterSelect from "./FollowupPeriodFilterSelect";

const ChartsWrapper = styled.div`
  position: relative;
`;

const getTooltipProps: TooltipContentFunction = (columnData) => {
  const {
    summary: [
      {
        data: { label, pct, value, denominator },
      },
    ],
  } = columnData as {
    // can't find any Semiotic type definition that describes what is actually
    // passed to this function, but the part we care about looks like this
    // (the properties are picked up from the input data)
    summary: { data: CommonDataPoint & { denominator: number } }[];
  };

  const records = [];

  if (Number.isNaN(value)) {
    records.push({
      value: `${formatAsPct(pct as number)} of ${formatAsNumber(denominator)}`,
    });
  } else {
    records.push({
      pct,
      value: `${value} of ${formatAsNumber(denominator)}`,
    });
  }

  return {
    title: `${label}`,
    records,
  };
};

type VizRecidivismRateSingleFollowupProps = {
  metric: RecidivismRateMetric;
};

const VizRecidivismRateSingleFollowup: React.FC<VizRecidivismRateSingleFollowupProps> = ({
  metric,
}) => {
  const {
    demographicView,
    followUpYears,
    includesDemographics,
    singleFollowupDemographics,
    unknowns,
  } = metric;

  const chartTransitions = useTransition(
    { demographicView, singleFollowupDemographics },
    (item) => item.demographicView,
    animation.crossFade
  );

  const [containerWidth, setContainerWidth] = useState<number>();
  // this is NOT a sophisticated heuristic, but the bar labels
  // (which are years) tend to get cramped around this size
  const useAngledLabels =
    typeof containerWidth === "number" &&
    containerWidth < 400 &&
    followUpYears === 1;

  if (demographicView === "nofilter")
    throw new Error(
      "Unable to display this metric without demographic filter."
    );

  if (singleFollowupDemographics) {
    return (
      <Measure
        bounds
        onResize={({ bounds }) => {
          if (bounds) {
            setContainerWidth(bounds.width);
          }
        }}
      >
        {({ measureRef }) => (
          <>
            <MetricVizControls
              filters={[
                <FollowupPeriodFilterSelect metric={metric} />,
                includesDemographics && (
                  <DemographicFilterSelect metric={metric} />
                ),
              ]}
              metric={metric}
            />
            <VerticallyExpandable initialHeight={singleChartHeight}>
              <ChartsWrapper ref={measureRef}>
                {chartTransitions.map(({ item, key, props }) => (
                  <animated.div key={key} style={props}>
                    {
                      // for type safety we have to check this again
                      // but it should always be defined if we've gotten this far
                      item.singleFollowupDemographics && (
                        <BarChartTrellis
                          angledLabels={useAngledLabels}
                          barAxisLabel="Release Cohort"
                          data={item.singleFollowupDemographics}
                          getTooltipProps={getTooltipProps}
                        />
                      )
                    }
                  </animated.div>
                ))}
              </ChartsWrapper>
            </VerticallyExpandable>
            <VizNotes smallData unknowns={unknowns} />
          </>
        )}
      </Measure>
    );
  }

  return null;
};

export default withMetricHydrator(observer(VizRecidivismRateSingleFollowup));
