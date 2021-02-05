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

import { scaleLinear } from "d3-scale";
import { rem, rgba } from "polished";
import React, { useState } from "react";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import { GenericObject } from "semiotic/lib/types/generalTypes";
import { EdgeType } from "semiotic/lib/types/networkTypes";
import styled from "styled-components/macro";
import { $Keys } from "utility-types";
import ResponsiveTooltipController from "../charts/ResponsiveTooltipController";
import { formatAsNumber } from "../utils";
import MeasureWidth from "../MeasureWidth";
import { animation, colors, typefaces } from "../UiLibrary";

const MARGIN = { top: 10, bottom: 10, left: 140 };
/**
 * Adjust right margin based on label length
 */
const getRightMargin = scaleLinear().domain([5, 15]).range([60, 140]);
const MIN_WIDTH = 600;
const NODE_WIDTH = 72;

const ChartWrapper = styled.figure`
  /*
    labels have a tendency to overflow the bottom of this container;
    this padding should ensure they have enough space to do so
  */
  padding-bottom: ${rem(80)};
  position: relative;
  width: 100%;
`;

const SOURCE_LABEL_X_OFFSET = `-${MARGIN.left + NODE_WIDTH / 2}`;

const SOURCE_VALUE_SIZE = 48;

const SourceValue = styled.text`
  fill: ${colors.text};
  font-family: ${typefaces.display};
  font-size: ${rem(SOURCE_VALUE_SIZE)};
  letter-spacing: -0.09em;
`;

const SOURCE_LABEL_SIZE = 16;

const SourceLabel = styled.text`
  fill: ${colors.text};
  font-size: ${rem(SOURCE_LABEL_SIZE)};
`;

const TARGET_LABEL_PADDING = 8;
const TargetLabel = styled.text`
  fill: ${colors.text};
  font-size: ${rem(16)};
  text-anchor: start;
`;

/**
 * This is a magic number based on the label's font size;
 * workaround for lack of dominant-baseline support in IE
 * to vertically center the text on origin
 */
const TARGET_LABEL_Y_OFFSET = 6;

// because IE does not support CSS transforms on SVG elements (#182),
// we need to render label translations as SVG attributes. These functions do that
const getSourceValueTransform = (yOffset: number) => `translate(
  ${SOURCE_LABEL_X_OFFSET},
  ${-(yOffset - SOURCE_VALUE_SIZE)}
)`;
const getSourceLabelTransform = (
  yOffset: number
) => `translate(${SOURCE_LABEL_X_OFFSET},
  ${-(yOffset - SOURCE_VALUE_SIZE - SOURCE_LABEL_SIZE - 8)}
)`;
// this one happens to not use a dynamic value at the moment but we'll leave it
// as a function for consistency
const getTargetLabelTransform = () =>
  `translate(${
    NODE_WIDTH / 2 + TARGET_LABEL_PADDING
  }, ${TARGET_LABEL_Y_OFFSET})`;

const baseColor = colors.dataViz[0];

const sourceColors = {
  Incarceration: rgba(baseColor, 0.9),
  Probation: rgba(baseColor, 0.7),
  Both: rgba(baseColor, 0.6),
};

const targetColor = rgba(baseColor, 0.5);

const hoverColor = rgba(baseColor, 0.2);

const Gradients = (
  <>
    <linearGradient id="incarcerationGradient">
      <stop offset="0" stopColor={sourceColors.Incarceration} stopOpacity="1" />
      <stop
        offset="15%"
        stopColor={sourceColors.Incarceration}
        stopOpacity="0.8"
      />
      <stop offset="90%" stopColor={targetColor} stopOpacity="1" />
    </linearGradient>
    <linearGradient id="probationGradient">
      <stop offset="0" stopColor={sourceColors.Probation} stopOpacity="1" />
      <stop offset="15%" stopColor={sourceColors.Probation} stopOpacity="0.8" />
      <stop offset="90%" stopColor={targetColor} stopOpacity="1" />
    </linearGradient>
    <linearGradient id="bothGradient">
      <stop offset="0" stopColor={sourceColors.Both} stopOpacity="1" />
      <stop offset="15%" stopColor={sourceColors.Both} stopOpacity="0.8" />
      <stop offset="90%" stopColor={targetColor} stopOpacity="1" />
    </linearGradient>
  </>
);

