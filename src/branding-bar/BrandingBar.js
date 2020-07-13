import React from "react";
import styled, { css } from "styled-components";

import LogoIconSrc from "../assets/icons/recidiviz_logo.svg";
import { LinkPill } from "../pill";

const brandingBarFlexProperties = css`
  align-items: baseline;
  display: flex;
`;

const BrandingBarContainer = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 80px;
`;

const BrandingBarHeader = styled.div`
  ${brandingBarFlexProperties}
`;

const Logo = styled.img``;

const BrandingBarTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  display: inline;
  margin-left: 16px;
`;

const BrandingBarLinkContainer = styled.div`
  align-items: center;
  display: flex;
`;

const BrandingBarLinksList = styled.ul`
  ${brandingBarFlexProperties}
  justify-content: space-between;
  margin: 0;
  padding: 0;
`;

const BrandingBarLink = styled.li`
  list-style-type: none;
  margin-right: 16px;

  &:last-child {
    margin-right: 0;
  }
`;

export default function BrandingBar() {
  return (
    <BrandingBarContainer>
      <BrandingBarHeader>
        <Logo alt="Recidiviz" src={LogoIconSrc} />
        <BrandingBarTitle>North Dakota Corrections</BrandingBarTitle>
      </BrandingBarHeader>
      <BrandingBarLinkContainer>
        <BrandingBarLinksList>
          <BrandingBarLink>
            <LinkPill href="#">Share</LinkPill>
          </BrandingBarLink>
          <BrandingBarLink>
            <LinkPill href="#">Download Data</LinkPill>
          </BrandingBarLink>
        </BrandingBarLinksList>
      </BrandingBarLinkContainer>
    </BrandingBarContainer>
  );
}
