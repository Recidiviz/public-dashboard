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

import { navigate } from "@reach/router";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import { Dropdown } from "../UiLibrary";
import { DropdownOption } from "../UiLibrary/Dropdown/types";
import BrandMark from "./BrandMark";
import {
  NavBar,
  NavContainer,
  NavGroup,
  NavGroupItem,
  NavLink,
} from "./shared";

const SiteNavigation: React.FC = () => {
  const { tenant } = useDataStore();

  const narrativeOptions: DropdownOption[] = [];

  if (tenant) {
    Object.values(tenant.systemNarratives).forEach((narrative) => {
      if (narrative) {
        narrativeOptions.push({
          id: getUrlForResource({
            page: "narrative",
            params: { tenantId: tenant.id, narrativeTypeId: narrative.id },
          }),
          label: narrative.title,
        });
      }
    });
    if (tenant.racialDisparitiesNarrative) {
      narrativeOptions.push({
        id: getUrlForResource({
          page: "narrative",
          params: { tenantId: tenant.id, narrativeTypeId: "RacialDisparities" },
        }),
        label: tenant.racialDisparitiesNarrative.title,
      });
    }
  }

  return (
    <NavContainer>
      <NavBar>
        <NavGroup>
          <NavGroupItem>
            <NavLink to={getUrlForResource({ page: "home" })}>
              <BrandMark />
            </NavLink>
          </NavGroupItem>
          {tenant && (
            <NavGroupItem style={{ marginLeft: rem(24) }}>
              <NavLink
                to={getUrlForResource({
                  page: "tenant",
                  params: { tenantId: tenant.id },
                })}
              >
                {tenant.name}
              </NavLink>
            </NavGroupItem>
          )}
        </NavGroup>
        <NavGroup>
          {narrativeOptions.length > 0 && (
            <NavGroupItem>
              <Dropdown
                label="Data Narratives"
                onChange={(id) => navigate(id)}
                options={narrativeOptions}
              />
            </NavGroupItem>
          )}
        </NavGroup>
      </NavBar>
    </NavContainer>
  );
};

export default observer(SiteNavigation);
