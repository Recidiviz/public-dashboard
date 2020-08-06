import { Link } from "@reach/router";
import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import classNames from "classnames";
import React from "react";
import useCollapse from "react-collapsed";
import styled, { css } from "styled-components";
import MenuClosedIconSrc from "../assets/icons/menuClosed.svg";
import MenuOpenIconSrc from "../assets/icons/menuOpen.svg";
import ExternalLinkSrc from "../assets/icons/externalLink.svg";
import LogoIconSrc from "../assets/icons/recidiviz_logo.svg";
import Cobranding from "../cobranding";
import { COLLAPSIBLE_NAV_BREAKPOINT, DEFAULT_TENANT } from "../constants";
import NavBar from "../nav-bar";
import { LinkPill } from "../pill";
import MethodologyModal from "../methodology-modal";
import PageWidthContainer from "../page-width-container";
import { THEME } from "../theme";

const brandingBarFlexProperties = css`
  align-items: center;
  display: flex;
`;

const ExternalLinkIcon = styled.img`
  height: 12px;
  margin-left: 8px;
  width: 12px;
`;

const FEEDBACK_TEXT = (
  <>
    Questions or Feedback
    <ExternalLinkIcon src={ExternalLinkSrc} />
  </>
);
const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc3_wV2ltGumMdGTcLehUM41tQri0ZW5RjIKh0JJlhpJGE9Hg/viewform";

const DOWNLOAD_TEXT = "Download Data";
const DOWNLOAD_URL = `${process.env.REACT_APP_API_URL}/api/us_nd/download`;

const METHODOLOGY_TEXT = "Methodology";

const ICON_SIZE = "26px";
const Y_MARGIN = "12px";

const BrandingBarWrapper = styled(PageWidthContainer)`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: ${(props) => props.theme.headerHeight}px;
  justify-content: space-between;
  margin: 0 auto;
  transition: height ${(props) => props.theme.transition.defaultTimeSettings};
  width: 100%;

  .home-link {
    color: ${(props) => props.theme.colors.body};
    text-decoration: none;

    &:hover,
    &:active,
    &:visited {
      color: ${(props) => props.theme.colors.body};
    }
  }

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      align-items: stretch;
      height: ${THEME.headerHeightSmall}px;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;

      &.expanded {
        height: 100vh;
      }
    `,
  ])}
`;

const BrandingBarHeader = styled.div`
  ${brandingBarFlexProperties}
  margin-top: 0;
  transition: margin ${(props) => props.theme.transition.defaultTimeSettings};

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      width: 100%;

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

const Logo = styled(Icon)`
  margin: ${Y_MARGIN} 0;
`;

const BrandingBarTitleWrapper = styled.div`
  display: inline-block;
  margin-left: 16px;
  transition: all ${(props) => props.theme.transition.defaultTimeSettings};
  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      opacity: 0;

      ${BrandingBarWrapper}.expanded & {
        opacity: 1;
      }
    `,
  ])}
`;

const BrandingBarTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: ${(props) => props.theme.fonts.brandSizeLarge};
  margin-bottom: 0;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `font-size: ${THEME.fonts.brandSizeSmall};`,
  ])}
`;

const BrandingBarSubtitle = styled.h2`
  font-size: ${(props) => props.theme.fonts.brandSubtitleSize};
  margin: 0;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `font-size: ${THEME.fonts.brandSubtitleSizeSmall};`,
  ])}
`;

const BrandingBarLinkList = styled.ul`
  ${brandingBarFlexProperties}

  flex: 1 1 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 0;
  order: 0;
  padding: 0;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `
      margin-top: 16px;
      order: 2;
      width: 100%;
    `,
  ])}
`;

const BrandingBarLink = styled.li`
  list-style-type: none;
  margin-left: 16px;
  margin-top: ${Y_MARGIN};
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
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
  order: 3;
  padding-bottom: 24px;
  width: 100%;
`;

const NavBarWrapper = styled.div`
  margin-top: 32px;
`;

const SITE_TITLE = "North Dakota Corrections and Rehabilitation";

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
  } = useCollapse({
    // zero seems to be ignored but we want the expansion to be instantaneous
    duration: 1,
  });

  return (
    <BrandingBarWrapper
      as="header"
      className={classNames({
        expanded: isExpanded,
      })}
    >
      <Link className="home-link" to={`/${DEFAULT_TENANT}`}>
        <BrandingBarHeader>
          <Logo alt="Recidiviz" src={LogoIconSrc} />
          <BrandingBarTitleWrapper>
            <BrandingBarTitle>{SITE_TITLE}</BrandingBarTitle>
            <BrandingBarSubtitle>
              A Spotlight Dashboard by Recidiviz
            </BrandingBarSubtitle>
          </BrandingBarTitleWrapper>
        </BrandingBarHeader>
      </Link>
      {!useCollapsibleNav && (
        <BrandingBarLinkList>
          <BrandingBarLink>
            <LinkPill href={FEEDBACK_URL} target="_blank">
              {FEEDBACK_TEXT}
            </LinkPill>
          </BrandingBarLink>
          <BrandingBarLink>
            <MethodologyModal
              trigger={<LinkPill href="#">{METHODOLOGY_TEXT}</LinkPill>}
            />
          </BrandingBarLink>
          <BrandingBarLink>
            <LinkPill href={DOWNLOAD_URL}>{DOWNLOAD_TEXT}</LinkPill>
          </BrandingBarLink>
        </BrandingBarLinkList>
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
                extraLinks={[
                  { url: FEEDBACK_URL, text: FEEDBACK_TEXT },
                  {
                    url: "#",
                    text: (
                      <MethodologyModal
                        trigger={<span role="button">{METHODOLOGY_TEXT}</span>}
                      />
                    ),
                  },
                  {
                    url: DOWNLOAD_URL,
                    text: DOWNLOAD_TEXT,
                  },
                ]}
              />
            </NavBarWrapper>
            <Cobranding />
          </CollapsibleMenuWrapper>
        </>
      )}
    </BrandingBarWrapper>
  );
}
