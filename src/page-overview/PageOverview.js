import React from "react";
import styled, { css } from "styled-components";

import { DETAIL_PAGES } from "../constants";
import { HeadingTitle, HeadingDescription } from "../heading";
import NavBar from "../nav-bar";
import { fluidFontSizeStyles } from "../utils";

const OverviewWrapper = styled.div``;
const HeadingWrapper = styled.header`
  margin-bottom: 64px;
`;

const MIN_FONT_SIZE = 32;
const MAX_FONT_SIZE = 64;

const navigationStyles = {
  li: css`
    border-top: 1px solid ${(props) => props.theme.colors.divider};
    font-size: ${MAX_FONT_SIZE}px;
    width: 100%;
    ${fluidFontSizeStyles(MIN_FONT_SIZE, MAX_FONT_SIZE)}
  `,
};

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
      <NavBar pages={DETAIL_PAGES} navigationStyles={navigationStyles} nested />
    </OverviewWrapper>
  );
}
