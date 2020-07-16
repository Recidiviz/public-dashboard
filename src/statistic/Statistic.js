import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CUSTOM_BREAKPOINTS } from "../constants";

const StatisticsWrapper = styled.figure`
  margin: 0;
`;

const MAX_VALUE_SIZE = "88";
const MIN_VALUE_SIZE = "24";
const [mobileMin] = CUSTOM_BREAKPOINTS.mobile;
const [desktopMin] = CUSTOM_BREAKPOINTS.desktop;

const fluidFontSizeStyles = css`
  /*
    Fluid typography technique to scale text size by viewport from min to max
    https://css-tricks.com/simplified-fluid-typography/
  */
  font-size: ${MIN_VALUE_SIZE}px;

  @media screen and (min-width: ${mobileMin}px) {
    font-size: calc(
      ${MIN_VALUE_SIZE}px + ${MAX_VALUE_SIZE - MIN_VALUE_SIZE} *
        ((100vw - ${mobileMin}px) / ${desktopMin - mobileMin})
    );
  }

  @media screen and (min-width: ${desktopMin}px) {
    font-size: ${MAX_VALUE_SIZE}px;
  }
`;

const ValueWrapper = styled.h1`
  color: ${(props) => props.theme.colors.statistic};
  font: ${(props) => props.theme.fonts.displayNormal};
  font-size: ${MAX_VALUE_SIZE}px;
  line-height: 100%;
  letter-spacing: -0.05em;
  margin: 0;

  ${(props) => (props.fluidSize ? fluidFontSizeStyles : "")}
`;

const LabelWrapper = styled.figcaption`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

export default function Statistic({ value, label, fluidSize }) {
  return (
    <StatisticsWrapper>
      <ValueWrapper fluidSize={fluidSize}>{value}</ValueWrapper>
      {label && <LabelWrapper>{label}</LabelWrapper>}
    </StatisticsWrapper>
  );
}

Statistic.propTypes = {
  fluidSize: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
};

Statistic.defaultProps = {
  fluidSize: false,
  label: undefined,
};
