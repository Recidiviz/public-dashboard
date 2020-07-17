import React from "react";
import styled, { css } from "styled-components";
import { mediaQuery } from "@w11r/use-breakpoint";

import NavBar from "../nav-bar";
import { DETAIL_PAGES } from "../constants";

const SecondaryNavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 440px;
  text-align: center;
`;

const SecondaryNavHeading = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 32px;
`;

const navigationStyles = {
  ul: css`
    display: flex;
    ${mediaQuery(["mobile-", "display: inline-block;"])}
    font-size: 20px;
    justify-content: space-between;
  `,
  li: css`
    &--active {
      border-bottom: 2px solid ${(props) => props.theme.colors.highlight};
      &::after {
        content: none;
      }
    }
  `,
};

export default function SecondaryNav() {
  return (
    <SecondaryNavWrapper>
      <SecondaryNavHeading>
        Explore more of the corrections system and our efforts.
      </SecondaryNavHeading>
      <NavBar pages={DETAIL_PAGES} navigationStyles={navigationStyles} />
    </SecondaryNavWrapper>
  );
}
