import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import { getYear } from "date-fns";
import useBreakpoint from "@w11r/use-breakpoint";
import { fluidFontSizeStyles } from "../utils";

import { BODY_FONT_SIZE, CONTAINER_WIDTH } from "../constants";
import RecidivizSrc from "../assets/icons/recidiviz.svg";

import Cobranding from "../cobranding";

const FooterContainer = styled.footer`
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
  &.expanded {
    min-height: 96px;
    max-width: 424px;
    width: 40%;
  }
`;

const FooterLegal = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  &.expanded {
    align-items: flex-end;
    flex-direction: column;
    justify-content: space-between;
    min-height: 96px;
    width: 40%;
  }
`;

const FooterLegalContent = styled.div`
  ${fluidFontSizeStyles(8, BODY_FONT_SIZE)}
`;

const FooterLegalese = styled.span`
  margin-left: 16px;
`;

const PrivacyLink = styled.a`
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: ${(props) => props.theme.colors.footer};
  }
`;

const RecidivizBrandingContainer = styled.div`
  align-items: center;
  display: flex;
`;

const BrandingLink = styled.a`
  margin-left: 16px;
`;

const RecidivizBranding = styled.img``;

export default function Footer() {
  const showExpandedFooter = useBreakpoint(false, ["tablet+", true]);

  return (
    <FooterContainer>
      <FooterContent>
        <FooterCredits className={classNames({ expanded: showExpandedFooter })}>
          This dashboard was made in collaborations with lorem ipsum dolor sit
          amet, consectetur adipiscing elit. In tincidunt cras diam venenatis,
          id praesent in dignissim. Urna ut justo et et sed ut convallis aliquam
          fermentum. Vel vehicula purus diam lorem sed interdum hendrerit. Eu
          neque sed urna lacus donec iaculis sapien.
        </FooterCredits>
        <FooterLegal className={classNames({ expanded: showExpandedFooter })}>
          <RecidivizBrandingContainer>
            <Cobranding light />
            <BrandingLink href="https://recidiviz.org">
              <RecidivizBranding alt="Recidiviz" src={RecidivizSrc} />
            </BrandingLink>
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
