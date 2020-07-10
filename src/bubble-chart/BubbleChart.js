import PropTypes from "prop-types";
import { cumsum } from "d3-array";
import { forceSimulation, forceX, forceY } from "d3-force";
import { scaleSqrt } from "d3-scale";
import React from "react";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import styled from "styled-components";
import { formatAsPct, getDataWithPct } from "../utils";

const margin = { top: 0, left: 0, right: 0, bottom: 35 };

const BubbleChartWrapper = styled.div``;

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
  const data = getDataWithPct(initialData);

  const vizWidth = width - margin.left - margin.right;
  const vizHeight = height - margin.top - margin.bottom;

  const rScale = scaleSqrt()
    .domain([0, 1])
    .range([0, Math.min(vizHeight, vizWidth) / 2]);

  const getRadius = (record) => rScale(record.pct);

  // To pack all the circles against the bottom edge and center them,
  // we're going to have to do some geometry and fix their positions.
  let centerXCoordinates = [];
  data.forEach((record, i) => {
    if (i === 0) {
      centerXCoordinates.push(getRadius(record));
      return;
    }
    const prev = data[i - 1];
    const r1 = getRadius(prev);
    const r2 = getRadius(record);
    // This obscure next line is algebra with the Pythagorean Theorem;
    // because the bottom edge of each circle is aligned with the bottom,
    // and the hypotenuse is a line connecting the centers, we know that
    // c is the sum of the radii and b is the difference between them.
    // Then we just solve for a
    const newLeftOffset = Math.sqrt(
      (r1 + r2) ** 2 - Math.max(r2 - r1, r1 - r2) ** 2
    );
    centerXCoordinates.push(newLeftOffset);
  });
  // convert the offsets from piecewise differences to absolute X values
  centerXCoordinates = cumsum(centerXCoordinates);
  // distribute any leftover space evenly between left and right
  const groupWidth =
    centerXCoordinates[centerXCoordinates.length - 1] +
    getRadius(data[data.length - 1]);
  const leftoverSpace = vizWidth - groupWidth;
  centerXCoordinates = centerXCoordinates.map((val) => val + leftoverSpace / 2);

  const combinedFociSimulation = forceSimulation()
    // all we need to do here is force the bubbles towards the x/y positions
    // that we have already calculated
    .force("x", forceX((d, i) => centerXCoordinates[i]).strength(1))
    .force("y", forceY((d) => vizHeight - getRadius(d)).strength(1));

  return (
    <BubbleChartWrapper>
      <NetworkFrame
        margin={margin}
        networkType={{
          type: "force",
          // this number is based on trial and error, no special knowledge
          iterations: 100,
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
