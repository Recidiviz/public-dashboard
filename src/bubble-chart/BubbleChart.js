import PropTypes from "prop-types";
import { forceCenter, forceCollide, forceSimulation, forceX } from "d3-force";
import d3ForceLimit from "d3-force-limit";
import { scaleSqrt } from "d3-scale";
import React from "react";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import styled from "styled-components";
import useDataWithPct from "../hooks/useDataWithPct";
import formatAsPct from "../utils/formatAsPct";

const margin = { top: 0, left: 0, right: 0, bottom: 35 };

const BubbleChartWrapper = styled.div`
  .annotation-layer-svg {
    g {
      transition: all 1s ease-in-out;
    }
  }
`;

const BubbleNameLabel = styled.text`
  dominant-baseline: hanging;
  fill: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  text-anchor: middle;
`;

const BubbleValueLabel = styled.text`
  dominant-baseline: central;
  fill: ${(props) => props.theme.colors.bodyLight};
  font: ${(props) => props.theme.fonts.body};
  font-size: 20px;
  text-anchor: middle;
`;

export default function BubbleChart({ data: initialData, height, width }) {
  const data = useDataWithPct(initialData);

  const step = width / (data.length + 2);

  const rScale = scaleSqrt()
    .domain([0, 1])
    .range([0, Math.min(height, width) / 2]);

  const getRadius = (record) => rScale(record.pct);

  const combinedFociSimulation = forceSimulation()
    // left-to-right ordering
    .force(
      "x",
      forceX((d, i) => step * (i + 1))
    )
    // pull bubbles toward the bottom middle
    .force("center", forceCenter(width / 2, height))
    // don't let bubbles overflow the container
    .force(
      "limit",
      d3ForceLimit()
        .radius(getRadius)
        .x0(margin.left)
        .x1(width - margin.right)
        .y0(margin.top)
        .y1(height - margin.bottom)
    )
    // keep bubbles from overlapping
    .force("collide", forceCollide().radius(getRadius).strength(0.3));

  return (
    <BubbleChartWrapper>
      <NetworkFrame
        margin={margin}
        networkType={{
          type: "force",
          // this number is based on trial and error, no special knowledge
          iterations: 500,
          simulation: combinedFociSimulation,
          zoom: false,
        }}
        nodeIDAccessor="label"
        nodeLabels={(d) => (
          <>
            <BubbleValueLabel>{formatAsPct(d.pct)}</BubbleValueLabel>
            <BubbleNameLabel dy={getRadius(d) + 10}>{d.label}</BubbleNameLabel>
          </>
        )}
        nodeSizeAccessor={getRadius}
        nodeStyle={(d) => ({ fill: d.color })}
        nodes={data}
        renderKey="label"
        size={[width, height]}
      />
    </BubbleChartWrapper>
  );
}

BubbleChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
