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

import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import useCollapse from "react-collapsed";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { animation, colors, typefaces } from "../UiLibrary";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { NAV_BAR_HEIGHT } from "../constants";
import MenuButton from "./MenuButton";
import BrandMark from "./BrandMark";
import {
  NavContainer as NavContainerBase,
  NavBar as NavBarBase,
  NavGroup,
  NavGroupItem as NavGroupItemBase,
  NavLink as NavLinkBase,
} from "./shared";

const NavContainer = styled(animated(NavContainerBase))<{
  $expanded: boolean;
}>`
  color: ${colors.textLight};
  height: ${(props) => (props.$expanded ? "100vh" : rem(NAV_BAR_HEIGHT))};
  transition: height ${animation.defaultDuration}ms;
`;

const NavBar = styled(animated(NavBarBase))`
  padding: 0 ${rem(16)};
`;

const NavGroupItem = styled(NavGroupItemBase)`
  align-items: center;
  display: flex;
`;

const NavLink = styled(NavLinkBase)`
  color: ${colors.textLight};
`;

const NavMenu = styled.ul`
  font-family: ${typefaces.display};
  font-size: ${rem(20)};
  letter-spacing: -0.015em;
  line-height: 1.3;
  margin-left: ${rem(16)};
`;

const NavMenuItem = styled.li`
  border-bottom: 1px solid ${colors.mobileMenuRule};
  padding: ${rem(24)} ${rem(16)};
  padding-left: 0;

  &:last-of-type {
    border: none;
  }
`;

const SiteNavigation: React.FC = () => {
  const { tenant } = useDataStore();

  const {
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded,
  } = useCollapse({});

  const animatedStyles = useSpring({
    from: { background: colors.background },
    background: isExpanded ? colors.mobileMenuBackground : colors.background,
    borderColor: isExpanded ? colors.mobileMenuRule : colors.rule,
  });

  return (
    // expanded uses styled-component props rather than springs
    // because react-spring cannot interpolate from pixels to vh units
    <NavContainer
      $expanded={isExpanded}
      style={{ background: animatedStyles.background }}
    >
      <NavBar style={{ borderColor: animatedStyles.borderColor }}>
        <NavGroup>
          <NavGroupItem>
            <NavLink
              onClick={() => setExpanded(false)}
              to={getUrlForResource({ page: "home" })}
            >
              <BrandMark light />
            </NavLink>
          </NavGroupItem>
          {tenant && (
            <NavGroupItem style={{ marginLeft: rem(8) }}>
              {tenant.name}
            </NavGroupItem>
          )}
        </NavGroup>
        <MenuButton isOpen={isExpanded} {...getToggleProps()} />
      </NavBar>
      <NavMenu {...getCollapseProps()} data-testid="NavMenu">
        {tenant && (
          <>
            <NavMenuItem>
              <NavLink
                onClick={() => setExpanded(false)}
                to={getUrlForResource({
                  page: "tenant",
                  params: { tenantId: tenant.id },
                })}
              >
                Home
              </NavLink>
            </NavMenuItem>
            {Object.values(tenant.systemNarratives).map(
              (narrative) =>
                narrative && (
                  <NavMenuItem key={narrative.id}>
                    <NavLink
                      onClick={() => setExpanded(false)}
                      to={getUrlForResource({
                        page: "narrative",
                        params: {
                          tenantId: tenant.id,
                          narrativeTypeId: narrative.id,
                        },
                      })}
                    >
                      {narrative.title}
                    </NavLink>
                  </NavMenuItem>
                )
            )}
            {tenant.racialDisparitiesNarrative && (
              <NavMenuItem>
                <NavLink
                  onClick={() => setExpanded(false)}
                  to={getUrlForResource({
                    page: "narrative",
                    params: {
                      tenantId: tenant.id,
                      narrativeTypeId: "RacialDisparities",
                    },
                  })}
                >
                  {tenant.racialDisparitiesNarrative.title}
                </NavLink>
              </NavMenuItem>
            )}
          </>
        )}
      </NavMenu>
    </NavContainer>
  );
};

export default observer(SiteNavigation);
