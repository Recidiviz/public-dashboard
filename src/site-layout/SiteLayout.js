import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import BrandingBar from "../branding-bar";
import { CONTAINER_WIDTH } from "../constants";
import Footer from "../footer";
import NavBar from "../nav-bar";
import PageRoutes from "../page-routes";

const NAV_WIDTH = 150;

const X_PADDING = 8;

const SiteContainer = styled.div`
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
  width: 100%;
`;

const NavBarWrapper = styled.div`
  /* on small screens this will grow to fill an entire row  */
  flex: 1 0 auto;
  width: ${NAV_WIDTH}px;
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
  return (
    <SiteContainer>
      <BodyWrapper>
        <BrandingBarWrapper>
          <BrandingBar />
        </BrandingBarWrapper>
        {tenantId && (
          <>
            <NavBarWrapper>
              <NavBar />
            </NavBarWrapper>
            <MainContentWrapper>
              <PageRoutes />
            </MainContentWrapper>
          </>
        )}
      </BodyWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
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
