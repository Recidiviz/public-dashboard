import { mediaQuery } from "@w11r/use-breakpoint";
import React from "react";
import styled from "styled-components/macro";

import NavBar from "../nav-bar";
import { DETAIL_PAGES } from "../constants";
import { THEME } from "../theme";

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

  ${mediaQuery(["mobile-", THEME.fonts.headingTitleStylesSmall])}
`;

export default function SecondaryNav() {
  return (
    <SecondaryNavWrapper>
      <SecondaryNavHeading>
        Explore more of the corrections system and our efforts.
      </SecondaryNavHeading>
      <NavBar pages={DETAIL_PAGES} className="secondary" />
    </SecondaryNavWrapper>
  );
}
