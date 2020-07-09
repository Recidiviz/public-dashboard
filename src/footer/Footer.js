import React from "react";
import breakpoint from "styled-components-breakpoint";
import styled from "styled-components";

import { CONTAINER_WIDTH } from "../constants";
import RecidivizSrc from "../assets/icons/recidiviz.svg";

const FooterContainer = styled.footer`
  background: ${(props) => props.theme.colors.darkerGreen};
  color: ${(props) => props.theme.colors.footer};
  font: ${(props) => props.theme.fonts.body};
`;

const FooterContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: ${(props) => props.theme.spacing[74]};

  ${breakpoint("md")`
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    max-width: ${CONTAINER_WIDTH}px;
  `}
`;

const FooterCredits = styled.div`
  padding: ${(props) => props.theme.spacing[8]};

  ${breakpoint("md")`
    min-height: ${(props) => props.theme.spacing[24]};
    width: 40%;
  `}

  /* 
    There is a bug in styled-components-breakpoint libary which doesn't allow multiple
    interpreted values to be used within the same 'breakpoint' block:
    https://github.com/jameslnewell/styled-components-breakpoint/issues/26

    As a workaround, it is possible to achieve the desired result by using a separate
    breakpoint block for each interpreted property.
  */
  ${breakpoint("md")`
    padding: ${(props) => props.theme.spacing[0]};
  `}
`;

const FooterLegal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;

  ${breakpoint("md")`
    min-height: ${(props) => props.theme.spacing[24]};
    text-align: right;
    width: 40%;
  `}
`;

const FooterLegalContent = styled.div``;

const RecidivizBrandingContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};

  ${breakpoint("md")`
    margin-bottom: ${(props) => props.theme.spacing[0]};
  `}
`;

const RecidivizBranding = styled.img``;

const FooterLegalese = styled.span`
  display: block;

  ${breakpoint("md")`
    display: inline;
    margin-left: ${(props) => props.theme.spacing[8]};
  `}
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
              &copy; 2020 Recidiviz. All Rights Reserved.
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
