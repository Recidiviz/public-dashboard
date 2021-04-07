import PropTypes from "prop-types";
import { cumsum } from "d3-array";
import { forceCollide, forceSimulation, forceX, forceY } from "d3-force";
import forceLimit from "d3-force-limit";
import { scaleSqrt } from "d3-scale";
import React, { useState } from "react";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import styled from "styled-components/macro";
import ColorLegend from "../color-legend";
import ResponsiveTooltipController from "../responsive-tooltip-controller";
import { THEME } from "../theme";
import { formatAsPct, getDataWithPct, highlightFade } from "../utils";

const margin = { top: 0, left: 0, right: 0, bottom: 40 };

const BubbleChartWrapper = styled.div`
  position: relative;
  .visualization-layer {
    /*
      circles that are very close to the edge might
      overlap by a couple of pixels, that's fine. don't clip them
    */
    overflow: visible;
  }
`;

const BubbleValueLabel = styled.text`
  fill: ${(props) => props.theme.colors.bodyLight};
  font: ${(props) => props.theme.fonts.displayMedium};
  letter-spacing: -0.09em;
  font-size: 20px;
  text-anchor: middle;
`;
// this is a magic number based on the font size of BubbleValueLabel;
// it is a workaround for the lack of IE support for the dominant-baseline attribute
// to vertically center this text relative to its origin
const BUBBLE_VALUE_Y_OFFSET = 8;

const LegendWrapper = styled.div`
  bottom: 0;
  position: absolute;
`;

export default function BubbleChart({ data: initialData, height, width }) {
  const data = getDataWithPct(initialData);

  const vizWidth = width - margin.left - margin.right;
  const vizHeight = height - margin.top - margin.bottom;

  const maxRadius = Math.min(
    // this would have a 100% bubble taking up the full height
    vizHeight / 2,
    // this would have a 100% bubble taking up a little less
    // than full width, which gives us more flexibility for
    // arbitrarily packing bubbles on small screens
    vizWidth / 2.2
  );
  const rScale = scaleSqrt().domain([0, 1]).range([0, maxRadius]);
  const getRadius = (record) => rScale(record.pct);

  // this is the most width bubbles would take up when aligned horizontally
  // (the diameters of four equally sized circles)
  const minWidthForHorizontalLayout = rScale(0.25) * 8;
  const useHorizontalLayout = width >= minWidthForHorizontalLayout;

  // we will use this force object to position the circles
  const simulation = forceSimulation();

  if (useHorizontalLayout) {
    // Pack all circles against the bottom edge and center them. To do this,
    // we're going to have to do some geometry and fix their positions.
    let centerXCoordinates = [];
    data.forEach((record, i) => {
      if (i === 0) {
        centerXCoordinates.push(getRadius(record));
        return;
      }
      // skip over any zero-value records to calculate placement
      // relative to nearest visible bubble; OK if there are no non-zero records
      const prev =
        data
          .filter((...[, index]) => index < i)
          .reverse()
          .find(({ value }) => value > 0) || data[i - 1];
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
    centerXCoordinates = centerXCoordinates.map(
      (val) => val + leftoverSpace / 2
    );

    // all we need to do here is force the bubbles towards the x/y positions
    // that we have already calculated
    simulation
      .force("x", forceX((d, i) => centerXCoordinates[i]).strength(1))
      .force("y", forceY((d) => vizHeight - getRadius(d)).strength(1))
      // overlaps are still possible, e.g. when a small bubble is
      // between two large ones. this should prevent that
      .force("collide", forceCollide().radius(getRadius));
  } else {
    simulation
      // this force keeps them from overflowing the container
      .force(
        "limit",
        forceLimit()
          .radius(getRadius)
          .x0(margin.left)
          .x1(width - margin.right)
          .y0(margin.top)
          .y1(height - margin.bottom)
      )
      // this force prevents them from overlapping
      .force("collide", forceCollide().radius(getRadius).strength(1));
  }

  const [highlighted, setHighlighted] = useState();

  return (
    <BubbleChartWrapper>
      <ResponsiveTooltipController
        hoverAnnotation
        setHighlighted={setHighlighted}
      >
        <NetworkFrame
          baseMarkProps={{
            transitionDuration: { fill: THEME.transition.defaultDurationMs },
          }}
          margin={margin}
          networkType={{
            type: "force",
            // this number is based on trial and error, no special knowledge
            iterations: 300,
            simulation,
            zoom: false,
          }}
          nodeIDAccessor="label"
          nodeLabels={(d) =>
            // slightly hacky solution here to a couple of issues:
            // 1) if the value is zero there will be no bubble, so no label
            // 2) if the bubble is really small (less than ~1%) the label won't fit
            d.pct >= 0.01 && (
              <BubbleValueLabel dy={BUBBLE_VALUE_Y_OFFSET}>
                {formatAsPct(d.pct)}
              </BubbleValueLabel>
            )
          }
          nodeSizeAccessor={getRadius}
          nodeStyle={(d) => ({
            fill:
              highlighted && highlighted.label !== d.label
                ? highlightFade(d.color)
                : d.color,
          })}
          nodes={data}
          renderKey="label"
          size={[width, height]}
        />
      </ResponsiveTooltipController>
      <LegendWrapper>
        <ColorLegend
          highlighted={highlighted}
          items={initialData}
          setHighlighted={setHighlighted}
        />
      </LegendWrapper>
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
