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

import clamp from "lodash/clamp";
import { intercept, makeAutoObservable } from "mobx";
import { ERROR_MESSAGES } from "../constants";
import {
  isSystemNarrativeTypeId,
  NarrativeTypeId,
  TenantId,
} from "../contentApi/types";
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import type SystemNarrative from "../contentModels/SystemNarrative";
import Tenant, { createTenant } from "../contentModels/Tenant";
import type RootStore from "./RootStore";
import { getTenantFromDomain } from "./utils";

export default class TenantStore {
  currentNarrativeTypeId?: NarrativeTypeId;

  currentTenantId?: TenantId;

  private validatedSectionNumber?: number;

  rootStore: RootStore;

  tenants: Map<TenantId, Tenant>;

  constructor({ rootStore }: { rootStore: RootStore }) {
    makeAutoObservable(this, { rootStore: false });

    this.rootStore = rootStore;

    this.tenants = new Map();

    // tenant mapped from domain should be locked
    const tenantFromDomain = getTenantFromDomain();
    if (tenantFromDomain) {
      this.currentTenantId = tenantFromDomain;
      // returning null renders an observable property immutable
      intercept(this, "currentTenantId", () => null);
    }
  }

  /**
   * Whether or not the app is locked to a single state depends on the following factors:
   * - If the app is deployed to production:
   *   - Authentication is turned off. The app should be locked to the domain of the state that it's deployed on.
   * - If the app is deployed on staging:
   *   - Authentication is turned on. When a user logs in, we check for `state_code` in the account's `app_metadata`.
   *     - If the state_code matches one of our tenantIds, we lock the app to that state_code.
   *     - If there is no state_code, or it doesn't match any of our tenantIds, the user sees a "Page Not Found" error.
   *     - If the state_code is `recidiviz`, the app is unlocked.
   * -
   */
  get locked(): boolean {
    if (!this.rootStore.userStore.isAuthRequired) {
      return !!getTenantFromDomain();
    }
    return this.rootStore.userStore.stateCode !== "RECIDIVIZ";
  }

  /**
   * Retrieves the current tenant from the mapping of available tenants,
   * as indicated by this.currentTenantId.
   * Creates the Tenant on demand if it does not yet exist.
   */
  get currentTenant(): Tenant | undefined {
    if (!this.currentTenantId) return undefined;
    if (!this.tenants.has(this.currentTenantId)) {
      // if the tenant is not enabled, the caller will get undefined,
      // so they need to be prepared to handle that
      try {
        this.tenants.set(
          this.currentTenantId,
          createTenant({ tenantId: this.currentTenantId })
        );
      } catch (error) {
        if (!error.message.includes(ERROR_MESSAGES.disabledTenant)) {
          throw error;
        }
      }
    }
    return this.tenants.get(this.currentTenantId);
  }

  get currentNarrative():
    | SystemNarrative
    | RacialDisparitiesNarrative
    | undefined {
    const { currentNarrativeTypeId, currentTenant } = this;
    if (!currentNarrativeTypeId || !currentTenant) return undefined;

    if (isSystemNarrativeTypeId(currentNarrativeTypeId)) {
      return currentTenant.systemNarratives[currentNarrativeTypeId];
    }

    return currentTenant.racialDisparitiesNarrative;
  }

  /**
   * If there is a current narrative (all narratives have sections),
   * this will always be a number between 1 and the number of sections
   * to be displayed on the narrative page (which includes an introduction).
   */
  get currentSectionNumber(): number | undefined {
    if (!this.currentNarrative) return undefined;
    return this.validatedSectionNumber || 1;
  }

  set currentSectionNumber(value: number | undefined) {
    let validatedValue;
    if (this.currentNarrative) {
      validatedValue = 1;
      if (value) {
        validatedValue = clamp(
          value,
          1,
          // +1 for the intro
          this.currentNarrative.sections.length + 1
        );
      }
    }

    this.validatedSectionNumber = validatedValue;
  }
}
