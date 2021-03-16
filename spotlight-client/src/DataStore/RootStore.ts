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

import { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { computed, makeObservable } from "mobx";
import TenantStore from "./TenantStore";
import UiStore from "./UiStore";
import UserStore from "./UserStore";

/**
 * Returns the auth settings configured for the current environment, if any.
 */
export function getAuthSettings(): Auth0ClientOptions | undefined {
  // NOTE: there is no production auth requirement!
  if (process.env.REACT_APP_AUTH_ENV === "development") {
    return {
      domain: "spotlight-login-staging.recidiviz.org",
      client_id: "ID9plpd8j4vaUin9rPTGxWlJoknSkDX1",
      redirect_uri: `${window.location.origin}`,
    };
  }
  return undefined;
}

/**
 * Returns the status of the auth requirement flag for the current environment.
 */
export function isAuthEnabled(): boolean {
  return process.env.REACT_APP_AUTH_ENABLED === "true";
}

export default class RootStore {
  tenantStore: TenantStore;

  uiStore: UiStore;

  userStore: UserStore;

  constructor() {
    makeObservable(this, { tenant: computed, narrative: computed });

    this.tenantStore = new TenantStore({ rootStore: this });

    this.uiStore = new UiStore({ rootStore: this });

    this.userStore = new UserStore({
      authSettings: getAuthSettings(),
      isAuthRequired: isAuthEnabled(),
      rootStore: this,
    });
  }

  get tenant(): TenantStore["currentTenant"] {
    return this.tenantStore.currentTenant;
  }

  get narrative(): TenantStore["currentNarrative"] {
    return this.tenantStore.currentNarrative;
  }
}
