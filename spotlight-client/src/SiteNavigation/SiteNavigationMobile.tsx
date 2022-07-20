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

import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React, { useRef } from "react";
import useCollapse from "react-collapsed";
import { animated, useSpring } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { typography } from "@recidiviz/design-system";
import { animation, colors } from "../UiLibrary";
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
  ExternalNavLink as ExternalNavLinkBase,
  NavButton as ExternalNavButton,
  ShareButtonProps,
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

const ExternalNavLink = styled(ExternalNavLinkBase)`
  color: ${colors.textLight};
`;

const NavButton = styled(ExternalNavButton)`
  color: ${colors.textLight};
  padding: 0;

  ${typography.Serif24}
`;

const NavMenuWrapper = styled.div`
  max-height: calc(100vh - ${rem(NAV_BAR_HEIGHT)});
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const NavMenu = styled.ul`
  ${typography.Serif24}

  margin-left: ${rem(16)};
  /* make room for the bottom UI that may cover part of the page */
  padding-bottom: ${rem(64)};
`;

const NavMenuItem = styled.li`
  border-bottom: 1px solid ${colors.mobileMenuRule};
  padding: ${rem(24)} ${rem(16)};
  padding-left: 0;

  &:last-of-type {
    border: none;
  }
`;

const SiteNavigation: React.FC<ShareButtonProps> = ({ openShareModal }) => {
  const { tenant } = useDataStore();

  const menuScrollRef = useRef<HTMLDivElement>(null);

  const {
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded,
  } = useCollapse({
    onCollapseStart: () => {
      if (menuScrollRef.current) enableBodyScroll(menuScrollRef.current);
    },
    onExpandStart: () => {
      if (menuScrollRef.current) disableBodyScroll(menuScrollRef.current);
    },
  });

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
      <NavMenuWrapper ref={menuScrollRef}>
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
              {tenant.ridersNarrative && (
                <NavMenuItem>
                  <NavLink
                    onClick={() => setExpanded(false)}
                    to={getUrlForResource({
                      page: "narrative",
                      params: {
                        tenantId: tenant.id,
                        narrativeTypeId: "Riders",
                      },
                    })}
                  >
                    {tenant.ridersNarrative.title}
                  </NavLink>
                </NavMenuItem>
              )}
              {tenant && (
                <NavMenuItem>
                  <ExternalNavLink href={tenant.feedbackUrl}>
                    Feedback
                  </ExternalNavLink>
                </NavMenuItem>
              )}
              <NavMenuItem>
                <NavButton
                  onClick={() => {
                    openShareModal();
                    setExpanded(false);
                  }}
                >
                  Share
                </NavButton>
              </NavMenuItem>
            </>
          )}
        </NavMenu>
      </NavMenuWrapper>
    </NavContainer>
  );
};

export default observer(SiteNavigation);
