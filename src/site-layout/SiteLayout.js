import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";
import { useMatch } from "@reach/router";
import BrandingBar from "../branding-bar";
import {
  COLLAPSIBLE_NAV_BREAKPOINT,
  CONTAINER_WIDTH,
  PATHS,
  THEME,
  X_PADDING,
} from "../constants";
import Footer from "../footer";
import NavBar from "../nav-bar";
import PageRoutes from "../page-routes";
import BackgroundImageSrc from "../assets/images/background.png";
import SecondaryNav from "../secondary-nav";
import InfoPanel from "../info-panel";

const NAV_WIDTH = 150;

const BRANDING_BAR_MARGIN = 16;

const SiteContainer = styled.div`
  ${(props) =>
    props.showBackground &&
    css`
      background-image: url(${BackgroundImageSrc});
      background-size: cover;
      background-repeat: no-repeat;
    `}
  padding-top: ${(props) => props.theme.headerHeight + BRANDING_BAR_MARGIN}px;
  width: 100%;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `padding-top: ${THEME.headerHeightSmall + BRANDING_BAR_MARGIN}px;`,
  ])}
`;

const BodyWrapper = styled.div`
  margin: 0 auto;
  max-width: ${CONTAINER_WIDTH}px;

  ${mediaQuery([COLLAPSIBLE_NAV_BREAKPOINT, `padding: 0 ${X_PADDING}px;`])}
`;

const BrandingBarWrapper = styled.div`
  background: ${(props) => props.theme.colors.background};
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${(props) => props.theme.zIndex.header};
`;

const NavBarWrapper = styled.div`
  position: fixed;
  width: ${NAV_WIDTH}px;
  z-index: ${(props) => props.theme.zIndex.base};
`;

const SecondaryNavWrapper = styled.div`
  padding: 10%;
  width: 100%;
`;

const MainContentWrapper = styled.div`
  padding-left: ${NAV_WIDTH}px;
  width: 100%;

  ${mediaQuery([COLLAPSIBLE_NAV_BREAKPOINT, `padding-left: 0;`])}
`;

const FooterWrapper = styled.div`
  background: ${(props) => props.theme.colors.footerBackground};
  padding: 0 ${X_PADDING}px;
  width: 100%;
`;

function SiteLayout({ tenantId }) {
  const showNav = useBreakpoint(true, [COLLAPSIBLE_NAV_BREAKPOINT, false]);
  const onOverviewPage = useMatch(`/:tenantId/${PATHS.overview}`);

  return (
    <SiteContainer showBackground={onOverviewPage}>
      <BodyWrapper>
        <BrandingBarWrapper>
          <BrandingBar />
        </BrandingBarWrapper>
        {tenantId && (
          <>
            {showNav && (
              <NavBarWrapper>
                <NavBar />
              </NavBarWrapper>
            )}
            <MainContentWrapper>
              <PageRoutes />
              {!onOverviewPage && (
                <SecondaryNavWrapper>
                  <SecondaryNav />
                </SecondaryNavWrapper>
              )}
            </MainContentWrapper>
          </>
        )}
      </BodyWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
      <InfoPanel />
    </SiteContainer>
  );
}

SiteLayout.propTypes = {
  tenantId: PropTypes.string,
};

SiteLayout.defaultProps = {
  tenantId: undefined,
};

export default SiteLayout;
