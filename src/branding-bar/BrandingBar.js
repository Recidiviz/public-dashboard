import classNames from "classnames";
import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import React from "react";
import useCollapse from "react-collapsed";
import styled, { css } from "styled-components";
import MenuClosedIconSrc from "../assets/icons/menuClosed.svg";
import MenuOpenIconSrc from "../assets/icons/menuOpen.svg";
import ExternalLinkSrc from "../assets/icons/externalLink.svg";
import LogoIconSrc from "../assets/icons/recidiviz_logo.svg";
import {
  COLLAPSIBLE_NAV_BREAKPOINT,
  CONTAINER_WIDTH,
  THEME,
  X_PADDING,
} from "../constants";
import NavBar from "../nav-bar";
import { LinkPill } from "../pill";
import MethodologyModal from "../methodology-modal";

const brandingBarFlexProperties = css`
  align-items: baseline;
  display: flex;
`;

const ICON_SIZE = "26px";

const Y_MARGIN = "12px";

const BrandingBarWrapper = styled.header`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: ${(props) => props.theme.headerHeight}px;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${CONTAINER_WIDTH}px;
  padding: 0 ${X_PADDING}px;
  width: 100%;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      height: ${THEME.headerHeightSmall}px;

      &.expanded {
        height: auto;
      }
    `,
  ])}
`;

const BrandingBarHeader = styled.div`
  ${brandingBarFlexProperties}
  margin-top: 0;
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      align-items: center;

      ${BrandingBarWrapper}.expanded & {
        margin-top: ${THEME.headerHeightSmall}px;
      }
    `,
  ])}
`;

const Icon = styled.img`
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
`;

const ExternalLinkIcon = styled.img`
  height: 12px;
  margin-left: 8px;
  width: 12px;
`;

const Logo = styled(Icon)`
  margin: ${Y_MARGIN} 0;
`;

const BrandingBarTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: ${(props) => props.theme.fonts.brandSizeLarge};
  display: inline-block;
  margin-left: 16px;
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      font-size: ${THEME.fonts.brandSizeSmall};
      opacity: 0;

      ${BrandingBarWrapper}.expanded & {
        opacity: 1;
      }
    `,
  ])}
`;

const BrandingBarLinkListWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-top: ${Y_MARGIN};
  order: 0;
  width: auto;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      margin-top: 16px;
      order: 2;
      width: 100%;
    `,
  ])}
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
  position: fixed;
  top: ${Y_MARGIN};
  right: 0;
`;

const CollapsibleMenuWrapper = styled.div`
  background: ${(props) => props.theme.colors.background};
  height: calc(100vh - ${(props) => props.theme.headerHeightSmall}px);
  order: 3;
  width: 100%;
`;

const NavBarWrapper = styled.div`
  margin-top: 32px;
`;

const SITE_TITLE = "North Dakota Corrections";

export default function BrandingBar() {
  const useCollapsibleNav = useBreakpoint(false, [
    COLLAPSIBLE_NAV_BREAKPOINT,
    true,
  ]);
  const {
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded,
  } = useCollapse();

  return (
    <BrandingBarWrapper
      className={classNames({
        expanded: isExpanded,
      })}
    >
      <BrandingBarHeader>
        <Logo alt="Recidiviz" src={LogoIconSrc} />
        <BrandingBarTitle>{SITE_TITLE}</BrandingBarTitle>
      </BrandingBarHeader>
      {(!useCollapsibleNav || isExpanded) && (
        <BrandingBarLinkListWrapper>
          <BrandingBarLinkList>
            <BrandingBarLink>
              <LinkPill
                href="https://docs.google.com/forms/d/e/1FAIpQLSc3_wV2ltGumMdGTcLehUM41tQri0ZW5RjIKh0JJlhpJGE9Hg/viewform"
                target="_blank"
              >
                Questions or Feedback
                <ExternalLinkIcon src={ExternalLinkSrc} />
              </LinkPill>
            </BrandingBarLink>
            <BrandingBarLink>
              <MethodologyModal
                trigger={<LinkPill href="#">Methodology</LinkPill>}
              />
            </BrandingBarLink>
          </BrandingBarLinkList>
        </BrandingBarLinkListWrapper>
      )}
      {useCollapsibleNav && (
        <>
          <MenuButton {...getToggleProps()}>
            <Icon src={isExpanded ? MenuOpenIconSrc : MenuClosedIconSrc} />
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
