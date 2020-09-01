import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";
import { HeadingTitle, HeadingDescription } from "../heading";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 768px;
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
          Click <Link to="/">here</Link> to return to the homepage of the
          dashboard, or visit the North Dakota Department of Corrections at{" "}
          <a href="https://docr.nd.gov">docr.nd.gov</a>.
        </p>
      </HeadingDescription>
    </Wrapper>
  );
}
