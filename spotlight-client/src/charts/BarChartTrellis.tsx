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
import { OrdinalFrame } from "semiotic";
import styled from "styled-components/macro";
import { ChartWrapper } from "@recidiviz/design-system";
import ResponsiveTooltipController, {
  ResponsiveTooltipControllerProps,
} from "./ResponsiveTooltipController";
import { formatAsPct } from "../utils";
import { highlightFade } from "./utils";
import { animation } from "../UiLibrary";
import { CategoricalChartRecord, CommonDataPoint } from "./types";
import MeasureWidth from "../MeasureWidth";

export const singleChartHeight = 300;

const MARGIN = { top: 56, bottom: 80, left: 48, right: 0 };

const ChartTitle = styled.text`
  font-weight: 500;
  letter-spacing: -0.01em;
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
  records: (CategoricalChartRecord & { pct: number })[];
};

type BarChartTrellisProps = {
  angledLabels?: boolean;
  barAxisLabel?: string;
  data: BarChartData[];
  formatBarLabel?: (label: string) => string;
  getTooltipProps: ResponsiveTooltipControllerProps["getTooltipProps"];
};

/**
 * Renders multiple bar charts (one per series in data)
 * with identical Y axis ranges and cross-highlighting.
 */
export function BarChartTrellis({
  angledLabels,
  barAxisLabel,
  data,
  formatBarLabel = (label) => label,
  getTooltipProps,
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
          {width === 0
            ? null
            : data.map(({ label, records: chartData }, index) => (
                <ResponsiveTooltipController
                  key={label}
                  getTooltipProps={getTooltipProps}
                  hoverAnnotation
                  setHighlighted={setHighlighted}
                >
                  <OrdinalFrame
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
                            MARGIN.left +
                            (width - MARGIN.left - MARGIN.right) / 2
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
                    data={chartData}
                    margin={MARGIN}
                    oAccessor="label"
                    // @ts-expect-error Semiotic types can't handle a styled component here but it's fine
                    oLabel={(barLabel) => (
                      <ColumnLabel
                        transform={
                          angledLabels
                            ? `rotate(-45) translate(-10)`
                            : undefined
                        }
                      >
                        {formatBarLabel(barLabel as string)}
                      </ColumnLabel>
                    )}
                    oPadding={2}
                    rAccessor="pct"
                    rExtent={[0, 1]}
                    size={[width, singleChartHeight]}
                    style={(d: CommonDataPoint) => ({
                      fill:
                        highlightedLabel && highlightedLabel !== d.label
                          ? highlightFade(d.color)
                          : d.color,
                    })}
                    // Semiotic centers titles by default; this x offset will align left
                    title={<ChartTitle x={0 - width / 2}>{label}</ChartTitle>}
                    type="bar"
                  />
                </ResponsiveTooltipController>
              ))}
        </ChartWrapper>
      )}
    </MeasureWidth>
  );
}
