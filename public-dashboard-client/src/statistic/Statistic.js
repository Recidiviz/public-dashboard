import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { fluidFontSizeStyles } from "../utils";

const StatisticsWrapper = styled.figure`
  margin: 0;
`;

const MAX_VALUE_SIZE = "88";
const MIN_VALUE_SIZE = "20";

const ValueWrapper = styled.h1`
  color: ${(props) => props.theme.colors.statistic};
  font: ${(props) => props.theme.fonts.displayMedium};
  font-size: ${MAX_VALUE_SIZE}px;
  line-height: 100%;
  letter-spacing: -0.09em;
  margin: 0;

  ${(props) =>
    props.fluidSize ? fluidFontSizeStyles(MIN_VALUE_SIZE, MAX_VALUE_SIZE) : ""}
`;

const LabelWrapper = styled.figcaption``;

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
  value: PropTypes.string,
};

Statistic.defaultProps = {
  fluidSize: false,
  label: undefined,
  value: "No data",
};
