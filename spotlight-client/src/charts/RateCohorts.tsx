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

import React, { useCallback } from "react";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import styled from "styled-components/macro";
import MeasureWidth from "../MeasureWidth";
import { isRateFields, RateFields } from "../metricsApi";
import { animation, colors } from "../UiLibrary";
import { formatAsPct } from "../utils";
import ChartWrapper from "./ChartWrapper";
import ResponsiveTooltipController from "./ResponsiveTooltipController";
import { highlightFade, useHighlightedItem } from "./utils";

export const CHART_HEIGHT = 350;

const MARGIN = {
  top: 10,
  bottom: 20,
  left: 50,
  right: 0,
};

const TimeLabel = styled.text`
  text-anchor: middle;
`;

type RateCohortRecord = RateFields & { label: string };
function isRateCohortRecord(
  record: Record<string, unknown>
): record is RateCohortRecord {
  return typeof record.label === "string" && isRateFields(record);
}
function recordFromColumnHover(d: Record<string, unknown> | undefined) {
  // need to retrieve the original record from Semiotic internals
  let originalDataPoint: RateCohortRecord | undefined;
  // this is all just for type safety; in practice the data should always be there
  if (d && Array.isArray(d.summary)) {
    // no stacking, there should only be one piece
    const [pieceSummary] = d.summary;
    const { data } = pieceSummary;
    if (data && isRateCohortRecord(data)) originalDataPoint = data;
  }

  return originalDataPoint;
}

type RateCohortProps = {
  data: RateCohortRecord[];
  getBarLabel?: (label: string) => string;
};

export default function RateCohorts({
  data,
  getBarLabel,
}: RateCohortProps): React.ReactElement {
  const { highlighted, setHighlighted } = useHighlightedItem();

  // need a stable reference to the highlight function with some preprocessing
  const setHighlightedColumn = useCallback(
    (d: Record<string, unknown> | undefined) =>
      setHighlighted(recordFromColumnHover(d)),
    [setHighlighted]
  );

  return (
    <MeasureWidth>
      {({ measureRef, width }) => (
        <ChartWrapper ref={measureRef}>
          {width > 0 && (
            <ResponsiveTooltipController
              getTooltipProps={(d) => {
                const originalDataPoint = recordFromColumnHover(d);

                if (originalDataPoint === undefined) {
                  // something has gone terribly wrong; hopefully only encountered during development
                  throw new Error("Unable to retrieve data for tooltip");
                }

                return {
                  title: originalDataPoint.label,
                  records: [
                    {
                      value: `${originalDataPoint.rateNumerator} of ${originalDataPoint.rateDenominator}`,
                      pct: originalDataPoint.rate,
                    },
                  ],
                };
              }}
              hoverAnnotation
              setHighlighted={setHighlightedColumn}
            >
              <OrdinalFrame
                axes={[
                  {
                    baseline: false,
                    orient: "left",
                    tickFormat: formatAsPct,
                    ticks: 3,
                    tickSize: 0,
                  },
                ]}
                baseMarkProps={{
                  transitionDuration: {
                    fill: animation.defaultDuration,
                  },
                }}
                data={data}
                margin={MARGIN}
                oAccessor="label"
                // @ts-expect-error Semiotic doesn't like styled components here but it's fine
                oLabel={(labelText) => {
                  let labelToDisplay = "";

                  // in practice it should always be a string, because oAccessor returns a string, but ... types
                  if (typeof labelText === "string") {
                    labelToDisplay = getBarLabel
                      ? getBarLabel(labelText)
                      : labelText;
                  }

                  return <TimeLabel>{labelToDisplay}</TimeLabel>;
                }}
                oPadding={2}
                rAccessor="rate"
                rExtent={[0, 1]}
                renderKey="label"
                size={[width, CHART_HEIGHT]}
                style={(d: { data: RateCohortRecord }) => {
                  let fill = colors.dataViz[0];

                  if (highlighted && highlighted.label !== d.data.label) {
                    fill = highlightFade(fill);
                  }

                  return {
                    fill,
                  };
                }}
                type="bar"
              />
            </ResponsiveTooltipController>
          )}
        </ChartWrapper>
      )}
    </MeasureWidth>
  );
}
