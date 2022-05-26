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

import { typography } from "@recidiviz/design-system";
import useBreakpoint from "@w11r/use-breakpoint";
import { observer } from "mobx-react-lite";
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
import { useDataStore } from "../StoreProvider";
import { breakpoints, colors } from "../UiLibrary";

const Wrapper = styled.footer`
  ${typography.Sans12}
  background: ${colors.footerBackground};
  color: ${colors.caption};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: ${rem(130)};
  min-height: ${rem(FOOTER_HEIGHT)};
  padding: ${rem(32)};
  padding-bottom: 0;
  width: 100%;

  a {
    color: ${colors.caption};
  }

  /*
    on smaller screens where we stack vertically, height may need to grow;
    however, IE mangles vertical placement if there is only a min-height set.
    larger screens should not require a taller footer
  */
  @media screen and (min-width: ${breakpoints.tablet[0]}px) {
    height: ${rem(FOOTER_HEIGHT)};
  }
`;

const Contents = styled.div`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CoBranding = styled.div`
  flex: 0 0 auto;
  margin-bottom: ${rem(16)};
  width: 100%;
`;

const DocButton = styled.a`
  background: ${colors.caption};
  color: ${colors.footerBackground} !important;
  border-radius: 5px;
  padding: ${rem(8)} ${rem(10)};
  text-decoration: none;
  font-weight: normal;
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
  const { tenant } = useDataStore();
  const isMobile = useBreakpoint(false, ["mobile-", true]);

  const year = new Date().getFullYear();

  return (
    <Wrapper>
      <Contents>
        {tenant && (
          <CoBranding>
            <DocButton href={tenant.docLink}>
              Go to{" "}
              <strong>
                {isMobile ? `${tenant.name} DOC` : tenant.docName}
              </strong>
            </DocButton>
          </CoBranding>
        )}
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
            <SocialLink href="https://twitter.com/Recidiviz">
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

export default observer(SiteFooter);
