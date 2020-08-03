import React from "react";
import styled from "styled-components";

import { DETAIL_PAGES } from "../constants";
import { HeadingTitle, HeadingDescription } from "../heading";
import NavBar from "../nav-bar";

const OverviewWrapper = styled.div``;
const HeadingWrapper = styled.header`
  margin-bottom: 64px;
`;

export default function PageOverview() {
  return (
    <OverviewWrapper>
      <HeadingWrapper>
        <HeadingTitle>
          Insights and initiatives in North Dakota’s corrections system
        </HeadingTitle>
        <HeadingDescription>
          The North Dakota Department of Corrections and Rehabilitation (DOCR)
          provides correctional services for the state of North Dakota. Our
          mission is to transform lives, influence change, strengthen community.
          Transparency is a critical element of our mission. Sharing information
          builds greater accountability between the DOCR and the communities we
          serve. To this end, this collection of data visualizations is built to
          answer important questions that the public may have about the state of
          our correctional system in North Dakota. The data represented here is
          updated every day.
        </HeadingDescription>
        <HeadingDescription>
          Click on a stage of the criminal justice system to explore the data:
        </HeadingDescription>
      </HeadingWrapper>
      <NavBar pages={DETAIL_PAGES} className="overview" nested />
    </OverviewWrapper>
  );
}
