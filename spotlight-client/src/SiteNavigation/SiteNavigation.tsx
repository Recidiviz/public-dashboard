// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { Link, LinkGetProps } from "@reach/router";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import logoPath from "../assets/spotlight-logo.svg";
import { colors, zIndex } from "../UiLibrary";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { NAV_BAR_HEIGHT } from "../constants";

const NavContainer = styled.nav`
  align-items: stretch;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.rule};
  display: flex;
  height: ${rem(NAV_BAR_HEIGHT)};
  justify-content: space-between;
  left: 0;
  padding: 0 ${rem(8)};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: ${zIndex.header};

  .NavLink {
    align-items: center;
    color: ${colors.text};
    display: flex;
    height: 100%;
    padding: 0 ${rem(16)};
    position: relative;
    text-decoration: none;

    &::before {
      background: ${colors.accent};
      content: "";
      height: ${rem(3)};
      left: 50%;
      position: absolute;
      top: 0;
      transition: width 250ms ease-in-out, left 250ms ease-in-out;
      width: 0;
    }

    &--active::before {
      width: 100%;
      left: 0;
    }
  }
`;

const NavGroup = styled.ul`
  align-items: stretch;
  display: flex;
`;

const NavGroupItem = styled.li``;

function getNavLinkProps({ matchPartial }: { matchPartial: boolean }) {
  return ({ isCurrent, isPartiallyCurrent }: LinkGetProps) => {
    let className = "NavLink";
    if (isCurrent || (matchPartial && isPartiallyCurrent)) {
      className += " NavLink--active";
    }
    return {
      className,
    };
  };
}

const SiteNavigation: React.FC = () => {
  const { tenant } = useDataStore();

  return (
    <NavContainer>
      <NavGroup>
        <NavGroupItem>
          <Link className="NavLink" to={getUrlForResource({ page: "home" })}>
            <img src={logoPath} alt="Spotlight" />
          </Link>
        </NavGroupItem>
        {tenant && (
          <NavGroupItem>
            <Link
              getProps={getNavLinkProps({ matchPartial: false })}
              to={getUrlForResource({
                page: "tenant",
                params: { tenantId: tenant.id },
              })}
            >
              {tenant.name}
            </Link>
          </NavGroupItem>
        )}
      </NavGroup>
      {tenant && (
        <NavGroup>
          <NavGroupItem>
            <Link
              getProps={getNavLinkProps({ matchPartial: true })}
              to={getUrlForResource({
                page: "narrative list",
                params: { tenantId: tenant.id },
              })}
            >
              Collections
            </Link>
          </NavGroupItem>
        </NavGroup>
      )}
    </NavContainer>
  );
};

export default observer(SiteNavigation);
