import { rem } from "polished";
import React from "react";
import styled, { keyframes } from "styled-components/macro";

import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";
import { animation, colors } from "../UiLibrary";

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
  flex-direction: column;
  justify-content: center;
  height: ${rem(360)};
  width: 100%;
`;

const LoadingSpinnerIcon = styled(SpinnerIcon)`
  animation: ${rotate} ${animation.defaultDuration}ms linear infinite;
`;

const LoadingSpinnerText = styled.div`
  color: ${colors.caption};
  font-size: ${rem(14)};
  line-height: 1.5;
`;

export default function Loading(): JSX.Element {
  return (
    <LoadingWrapper role="status">
      <LoadingSpinnerIcon />
      <LoadingSpinnerText>Data is loading</LoadingSpinnerText>
    </LoadingWrapper>
  );
}
