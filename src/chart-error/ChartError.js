import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  align-items: center;
  background: ${(props) => props.theme.colors.chartErrorBackground};
  display: flex;
  height: 494px;
  justify-content: center;
  text-align: center;
`;

const ErrorText = styled.div`
  opacity: 0.8;
`;

export default function ChartError() {
  return (
    <Wrapper>
      <ErrorText>
        The data for this graph could not be loaded. Please check again later.
      </ErrorText>
    </Wrapper>
  );
}
