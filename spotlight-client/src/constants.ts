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

export const ERROR_MESSAGES = {
  auth0Configuration: "No Auth0 configuration found.",
  unauthorized: "You do not have permission to view this content.",
  noMetricData: "Unable to retrieve valid data for this metric.",
  missingRequiredContent:
    "Unable to create Metric because required content is missing.",
  disabledTenant: "This tenant has not been enabled.",
};

export const NAV_BAR_HEIGHT = 80;

export const FOOTER_HEIGHT = 130;

export const STATISTIC_THRESHOLD = 100;

export const REVOCATION_TYPE_LABELS = {
  ABSCOND: "Absconsion",
  NEW_CRIME: "New offense",
  TECHNICAL: "Technical violation",
  UNKNOWN: "Unknown type",
};

export const SENTENCE_TYPE_LABELS = {
  INCARCERATION: "Incarceration",
  PROBATION: "Probation",
  DUAL_SENTENCE: "Both",
};

export const AUTH0_APP_METADATA_KEY = "https://recidiviz.org/app_metadata";
export const DEFAULT_SELECTED_TAB = "Prison";

export const DEFAULT_CAROUSEL_INTERVAL = 5000;
