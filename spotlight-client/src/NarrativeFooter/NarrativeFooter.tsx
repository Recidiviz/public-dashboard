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

import { Link } from "@reach/router";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { TenantId } from "../contentApi/types";
import SystemNarrative from "../contentModels/SystemNarrative";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { colors, typefaces } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";

const Container = styled.nav`
  padding: ${rem(120)} ${rem(32)} 0;

  .NarrativeFooter__BackLink {
    color: ${colors.link};
    display: inline-block;
    font-weight: 500;
    font-size: ${rem(18)};
    line-height: 1.7;
    margin-top: ${rem(48)};
    text-decoration: none;
  }
`;

const Heading = styled.h2`
  font-family: ${typefaces.display};
  font-size: ${rem(32)};
  line-height: 1.75;
  letter-spacing: -0.04em;
`;

const LinkList = styled.ul`
  display: flex;
  font-size: ${rem(24)};
  line-height: 1.5;
  margin: ${rem(48)} -${rem(16)};
`;

const LinkListItem = styled.li`
  border-top: 1px solid ${colors.rule};
  flex: 1 1 auto;
  margin: 0 ${rem(16)};

  a {
    color: ${colors.text};
    display: block;
    padding-top: ${rem(32)};
    text-decoration: none;
    width: 100%;
  }
`;

const FooterLink: React.FC<{
  narrative: SystemNarrative;
  tenantId: TenantId;
}> = ({ narrative, tenantId }) => {
  const [animationStyles, setAnimationStyles] = useSpring(() => ({
    opacity: 0,
    from: { opacity: 0 },
  }));

  return (
    <LinkListItem>
      <Link
        to={getUrlForResource({
          page: "narrative",
          params: { tenantId, narrativeTypeId: narrative.id },
        })}
        onMouseOver={() => setAnimationStyles({ opacity: 1 })}
        onFocus={() => setAnimationStyles({ opacity: 1 })}
        onMouseOut={() => setAnimationStyles({ opacity: 0 })}
        onBlur={() => setAnimationStyles({ opacity: 0 })}
      >
        {narrative.title}{" "}
        <animated.span style={animationStyles}>
          <Arrow color={colors.link} direction="right" />
        </animated.span>
      </Link>
    </LinkListItem>
  );
};

const Footer: React.FC = () => {
  const {
    tenant,
    tenantStore: { currentNarrativeTypeId },
  } = useDataStore();

  if (!tenant) return null;

  const narrativesToDisplay = Object.values(tenant.systemNarratives).filter(
    (narrative) => narrative && narrative.id !== currentNarrativeTypeId
  ) as SystemNarrative[]; // this assertion is safe because undefined items were filtered out

  return (
    <Container aria-label="collections">
      <Heading>Continue Reading</Heading>
      <LinkList>
        {narrativesToDisplay.map((narrative) => {
          return (
            <FooterLink
              key={narrative.id}
              tenantId={tenant.id}
              narrative={narrative}
            />
          );
        })}
      </LinkList>
      <Link
        className="NarrativeFooter__BackLink"
        to={getUrlForResource({
          page: "narrative list",
          params: { tenantId: tenant.id },
        })}
      >
        <Arrow direction="left" /> Back to Collections
      </Link>
    </Container>
  );
};

export default observer(Footer);
