import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { useMatch } from "@reach/router";
import BrandingBar from "../branding-bar";
import { COLLAPSIBLE_NAV_BREAKPOINT, PATHS } from "../constants";
import Footer from "../footer";
import NavBar from "../nav-bar";
import PageRoutes from "../page-routes";
import SecondaryNav from "../secondary-nav";
import InfoPanel from "../info-panel";
import Cobranding from "../cobranding";
import PageWidthContainer from "../page-width-container";
import { THEME } from "../theme";

const NAV_WIDTH = 240;

const BRANDING_BAR_MARGIN = 16;

const SiteContainer = styled.div`
  width: 100%;
`;

const BodyWrapper = styled(PageWidthContainer)`
  margin: 0 auto;
  min-height: 100vh;
  padding-top: ${(props) => props.theme.headerHeight + BRANDING_BAR_MARGIN}px;

  ${mediaQuery([
    COLLAPSIBLE_NAV_BREAKPOINT,
    `padding-top: ${THEME.headerHeightSmall + BRANDING_BAR_MARGIN}px;`,
  ])}
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
  bottom: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: ${(props) => props.theme.headerHeight + BRANDING_BAR_MARGIN}px;
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
  position: relative;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.base + 1};
`;

function SiteLayout({ tenantId }) {
  const showNav = useBreakpoint(true, [COLLAPSIBLE_NAV_BREAKPOINT, false]);
  const onOverviewPage = useMatch(`/:tenantId/${PATHS.overview}`);

  return (
    <SiteContainer>
      <BodyWrapper>
        <BrandingBarWrapper>
          <BrandingBar />
        </BrandingBarWrapper>
        {tenantId && (
          <>
            {showNav && (
              <NavBarWrapper>
                <NavBar />
                <Cobranding />
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
