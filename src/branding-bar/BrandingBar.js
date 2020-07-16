import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import React from "react";
import useCollapse from "react-collapsed";
import styled, { css } from "styled-components";

import MenuClosedIconSrc from "../assets/icons/menuClosed.svg";
import MenuOpenIconSrc from "../assets/icons/menuOpen.svg";
import LogoIconSrc from "../assets/icons/recidiviz_logo.svg";
import { FIXED_HEADER_HEIGHT, X_PADDING } from "../constants";
import NavBar from "../nav-bar";
import { LinkPill } from "../pill";

const brandingBarFlexProperties = css`
  align-items: baseline;
  display: flex;
`;

const brandingBarFixedStyles = `
  left: 0;
  min-height: ${FIXED_HEADER_HEIGHT}px;
  padding: 0 ${X_PADDING}px;
  position: fixed;
  right: 0;
  top: 0;
`;

const BrandingBarWrapper = styled.header`
  background: ${(props) => props.theme.colors.background};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  ${mediaQuery(["mobile-", brandingBarFixedStyles])}
`;

const BrandingBarHeader = styled.div`
  ${brandingBarFlexProperties}
`;

const Logo = styled.img`
  margin: 12px 0;
`;

const Icon = styled.img``;

const BrandingBarTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  display: inline;
  margin-left: 16px;
`;

const BrandingBarLinkListWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const BrandingBarLinkList = styled.ul`
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

const MenuButton = styled.button`
  background: none;
  border: none;
`;

const CollapsibleMenuWrapper = styled.div`
  background: ${(props) => props.theme.colors.background};
  height: calc(100vh - ${FIXED_HEADER_HEIGHT}px);
  width: 100%;
`;

const SITE_TITLE = "North Dakota Corrections";

export default function BrandingBar() {
  const useCollapsibleNav = useBreakpoint(false, ["mobile-", true]);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <BrandingBarWrapper>
      <BrandingBarHeader>
        <Logo alt="Recidiviz" src={LogoIconSrc} />
        {!useCollapsibleNav && (
          <BrandingBarTitle>{SITE_TITLE}</BrandingBarTitle>
        )}
      </BrandingBarHeader>
      {!useCollapsibleNav && (
        <BrandingBarLinkListWrapper>
          <BrandingBarLinkList>
            <BrandingBarLink>
              <LinkPill href="#">Share</LinkPill>
            </BrandingBarLink>
            <BrandingBarLink>
              <LinkPill href="#">Download Data</LinkPill>
            </BrandingBarLink>
          </BrandingBarLinkList>
        </BrandingBarLinkListWrapper>
      )}
      {useCollapsibleNav && (
        <>
          <MenuButton {...getToggleProps()}>
            {isExpanded ? (
              <Icon src={MenuOpenIconSrc} />
            ) : (
              <Icon src={MenuClosedIconSrc} />
            )}
          </MenuButton>
          <CollapsibleMenuWrapper {...getCollapseProps()}>
            <NavBar large />
          </CollapsibleMenuWrapper>
        </>
      )}
    </BrandingBarWrapper>
  );
}
