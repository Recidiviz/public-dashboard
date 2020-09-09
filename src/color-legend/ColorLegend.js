import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { highlightFade } from "../utils";

const ColorLegendWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
`;

const ColorLegendItem = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  margin-right: 8px;
  padding-bottom: 4px;
  position: relative;
  white-space: nowrap;

  &:last-child {
    margin-right: 0;
  }

  &::after {
    background: ${(props) => props.color};
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 50%;
    position: absolute;
    transition: ${(props) =>
      `width ${props.theme.transition.defaultTimeSettings}, left ${props.theme.transition.defaultTimeSettings}`};
    width: 0;
  }

  &.highlighted::after {
    width: 100%;
    left: 0;
  }
`;

const ColorLegendItemLabel = styled.div``;
const swatchSize = 8;
const ColorLegendItemSwatch = styled.div`
  background: ${(props) => props.color};
  border-radius: ${swatchSize / 2}px;
  height: ${swatchSize}px;
  margin-left: ${swatchSize / 2}px;
  transition: background-color
    ${(props) => props.theme.transition.defaultTimeSettings};
  width: ${swatchSize}px;
`;

export default function ColorLegend({ highlighted, items, setHighlighted }) {
  return (
    <ColorLegendWrapper aria-hidden>
      {items.map(({ label, color }) => (
        <ColorLegendItem
          className={classNames({
            highlighted: (highlighted || {}).label === label,
          })}
          color={color}
          key={label}
          onBlur={() => setHighlighted()}
          onFocus={() => setHighlighted({ label })}
          onMouseOut={() => setHighlighted()}
          onMouseOver={() => setHighlighted({ label })}
        >
          <ColorLegendItemLabel>{label}</ColorLegendItemLabel>
          <ColorLegendItemSwatch
            color={
              highlighted && highlighted.label !== label
                ? highlightFade(color)
                : color
            }
          />
        </ColorLegendItem>
      ))}
    </ColorLegendWrapper>
  );
}

ColorLegend.propTypes = {
  highlighted: PropTypes.shape({ label: PropTypes.string.isRequired }),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  setHighlighted: PropTypes.func.isRequired,
};

ColorLegend.defaultProps = {
  highlighted: undefined,
};
