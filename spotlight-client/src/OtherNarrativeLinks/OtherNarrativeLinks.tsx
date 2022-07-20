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
import { typography } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { track } from "../analytics";
import { TenantId } from "../contentApi/types";
import { Narrative } from "../contentModels/types";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { breakpoints, colors } from "../UiLibrary";
import Arrow from "../UiLibrary/Arrow";

// grid styles adapted from IE-safe auto placement grid
// https://css-tricks.com/css-grid-in-ie-faking-an-auto-placement-grid-with-gaps/

const Wrapper = styled.div`
  /* prevents the trailing grid gaps from pushing other stuff around */
  overflow: hidden;
`;

const LinkList = styled.ul`
  ${typography.Sans24}
  display: flex;
  flex-wrap: wrap;
  /* this margin makes the cells flush left and right */
  margin: ${rem(48)} -${rem(32)} 0 0;
`;

const LinkListItem = styled.li`
  /* creates gaps */
  border: 0 solid transparent;
  border-width: 0 ${rem(32)} ${rem(32)} 0;
  flex: 0 0 auto;
  white-space: nowrap;
  /* use width to create 1-4 columns, depending on screen size */
  width: 100%;
  @media (min-width: ${breakpoints.tablet[0]}px) {
    width: calc(100% / 2);
  }
  @media (min-width: ${breakpoints.desktop[0]}px) {
    width: calc(100% / 3);
  }
  @media (min-width: ${breakpoints.xl[0]}px) {
    width: calc(100% / 4);
  }
  a {
    border-top: 1px solid ${colors.rule};
    color: ${colors.text};
    display: block;
    padding-right: ${rem(8)};
    padding-top: ${rem(32)};
    text-decoration: none;
    width: 100%;
  }
`;

const LinkText = styled.span`
  white-space: normal;
`;

const NarrativeLink: React.FC<{
  narrative: Narrative;
  tenantId: TenantId;
}> = observer(({ narrative, tenantId }) => {
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
        onClick={() =>
          track("narrative_body_link_clicked", {
            category: "navigation",
            label: narrative.id,
          })
        }
        onMouseOver={() => setAnimationStyles({ opacity: 1 })}
        onFocus={() => setAnimationStyles({ opacity: 1 })}
        onMouseOut={() => setAnimationStyles({ opacity: 0 })}
        onBlur={() => setAnimationStyles({ opacity: 0 })}
      >
        <LinkText>{narrative.title}</LinkText>&nbsp;
        <animated.span style={animationStyles}>
          <Arrow color={colors.link} direction="right" />
        </animated.span>
      </Link>
    </LinkListItem>
  );
});

/**
 * Produces a grid of links to available narratives for the current tenant.
 * If there is a current narrative selected, it will be excluded from the grid.
 */
const OtherNarrativeLinks = (): React.ReactElement | null => {
  const {
    tenant,
    tenantStore: { currentNarrativeTypeId },
  } = useDataStore();

  if (!tenant) return null;

  const narrativesToDisplay = [
    ...Object.values(tenant.systemNarratives),
    tenant.racialDisparitiesNarrative,
    tenant.ridersNarrative,
  ].filter((narrative): narrative is Narrative => {
    if (narrative === undefined) return false;
    return narrative.id !== currentNarrativeTypeId;
  });

  return (
    <Wrapper>
      <LinkList>
        {narrativesToDisplay.map((narrative) => {
          return (
            <NarrativeLink
              key={narrative.id}
              tenantId={tenant.id}
              narrative={narrative}
            />
          );
        })}
      </LinkList>
    </Wrapper>
  );
};

export default observer(OtherNarrativeLinks);
