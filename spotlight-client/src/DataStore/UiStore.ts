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

import { makeAutoObservable, observable } from "mobx";
import type RootStore from "./RootStore";

export default class UiStore {
  rootStore: RootStore;

  tooltipMobileData?: Record<string, unknown>;

  renderTooltipMobile?: (props: Record<string, unknown>) => React.ReactNode;

  constructor({ rootStore }: { rootStore: RootStore }) {
    makeAutoObservable(this, {
      rootStore: false,
      tooltipMobileData: observable.ref,
      renderTooltipMobile: observable.ref,
    });

    this.rootStore = rootStore;
  }

  clearTooltipMobile(): void {
    this.tooltipMobileData = undefined;
    this.renderTooltipMobile = undefined;
  }

  /**
   * An easily watchable indicator of what page we're on
   * (because not all routes are necessarily pages)
   */
  get currentPageId(): string {
    const idParts: string[] = [];

    const { tenant, narrative } = this.rootStore;

    if (tenant) {
      idParts.push(tenant.id);

      if (narrative) {
        idParts.push(narrative.id);
      }
    }

    return idParts.join("::");
  }

  /**
   * Constructs an appropriate string for the `title` tag,
   * or returns undefined if the page is still loading and title cannot be determined yet
   */
  get currentPageTitle(): string | undefined {
    const titleParts: string[] = [];

    const { tenant, narrative } = this.rootStore;

    if (tenant) {
      titleParts.unshift(tenant.name);

      if (narrative) {
        titleParts.unshift(narrative.title);
      }
    }

    if (!titleParts.length) {
      // this is valid if we are on the site homepage;
      // otherwise it is an intermediate state that should not leak into reactions
      if (window.location.pathname !== "/") {
        return undefined;
      }
    }

    titleParts.push("Spotlight by Recidiviz");

    return titleParts.join(" — ");
  }
}
