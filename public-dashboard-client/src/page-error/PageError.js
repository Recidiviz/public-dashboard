import React from "react";
import styled from "styled-components/macro";
import { HeadingTitle, HeadingDescription } from "../heading";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 720px;
  padding: 88px 0;
  text-align: center;
`;

export default function PageError() {
  return (
    <Wrapper>
      <div>
        <HeadingTitle>We’ll be back soon</HeadingTitle>
        <HeadingDescription>
          This data for this page could not be loaded at the moment. We will be
          back up as soon as possible. Thank you for your patience.
        </HeadingDescription>
      </div>
    </Wrapper>
  );
}
