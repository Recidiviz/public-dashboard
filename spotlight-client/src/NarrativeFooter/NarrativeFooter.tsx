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
import { animated, useSprings } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { SystemNarrativeTypeIdList } from "../contentApi/types";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { colors, typefaces } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";

const Container = styled.nav`
  padding: ${rem(120)} ${rem(32)};

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

const Footer: React.FC = () => {
  const {
    tenant,
    tenantStore: { currentNarrativeTypeId },
  } = useDataStore();

  const narrativesToDisplay = SystemNarrativeTypeIdList.filter(
    (id) => id !== currentNarrativeTypeId
  );

  const [arrowSprings, setArrowSprings] = useSprings(
    narrativesToDisplay.length,
    () => ({
      opacity: 0,
      from: { opacity: 0 },
    })
  );

  if (!tenant) return null;

  function transitionArrow({
    index,
    visible,
  }: {
    index: number;
    visible: boolean;
  }) {
    return () => {
      // @ts-expect-error type error in current version,
      // https://github.com/pmndrs/react-spring/issues/861
      setArrowSprings((springIndex: number) => {
        if (springIndex !== index) return;
        return { opacity: visible ? 1 : 0 };
      });
    };
  }

  return (
    <Container aria-label="collections">
      <Heading>Continue Reading</Heading>
      <LinkList>
        {narrativesToDisplay.map((id, index) => {
          const narrative = tenant.systemNarratives[id];
          if (narrative)
            return (
              <LinkListItem key={id}>
                <Link
                  to={getUrlForResource({
                    page: "narrative",
                    params: { tenantId: tenant.id, narrativeTypeId: id },
                  })}
                  onMouseOver={transitionArrow({ index, visible: true })}
                  onFocus={transitionArrow({ index, visible: true })}
                  onMouseOut={transitionArrow({ index, visible: false })}
                  onBlur={transitionArrow({ index, visible: false })}
                >
                  {narrative.title}{" "}
                  <animated.span style={arrowSprings[index]}>
                    <Arrow color={colors.link} direction="right" />
                  </animated.span>
                </Link>
              </LinkListItem>
            );
          return null;
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
