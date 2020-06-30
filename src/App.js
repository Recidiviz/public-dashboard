import React from "react";
import styled from "styled-components";
import BrandingBar from "./branding-bar";
import NavBar from "./nav-bar";
import Routes from "./routes";
import SiteStyles from "./site-styles";

const CONTAINER_WIDTH = 1144;
const NAV_WIDTH = 150;

const SiteContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: ${CONTAINER_WIDTH}px;
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

function App() {
  return (
    <>
      <SiteStyles />
      <SiteContainer>
        <BrandingBarWrapper>
          <BrandingBar />
        </BrandingBarWrapper>
        <NavBarWrapper>
          <NavBar />
        </NavBarWrapper>
        <MainContentWrapper>
          <Routes />
        </MainContentWrapper>
      </SiteContainer>
    </>
  );
}

export default App;
