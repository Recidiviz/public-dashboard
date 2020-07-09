import { forceCenter, forceCollide, forceSimulation, forceX } from "d3-force";
import d3ForceLimit from "d3-force-limit";
import { scaleSqrt } from "d3-scale";
import React from "react";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import styled from "styled-components";

const HEIGHT = 450;
const WIDTH = 994;

const step = WIDTH / 6;

const margin = { top: 0, left: 0, right: 0, bottom: 35 };

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

export default function BubbleChart() {
  const data = [
    { label: "Absconsion", value: 14, color: "#327672" },
    { label: "Technical Revocation", value: 37, color: "#005450" },
    { label: "Unknown Type", value: 9, color: "#97b9b7" },
    { label: "New Offense", value: 40, color: "#659795" },
  ];

  const height = HEIGHT;
  const width = WIDTH;

  const rScale = scaleSqrt()
    .domain([0, 100])
    .range([0, Math.min(height, width) / 2]);

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
        .radius((d) => rScale(d.value))
        .x0(margin.left)
        .x1(width - margin.right)
        .y0(margin.top)
        .y1(height - margin.bottom)
    )
    // keep bubbles from overlapping
    .force(
      "collide",
      forceCollide()
        .radius((d) => rScale(d.value))
        .strength(0.1)
    );

  return (
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
          <BubbleValueLabel>{d.value}</BubbleValueLabel>
          <BubbleNameLabel dy={rScale(d.value) + 10}>{d.label}</BubbleNameLabel>
        </>
      )}
      nodeSizeAccessor={(d) => rScale(d.value)}
      nodeStyle={(d) => ({ fill: d.color })}
      nodes={data}
      renderKey="label"
      responsiveHeight
      responsiveWidth
      size={[width, height]}
    />
  );
}
