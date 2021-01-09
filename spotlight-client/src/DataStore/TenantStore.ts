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

import { makeAutoObservable } from "mobx";
import { SystemNarrativeTypeId, TenantId } from "../contentApi/types";
import type SystemNarrative from "../contentModels/SystemNarrative";
import Tenant, { createTenant } from "../contentModels/Tenant";
import type RootStore from "./RootStore";

export default class TenantStore {
  currentNarrativeTypeId?: SystemNarrativeTypeId;

  currentTenantId?: TenantId;

  rootStore: RootStore;

  tenants: Map<TenantId, Tenant>;

  constructor({ rootStore }: { rootStore: RootStore }) {
    makeAutoObservable(this, { rootStore: false });

    this.rootStore = rootStore;

    this.tenants = new Map();
  }

  /**
   * Retrieves the current tenant from the mapping of available tenants,
   * as indicated by this.currentTenantId.
   * Creates the Tenant on demand if it does not yet exist.
   */
  get currentTenant(): Tenant | undefined {
    if (!this.currentTenantId) return undefined;
    if (!this.tenants.has(this.currentTenantId)) {
      this.tenants.set(
        this.currentTenantId,
        createTenant({ tenantId: this.currentTenantId })
      );
    }
    return this.tenants.get(this.currentTenantId);
  }

  get currentNarrative(): SystemNarrative | undefined {
    if (!this.currentNarrativeTypeId || !this.currentTenant) return undefined;
    return this.currentTenant.systemNarratives[this.currentNarrativeTypeId];
  }
}
