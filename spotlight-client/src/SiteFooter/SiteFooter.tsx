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
import { colors } from "../UiLibrary";

const Container = styled.footer`
  background: ${colors.footerBackground};
  color: ${colors.caption};
  font-size: ${rem(8)};
  font-weight: 700;
  height: ${rem(FOOTER_HEIGHT)};
  line-height: 1.25;
  padding: ${rem(184)} ${rem(32)} 0;
  width: 100%;

  a {
    color: ${colors.caption};
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Legalese = styled.div`
  align-items: center;
  display: flex;
`;

const Icons = styled.div`
  align-items: center;
  display: flex;
`;

const SocialLink = styled.a`
  margin: 0 ${rem(8)};
`;

const BrandLink = styled.a`
  margin-left: ${rem(52)};
`;

const SiteFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <Container>
      <Row>
        <Legalese>
          <span>
            &#169; Copyright {year} Recidiviz. All rights reserved.{" "}
            <a href="https://recidiviz.org/legal/privacy-policy">
              Privacy Policy
            </a>
          </span>
        </Legalese>
        <Icons>
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
          <BrandLink href="https://recidiviz.org">
            <img alt="Recidiviz" src={wordmarkPath} />
          </BrandLink>
        </Icons>
      </Row>
    </Container>
  );
};

export default SiteFooter;
