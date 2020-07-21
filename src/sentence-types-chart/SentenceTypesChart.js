import PropTypes from "prop-types";
import React from "react";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import styled from "styled-components";
import { THEME } from "../constants";
import { formatAsNumber } from "../utils";

const MARGIN = { top: 10, bottom: 10, left: 120, right: 110 };
const MIN_WIDTH = 600;
const NODE_WIDTH = 50;

const SankeyDiagramWrapper = styled.div`
  overflow: auto;
  position: relative;
  width: ${(props) => props.width}px;
`;

const sourceLabelXOffsetTransform = `translateX(-${
  MARGIN.left + NODE_WIDTH / 2
}px)`;

const SOURCE_VALUE_SIZE = 48;

const SourceValue = styled.text`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.displayNormal};
  font-size: ${SOURCE_VALUE_SIZE}px;
  letter-spacing: -0.1em;
  transform: ${sourceLabelXOffsetTransform}
    translateY(-${(props) => props.yOffset - SOURCE_VALUE_SIZE}px);
`;

const SOURCE_LABEL_SIZE = 16;

const SourceLabel = styled.text`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  font-size: ${SOURCE_LABEL_SIZE}px;
  transform: ${sourceLabelXOffsetTransform}
    translateY(
      -${(props) => props.yOffset - SOURCE_VALUE_SIZE - SOURCE_LABEL_SIZE}px
    );
`;

const TargetLabel = styled.text`
  color: ${(props) => props.theme.colors.body};
  dominant-baseline: middle;
  font: ${(props) => props.theme.fonts.body};
  text-anchor: start;
  transform: translateX(${NODE_WIDTH / 2 + 8}px);
`;

const GRADIENTS = [
  <linearGradient id="incarcerationGradient" key="incarcerationGradient">
    <stop
      offset="0"
      stopColor={THEME.colors.sentencing.incarceration}
      stopOpacity="1"
    />
    <stop
      offset="15%"
      stopColor={THEME.colors.sentencing.incarceration}
      stopOpacity="0.8"
    />
    <stop
      offset="90%"
      stopColor={THEME.colors.sentencing.target}
      stopOpacity="1"
    />
  </linearGradient>,
  <linearGradient id="probationGradient" key="probationGradient">
    <stop
      offset="0"
      stopColor={THEME.colors.sentencing.probation}
      stopOpacity="1"
    />
    <stop
      offset="15%"
      stopColor={THEME.colors.sentencing.probation}
      stopOpacity="0.8"
    />
    <stop
      offset="90%"
      stopColor={THEME.colors.sentencing.target}
      stopOpacity="1"
    />
  </linearGradient>,
];

export default function SentenceTypesChart({ data, width }) {
  // width may be undefined when chart is first mounted; wait for it
  if (!width) return null;
  // we are assuming these are mutually exclusive; no intermediate nodes
  const sources = new Set(data.map((edge) => edge.source));
  const targets = new Set(data.map((edge) => edge.target));

  const nodes = [
    ...[...sources].map((name) => ({
      id: name,
      color: THEME.colors.sentencing[name.toLowerCase()],
    })),
    ...[...targets].map((name) => ({
      id: name,
      color: THEME.colors.sentencing.target,
    })),
  ];

  const renderNodeLabel = (d) => {
    if (sources.has(d.id)) {
      const yOffset = d.y - d.y0;
      return (
        <>
          <SourceValue yOffset={yOffset}>{formatAsNumber(d.value)}</SourceValue>
          <SourceLabel yOffset={yOffset}>{d.id}</SourceLabel>
        </>
      );
    }
    if (targets.has(d.id)) {
      return <TargetLabel>{d.id}</TargetLabel>;
    }
    return null;
  };

  return (
    <SankeyDiagramWrapper width={width}>
      <NetworkFrame
        additionalDefs={GRADIENTS}
        edges={data}
        edgeStyle={(d) => ({
          fill: `url(#${d.source.id.toLowerCase()}Gradient)`,
        })}
        margin={MARGIN}
        networkType={{
          nodePaddingRatio: 0.1,
          nodeWidth: NODE_WIDTH,
          orient: "justify",
          projection: "horizontal",
          type: "sankey",
        }}
        nodes={nodes}
        nodeLabels={renderNodeLabel}
        nodeStyle={(d) => ({ fill: d.color })}
        size={[Math.max(width, MIN_WIDTH), 500]}
      />
    </SankeyDiagramWrapper>
  );
}

SentenceTypesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  width: PropTypes.number,
};

SentenceTypesChart.defaultProps = {
  width: undefined,
};
