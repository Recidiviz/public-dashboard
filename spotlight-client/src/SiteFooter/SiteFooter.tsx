// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import angelPath from "../assets/angel-logo-light.svg";
import githubPath from "../assets/github-logo-light.svg";
import linkedinPath from "../assets/linkedin-logo-light.svg";
import mediumPath from "../assets/medium-logo-light.svg";
import wordmarkPath from "../assets/recidiviz-logo-light.svg";
import twitterPath from "../assets/twitter-logo-light.svg";
import { FOOTER_HEIGHT } from "../constants";
import { breakpoints, colors } from "../UiLibrary";

const Wrapper = styled.footer`
  align-content: flex-end;
  background: ${colors.footerBackground};
  color: ${colors.caption};
  display: flex;
  font-size: ${rem(12)};
  font-weight: 700;
  line-height: 1.25;
  margin-top: ${rem(120)};
  min-height: ${rem(FOOTER_HEIGHT)};
  padding: ${rem(32)};
  padding-bottom: 0;
  width: 100%;

  a {
    color: ${colors.caption};
  }
`;

const Contents = styled.div`
  align-content: flex-end;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Legalese = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${rem(32)};
`;

const BrandLinks = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${rem(32)};
`;

const SocialLinks = styled.div`
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  width: 100%;

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    width: auto;
  }
`;

const SocialLink = styled.a`
  margin: ${rem(8)};

  img {
    height: ${rem(40)};
    padding: ${rem(8)};
    width: auto;
  }

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    img {
      height: ${rem(16)};
      padding: 0;
    }
  }
`;

const BrandLink = styled.a`
  margin-bottom: ${rem(8)};
  margin-left: ${rem(8)};

  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    margin-bottom: 0;
    margin-left: ${rem(56)};
  }
`;

const SiteFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <Wrapper>
      <Contents>
        <Legalese>
          <span>
            &#169; Copyright {year} Recidiviz. All rights reserved.{" "}
            <a href="https://recidiviz.org/legal/privacy-policy">
              Privacy Policy
            </a>
          </span>
        </Legalese>
        <BrandLinks>
          <SocialLinks>
            <SocialLink href="https://twitter.com/RecidivizOrg">
              <img alt="Twitter" src={twitterPath} />
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/company/recidiviz/">
              <img alt="LinkedIn" src={linkedinPath} />
            </SocialLink>
            <SocialLink href="https://github.com/Recidiviz/">
              <img alt="GitHub" src={githubPath} />
            </SocialLink>
            <SocialLink href="https://medium.com/recidiviz">
              <img alt="Medium" src={mediumPath} />
            </SocialLink>
            <SocialLink href="https://angel.co/company/recidiviz">
              <img alt="AngelList" src={angelPath} />
            </SocialLink>
          </SocialLinks>
          <BrandLink href="https://recidiviz.org">
            <img alt="Recidiviz" src={wordmarkPath} />
          </BrandLink>
        </BrandLinks>
      </Contents>
    </Wrapper>
  );
};

export default SiteFooter;
