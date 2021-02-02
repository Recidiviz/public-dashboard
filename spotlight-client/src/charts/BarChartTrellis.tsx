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

import React, { useState, useCallback } from "react";
import { FacetController, OrdinalFrame } from "semiotic";
import styled from "styled-components/macro";
import ChartWrapper from "./ChartWrapper";
import ResponsiveTooltipController, {
  ResponsiveTooltipControllerProps,
} from "./ResponsiveTooltipController";
import { formatAsPct } from "../utils";
import { getDataWithPct, highlightFade } from "./utils";
import { animation } from "../UiLibrary";
import { CategoricalChartRecord, ProjectedDataPoint } from "./types";
import MeasureWidth from "../MeasureWidth";

export const singleChartHeight = 270;

const MARGIN = { top: 40, bottom: 56, left: 48, right: 0 };

const ChartTitle = styled.text`
  text-anchor: start;
`;

const ColumnLabel = styled.text`
  text-anchor: middle;
`;

const BarAxisLabel = styled.text`
  text-anchor: middle;
`;

type BarChartData = {
  label: string;
  records: CategoricalChartRecord[];
};

type BarChartTrellisProps = {
  barAxisLabel?: string;
  data: BarChartData[];
  formatBarLabel?: (label: string) => string;
  getTooltipProps: ResponsiveTooltipControllerProps["getTooltipProps"];
  setSelectedChartTitle: (title: string) => void;
};

export function BarChartTrellis({
  barAxisLabel,
  data,
  formatBarLabel = (label) => label,
  getTooltipProps,
  setSelectedChartTitle,
}: BarChartTrellisProps): React.ReactElement {
  const [highlightedLabel, setHighlightedLabel] = useState();

  // ResponsiveTooltipController expects this to be a stable reference
  const setHighlighted = useCallback(
    (d) => setHighlightedLabel(d ? d.column.name : undefined),
    [setHighlightedLabel]
  );

  return (
    <MeasureWidth>
      {({ measureRef, width }) => (
        <ChartWrapper ref={measureRef}>
          <ResponsiveTooltipController
            getTooltipProps={getTooltipProps}
            hoverAnnotation
            render={({
              customClickBehavior,
              customHoverBehavior,
              ...responsiveTooltipProps
            }) =>
              width === 0 ? null : (
                // @ts-expect-error array of rendered components works but the type defs don't like it
                <FacetController
                  // it's important to provide this to all facets even if we hide the axis,
                  // because it determines how values are formatted in ARIA labels
                  axes={[
                    {
                      baseline: false,
                      orient: "left",
                      tickFormat: formatAsPct,
                      tickSize: 0,
                    },
                  ]}
                  backgroundGraphics={
                    barAxisLabel ? (
                      // this functions as an axis label, but there is no Semiotic API for this;
                      // it's hidden from screen readers either way, so not a real a11y concern
                      <BarAxisLabel
                        // Semiotic axis labels use this class, we want to pick up those styles here
                        className="axis-title"
                        x={
                          MARGIN.left + (width - MARGIN.left - MARGIN.right) / 2
                        }
                        y={singleChartHeight - MARGIN.bottom / 3}
                      >
                        {barAxisLabel}
                      </BarAxisLabel>
                    ) : undefined
                  }
                  baseMarkProps={{
                    transitionDuration: { fill: animation.defaultDuration },
                  }}
                  margin={MARGIN}
                  oAccessor="label"
                  oLabel={(label: string) => (
                    <ColumnLabel>{formatBarLabel(label)}</ColumnLabel>
                  )}
                  oPadding={8}
                  rAccessor="pct"
                  rExtent={[0, 1]}
                  size={[width, singleChartHeight]}
                  style={(d: ProjectedDataPoint) => ({
                    fill:
                      highlightedLabel && highlightedLabel !== d.label
                        ? highlightFade(d.color)
                        : d.color,
                  })}
                  type="bar"
                >
                  {data.map(({ label, records: chartData }, index) => (
                    <OrdinalFrame
                      // we have to extend these custom behavior functions
                      // to get the chart title into state for the tooltip;
                      // they are guaranteed to be provided by ResponsiveTooltipController
                      customClickBehavior={(d: ProjectedDataPoint) => {
                        setSelectedChartTitle(label);
                        if (customClickBehavior) customClickBehavior(d);
                      }}
                      customHoverBehavior={(d: ProjectedDataPoint) => {
                        setSelectedChartTitle(label);
                        if (customHoverBehavior) customHoverBehavior(d);
                      }}
                      data={getDataWithPct(chartData)}
                      // using indices actually makes a better experience here;
                      // the charts animate in and out based on how many there are
                      // and we avoid bugs that happen when values change but the
                      // identifiers (i.e. titles) stay the same
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      title={
                        <ChartTitle x={0 - width / 2 + MARGIN.left}>
                          {label}
                        </ChartTitle>
                      }
                      {...responsiveTooltipProps}
                    />
                  ))}
                </FacetController>
              )
            }
            setHighlighted={setHighlighted}
          />
        </ChartWrapper>
      )}
    </MeasureWidth>
  );
}
