import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";
import { useMatch } from "@reach/router";
import BrandingBar from "../branding-bar";
import {
  CONTAINER_WIDTH,
  FIXED_HEADER_HEIGHT,
  PATHS,
  X_PADDING,
} from "../constants";
import Footer from "../footer";
import NavBar from "../nav-bar";
import PageRoutes from "../page-routes";
import BackgroundImageSrc from "../assets/images/background.png";
import SecondaryNav from "../secondary-nav";
import InfoPanel from "../info-panel";

const NAV_WIDTH = 150;

const SiteContainer = styled.div`
  ${(props) =>
    props.showBackground &&
    css`
      background-image: url(${BackgroundImageSrc});
      background-size: cover;
      ${mediaQuery(["mobile-", "background-size: contain;"])}
      background-repeat: no-repeat;
    `}

  width: 100%;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: ${CONTAINER_WIDTH}px;
  padding: 0 ${X_PADDING}px;
`;

const BrandingBarWrapper = styled.div`
  flex: 0 0 auto;
  margin-bottom: 64px;
  min-height: ${FIXED_HEADER_HEIGHT}px;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.header};

  ${mediaQuery(["mobile-", "margin-bottom: 16px;"])}
`;

const NavBarWrapper = styled.div`
  /* on small screens this will grow to fill an entire row  */
  flex: 1 0 auto;
  width: ${NAV_WIDTH}px;
`;

const SecondaryNavWrapper = styled.div`
  padding: 10%;
  width: 100%;
`;

const MainContentWrapper = styled.div`
  /*
    flex-grow is mega large because we want this component to take up
    all available space when it shares a row with NavBarWrapper
  */
  flex: 2000 0 auto;
  width: 320px;
`;

const FooterWrapper = styled.div`
  background: ${(props) => props.theme.colors.footerBackground};
  padding: 0 ${X_PADDING}px;
  width: 100%;
`;

function SiteLayout({ tenantId }) {
  const showNav = useBreakpoint(false, ["tablet+", true]);
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