const linksToTooltipProps = (d: GenericObject) => {
  let links: { label: string; value: number; pct: number }[] = [];

  if ((d.sourceLinks || []).length > 0) {
    // the value key is picked up from the input data
    links = d.sourceLinks.map((link: EdgeType & { value: number }) => ({
      label: link.target?.id,
      value: link.value,
      pct: link.value / d.value,
    }));
  } else if ((d.targetLinks || []).length > 0) {
    // the value key is picked up from the input data
    links = d.targetLinks.map((link: EdgeType & { value: number }) => ({
      label: link.source?.id,
      value: link.value,
      pct: link.value / d.value,
    }));
  }

  return {
    title: d.id,
    records: links,
  };
};

/**
 * Creates a Sankey diagram that is specifically tailored to sentence type data,
 * with sentence type on the left flowing to demographic categories on the right.
 */
export default function SingleStepSankey({
  sources,
  targets,
  edges,
}: {
  sources: { id: string }[];
  targets: { id: string }[];
  edges: { source: string; target: string; value: number }[];
}): React.ReactElement {
  const [highlighted, setHighlighted] = useState<Record<string, unknown>>();

  const rightMargin = getRightMargin(
    Math.max(...targets.map(({ id }) => id.length))
  );

  const renderNodeLabel = (d: GenericObject) => {
    if (sources.find((source) => source.id === d.id)) {
      const yOffset = d.y - d.y0;
      return (
        <>
          <SourceValue transform={getSourceValueTransform(yOffset)}>
            {formatAsNumber(d.value)}
          </SourceValue>
          <SourceLabel transform={getSourceLabelTransform(yOffset)}>
            {d.id}
          </SourceLabel>
        </>
      );
    }
    if (targets.find((target) => target.id === d.id)) {
      return (
        <TargetLabel transform={getTargetLabelTransform()}>{d.id}</TargetLabel>
      );
    }
    return null;
  };

  const shouldFade = (d: GenericObject) => {
    return (
      highlighted &&
      ((d.id && highlighted.id !== d.id) ||
        // edges not connected to this node
        (d.source &&
          d.source.id !== highlighted.id &&
          d.target &&
          d.target.id !== highlighted.id))
    );
  };

  return (
    <MeasureWidth>
      {({ measureRef, width }) => (
        <ChartWrapper ref={measureRef}>
          {width > 0 && (
            <ResponsiveTooltipController
              getTooltipProps={linksToTooltipProps}
              hoverAnnotation
              setHighlighted={setHighlighted}
            >
              <NetworkFrame
                additionalDefs={Gradients}
                baseMarkProps={{
                  transitionDuration: {
                    fill: animation.defaultDuration,
                  },
                }}
                edges={edges}
                edgeStyle={(d) => {
                  return {
                    fill: shouldFade(d)
                      ? hoverColor
                      : `url(#${d.source.id.toLowerCase()}Gradient)`,
                  };
                }}
                margin={{ ...MARGIN, right: rightMargin }}
                networkType={{
                  nodePaddingRatio: 0.1,
                  nodeWidth: NODE_WIDTH,
                  orient: "justify",
                  projection: "horizontal",
                  type: "sankey",
                }}
                nodes={[...sources, ...targets]}
                nodeLabels={renderNodeLabel}
                nodeStyle={(d) => ({
                  fill: shouldFade(d)
                    ? hoverColor
                    : // these ids should be the same because they come from our input,
                      // and if not there is a fallback value
                      sourceColors[d.id as $Keys<typeof sourceColors>] ||
                      targetColor,
                })}
                size={[Math.max(width, MIN_WIDTH), 500]}
              />
            </ResponsiveTooltipController>
          )}
        </ChartWrapper>
      )}
    </MeasureWidth>
  );
}
