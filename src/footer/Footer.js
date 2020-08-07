import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import { getYear } from "date-fns";
import useBreakpoint from "@w11r/use-breakpoint";
import { fluidFontSizeStyles } from "../utils";

import { BODY_FONT_SIZE } from "../constants";
import RecidivizSrc from "../assets/images/recidiviz.png";
import PageWidthContainer from "../page-width-container";

import Cobranding from "../cobranding";

const FooterContainer = styled.footer`
  color: ${(props) => props.theme.colors.footer};
`;

const FooterContent = styled(PageWidthContainer)`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
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

const RecidivizBranding = styled.img`
  height: 19px;
  width: 90px;
`;

export default function Footer() {
  const showExpandedFooter = useBreakpoint(false, ["tablet+", true]);

  return (
    <FooterContainer>
      <FooterContent>
        <FooterCredits className={classNames({ expanded: showExpandedFooter })}>
          This dashboard was created in collaboration with the North Dakota
          Department of Corrections and Rehabilitation (ND DOCR).
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
              <PrivacyLink href="https://recidiviz.org/legal/privacy-policy">
                Privacy Policy
              </PrivacyLink>
            </FooterLegalese>
          </FooterLegalContent>
        </FooterLegal>
      </FooterContent>
    </FooterContainer>
  );
}
