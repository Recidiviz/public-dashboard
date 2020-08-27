import React from "react";
import styled from "styled-components";
import { HeadingTitle, HeadingDescription } from "../heading";

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 88px 0;
`;

export default function PageNotFound() {
  return (
    <Wrapper>
      <div>
        <HeadingTitle>Error 404: Page not found.</HeadingTitle>
        <HeadingDescription>
          <p>The page that you are looking for is missing.</p>
          <p>
            Go to <a href="https://docr.nd.gov">docr.nd.gov</a>
          </p>
        </HeadingDescription>
      </div>
    </Wrapper>
  );
}
