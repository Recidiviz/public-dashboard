import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ColorLegendWrapper = styled.div`
  color: ${(props) => props.theme.colors.body};
  display: flex;
  flex-wrap: wrap;
  font: ${(props) => props.theme.fonts.body};
`;
const ColorLegendItem = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  margin-left: 8px;
  white-space: nowrap;
`;
const ColorLegendItemLabel = styled.div``;
const swatchSize = 6;
const ColorLegendItemSwatch = styled.div`
  background: ${(props) => props.color};
  border-radius: ${swatchSize / 2}px;
  height: ${swatchSize}px;
  margin-left: ${swatchSize / 2}px;
  width: ${swatchSize}px;
`;

export default function ColorLegend({ items }) {
  return (
    <ColorLegendWrapper aria-hidden>
      {items.map(({ label, color }) => (
        <ColorLegendItem key={label}>
          <ColorLegendItemLabel>{label}</ColorLegendItemLabel>
          <ColorLegendItemSwatch color={color} />
        </ColorLegendItem>
      ))}
    </ColorLegendWrapper>
  );
}

ColorLegend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};
