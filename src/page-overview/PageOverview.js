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
          Introduction lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Id neque, neque cursus ornare. Sed phasellus sociis justo aenean
          egestas. Sollicitudin erat enim, maecenas pharetra suspendisse. Orci
          malesuada enim suspendisse mattis bibendum amet et et. Pellentesque
          quis justo, in diam fermentum.
        </HeadingDescription>
      </HeadingWrapper>
      <NavBar pages={DETAIL_PAGES} className="overview" nested />
    </OverviewWrapper>
  );
}
