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

import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import isAuthEnabled from "../utils/isAuthEnabled";

type Auth0Settings = {
  domain: string;
  clientId: string;
};

const SHOULD_PROVIDE_AUTH = isAuthEnabled();

let AUTH_SETTINGS: Auth0Settings;

// NOTE: there is no production auth requirement!
if (process.env.REACT_APP_AUTH_ENV === "development") {
  AUTH_SETTINGS = {
    domain: "recidiviz-spotlight-staging.us.auth0.com",
    clientId: "ID9plpd8j4vaUin9rPTGxWlJoknSkDX1",
  };
}

/**
 * If auth is enabled for the current environment, wraps its children
 * in an Auth0Provider to enable the Auth0 React context.
 * If auth is disabled, renders its children unwrapped.
 */
const AuthProvider: React.FC = ({ children }) => {
  if (SHOULD_PROVIDE_AUTH && AUTH_SETTINGS) {
    return (
      <Auth0Provider
        domain={AUTH_SETTINGS.domain}
        clientId={AUTH_SETTINGS.clientId}
        redirectUri={window.location.href}
      >
        {children}
      </Auth0Provider>
    );
  }
  return <>{children}</>;
};

export default AuthProvider;
