import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StatisticsWrapper = styled.figure`
  margin: 0;
`;

const ValueWrapper = styled.h1`
  color: ${(props) => props.theme.colors.statistic};
  font: ${(props) => props.theme.fonts.displayNormal};
  font-size: 88px;
  line-height: 100%;
  letter-spacing: -0.05em;
  margin: 0;
`;

const LabelWrapper = styled.figcaption`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

export default function Statistic({ value, label }) {
  return (
    <StatisticsWrapper>
      <ValueWrapper>{value}</ValueWrapper>
      {label && <LabelWrapper>{label}</LabelWrapper>}
    </StatisticsWrapper>
  );
}

Statistic.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Statistic.defaultProps = {
  label: undefined,
};
