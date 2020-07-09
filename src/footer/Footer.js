import React from "react";
import styled from "styled-components";
import { getYear } from "date-fns";

import { CONTAINER_WIDTH } from "../constants";
import RecidivizSrc from "../assets/icons/recidiviz.svg";

const FooterContainer = styled.footer`
  background: ${(props) => props.theme.colors.footerBackground};
  color: ${(props) => props.theme.colors.footer};
  font: ${(props) => props.theme.fonts.body};
`;

const FooterContent = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${CONTAINER_WIDTH}px;
  min-height: 320px;
`;

const FooterCredits = styled.div`
  flex: 0 1 auto;
  min-height: 96px;
  width: 440px;
`;

const FooterLegal = styled.div`
  align-items: flex-end;
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  justify-content: space-between;
  min-height: 96px;
`;

const FooterLegalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RecidivizBrandingContainer = styled.div``;
const RecidivizBranding = styled.img``;

const FooterLegalese = styled.span`
  margin-left: 32px;
`;

const PrivacyLink = styled.a`
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: ${(props) => props.theme.colors.footer};
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterCredits>
          This dashboard was made in collaborations with lorem ipsum dolor sit
          amet, consectetur adipiscing elit. In tincidunt cras diam venenatis,
          id praesent in dignissim. Urna ut justo et et sed ut convallis aliquam
          fermentum. Vel vehicula purus diam lorem sed interdum hendrerit. Eu
          neque sed urna lacus donec iaculis sapien.
        </FooterCredits>
        <FooterLegal>
          <RecidivizBrandingContainer>
            <RecidivizBranding alt="Recidiviz" src={RecidivizSrc} />
          </RecidivizBrandingContainer>
          <FooterLegalContent>
            <FooterLegalese>
              &copy; {getYear(new Date())} Recidiviz. All Rights Reserved.
            </FooterLegalese>
            <FooterLegalese>
              <PrivacyLink href="#">Privacy Policy</PrivacyLink>
            </FooterLegalese>
          </FooterLegalContent>
        </FooterLegal>
      </FooterContent>
    </FooterContainer>
  );
}
