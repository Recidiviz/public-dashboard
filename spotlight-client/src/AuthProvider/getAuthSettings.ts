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

type Auth0Settings = {
  domain: string;
  clientId: string;
};

let AUTH_SETTINGS: Auth0Settings | undefined;

// NOTE: there is no production auth requirement!
if (process.env.REACT_APP_AUTH_ENV === "development") {
  AUTH_SETTINGS = {
    domain: "spotlight-login-staging.recidiviz.org",
    clientId: "ID9plpd8j4vaUin9rPTGxWlJoknSkDX1",
  };
}

/**
 * Returns the auth settings configured for the current environment, if any.
 */
export default function getAuthSettings(): typeof AUTH_SETTINGS {
  return AUTH_SETTINGS;
}
