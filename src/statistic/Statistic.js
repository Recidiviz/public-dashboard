import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StatisticsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ValueWrapper = styled.figure`
  color: ${(props) => props.theme.colors.statistic};
  font: ${(props) => props.theme.fonts.displayNormal};
  font-size: 88px;
  line-height: 40%;
  letter-spacing: -0.05em;
  margin-block-start: 0;
  margin-block-end: 0;
`;

const LabelWrapper = styled.figure`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  margin-top: 24px;
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
