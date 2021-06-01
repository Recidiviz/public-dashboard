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

import { NarrativeTypeId } from "../contentApi/types";

const { analytics } = window;

const isTrackingActive = process.env.NODE_ENV !== "development";

function getAnalyticsDebugProperties() {
  return {
    debug: {
      url: window.location.href,
      title: document.title,
    },
  };
}

export function pageview(): void {
  if (isTrackingActive) {
    analytics.page();
  } else {
    // eslint-disable-next-line
    console.log(
      `[Analytics] Tracking pageview: ${JSON.stringify(
        getAnalyticsDebugProperties()
      )}`
    );
  }
}

type EventCategory = "navigation";

type EventProperties = {
  /**
   * Corresponds to Event Category field in Google Analytics
   */
  category?: EventCategory;
  /**
   * Corresponds to Event Label field in Google Analytics
   */
  label?: string;

  [key: string]: string | undefined;
};

export function track(
  eventName: "advance_section_link_clicked",
  properties: { category: "navigation"; label: string }
): void;
export function track(
  eventName: "direct_section_link_clicked",
  properties: { category: "navigation"; label: string }
): void;
export function track(
  eventName: "narrative_body_link_clicked",
  properties: { category: "navigation"; label: NarrativeTypeId }
): void;
export function track(
  eventName: "narrative_menu_link_clicked",
  properties: { category: "navigation"; label: NarrativeTypeId }
): void;
export function track(eventName: string, properties: EventProperties): void {
  if (isTrackingActive) {
    analytics.track(eventName, properties);
  } else {
    // eslint-disable-next-line
    console.log(
      `[Analytics] Tracking event name: ${eventName}, with metadata: ${JSON.stringify(
        { ...properties, ...getAnalyticsDebugProperties() }
      )}`
    );
  }
}
