import React from "react";
import styled, { keyframes } from "styled-components";

import { HeadingTitle } from "../heading";
import { ReactComponent as SpinnerIcon } from "../assets/icons/spinner.svg";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 360px;
  width: 100%;
`;

const LoadingSpinnerIcon = styled(SpinnerIcon)`
  animation: ${rotate} 0.5s linear infinite;

  g,
  circle {
    stroke: ${(props) => props.theme.colors.loadingSpinner} !important;
  }
`;

const LoadingSpinnerText = styled(HeadingTitle)`
  margin: 0 0 0 8px;
`;

const ICON_SIZE = 32;

export default function Loading() {
  return (
    <LoadingWrapper>
      <LoadingSpinnerIcon alt="Loading" height={ICON_SIZE} width={ICON_SIZE} />
      <LoadingSpinnerText>Loading data...</LoadingSpinnerText>
    </LoadingWrapper>
  );
}
