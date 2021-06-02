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
import React, { useCallback } from "react";
import { track } from "../analytics";
import { isNarrativeTypeId, NarrativeTypeId } from "../contentApi/types";
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
  ExternalNavLink,
  FEEDBACK_URL,
  NavButton,
  ShareButtonProps,
} from "./shared";

const SiteNavigation: React.FC<ShareButtonProps> = ({ openShareModal }) => {
  const { tenant } = useDataStore();

  const narrativeOptions: DropdownOption[] = [];

  const goToNarrative = useCallback(
    (narrativeTypeId: NarrativeTypeId) => {
      if (tenant) {
        navigate(
          getUrlForResource({
            page: "narrative",
            params: { tenantId: tenant.id, narrativeTypeId },
          })
        );
      }
    },
    [tenant]
  );

  if (tenant) {
    Object.values(tenant.systemNarratives).forEach((narrative) => {
      if (narrative) {
        narrativeOptions.push({
          id: narrative.id,
          label: narrative.title,
        });
      }
    });
    if (tenant.racialDisparitiesNarrative) {
      narrativeOptions.push({
        id: "RacialDisparities",
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
            <NavGroupItem>
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
                buttonKind="link"
                label="Data Narratives"
                onChange={(id) => {
                  // in practice this should never happen; if it does,
                  // most likely an error has been made in this component
                  // in preparing the options data for this menu
                  if (!isNarrativeTypeId(id)) {
                    throw new Error(
                      "Unable to navigate: narrative type not recognized"
                    );
                  }

                  track("narrative_menu_link_clicked", {
                    category: "navigation",
                    label: id,
                  });
                  goToNarrative(id);
                }}
                options={narrativeOptions}
              />
            </NavGroupItem>
          )}
          <NavGroupItem>
            <ExternalNavLink href={FEEDBACK_URL}>Feedback</ExternalNavLink>
          </NavGroupItem>
          <NavGroupItem>
            <NavButton onClick={openShareModal}>Share</NavButton>
          </NavGroupItem>
        </NavGroup>
      </NavBar>
    </NavContainer>
  );
};

export default observer(SiteNavigation);
