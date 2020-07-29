import classNames from "classnames";
import useBreakpoint from "@w11r/use-breakpoint";
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

const ICON_SIZE = "26px";

const Y_MARGIN = "12px";

const BrandingBarWrapper = styled.header`
  align-items: flex-start;
  background: "transparent";
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  z-index: ${(props) => props.theme.zIndex.header};

  &.fixed {
    background: ${(props) => props.theme.colors.background};
    left: 0;
    height: ${(props) =>
      props.expanded ? "auto" : `${FIXED_HEADER_HEIGHT}px`};
    padding: 0 ${X_PADDING}px;
    position: fixed;
    right: 0;
    top: 0;
  }
`;

const BrandingBarHeader = styled.div`
  ${brandingBarFlexProperties}

  ${(props) => (props.collapsible ? "align-items: center;" : "")}
  margin-top: ${(props) => (props.expanded ? `${FIXED_HEADER_HEIGHT}px` : 0)};
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};
`;

const Icon = styled.img`
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
`;

const Logo = styled(Icon)`
  margin: ${Y_MARGIN} 0;
`;

const BrandingBarTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: ${(props) =>
    props.small
      ? props.theme.fonts.brandSizeSmall
      : props.theme.fonts.brandSizeLarge};
  display: inline-block;
  margin-left: 16px;
  opacity: ${(props) => (props.hide ? 0 : 1)};
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};
`;

const BrandingBarLinkListWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-top: ${(props) => (props.collapsible ? "16px" : Y_MARGIN)};
  order: ${(props) => (props.collapsible ? 2 : 0)};
  width: ${(props) => (props.collapsible ? "100%" : "auto")};
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
  margin: ${Y_MARGIN} 0;
`;

const CollapsibleMenuWrapper = styled.div`
  background: ${(props) => props.theme.colors.background};
  height: calc(100vh - ${FIXED_HEADER_HEIGHT}px);
  order: 3;
  width: 100%;
`;

const NavBarWrapper = styled.div`
  margin-top: 32px;
`;

const SITE_TITLE = "North Dakota Corrections";

export default function BrandingBar() {
  const useCollapsibleNav = useBreakpoint(false, ["mobile-", true]);
  const {
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded,
  } = useCollapse();

  return (
    <BrandingBarWrapper
      className={classNames({ fixed: useCollapsibleNav })}
      expanded={useCollapsibleNav && isExpanded}
    >
      <BrandingBarHeader
        collapsible={useCollapsibleNav}
        expanded={useCollapsibleNav && isExpanded}
      >
        <Logo alt="Recidiviz" src={LogoIconSrc} />
        <BrandingBarTitle
          hide={useCollapsibleNav && !isExpanded}
          small={useCollapsibleNav}
        >
          {SITE_TITLE}
        </BrandingBarTitle>
      </BrandingBarHeader>
      {(!useCollapsibleNav || isExpanded) && (
        <BrandingBarLinkListWrapper collapsible={useCollapsibleNav}>
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
            <NavBarWrapper>
              <NavBar
                onClick={() => setExpanded(false)}
                className="branding-bar"
              />
            </NavBarWrapper>
          </CollapsibleMenuWrapper>
        </>
      )}
    </BrandingBarWrapper>
  );
}
