import React from "react";
import styled from "styled-components";
import { HeadingTitle, HeadingDescription } from "../heading";

const Wrapper = styled.div`
  padding: 88px 0;
  text-align: center;
`;

export default function PageNotFound() {
  return (
    <Wrapper>
      <HeadingTitle>Error 404: Page not found.</HeadingTitle>
      <HeadingDescription>
        <p>The page that you are looking for is missing.</p>
        <p>
          Go to <a href="https://docr.nd.gov">docr.nd.gov</a>
        </p>
      </HeadingDescription>
    </Wrapper>
  );
}
