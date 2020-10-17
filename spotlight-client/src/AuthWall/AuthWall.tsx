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

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Loading from "../Loading";
import { getAuthSettings, isAuthEnabled } from "./utils";
import VerificationRequired from "../VerificationRequired";

/**
 * If auth is enabled for the current environment, wraps its children
 * in an Auth0Provider to enable the Auth0 React context.
 * If auth is disabled, renders its children unwrapped.
 */
const AuthProvider: React.FC<{ enabled: boolean }> = ({
  children,
  enabled,
}) => {
  const authSettings = getAuthSettings();

  return enabled && authSettings ? (
    <Auth0Provider
      domain={authSettings.domain}
      clientId={authSettings.clientId}
      redirectUri={window.location.href}
    >
      {children}
    </Auth0Provider>
  ) : (
    <>{children}</>
  );
};

/**
 * If enabled is true, requires that
 * the user is authenticated before rendering its children,
 * and redirects unauthenticated users to an Auth0 login domain.
 * Otherwise, it simply renders its children without intervention.
 */
const AuthChecker: React.FC<{ enabled: boolean }> = ({ children, enabled }) => {
  // providing a fallback because this hook may return undefined if auth0 is not enabled;
  // seems to mainly happen in the test environment
  const { isAuthenticated, isLoading, loginWithRedirect, user } =
    useAuth0() || {};

  if (enabled) {
    if (isLoading) {
      return <Loading />;
    }

    if (!isAuthenticated && loginWithRedirect) {
      loginWithRedirect();
      return <Loading />;
    }

    if (user && !user.email_verified) {
      return <VerificationRequired />;
    }
  }

  return <>{children}</>;
};

/**
 * If auth is enabled in the current environment, requires that
 * the user is authenticated before rendering its children,
 * and redirects unauthenticated users to an Auth0 login domain.
 * If auth is disabled, it simply renders its children without intervention.
 * MUST be a descendent of an AuthProvider.
 */
const AuthWall: React.FC = ({ children }) => {
  const enabled = isAuthEnabled();

  return (
    <AuthProvider enabled={enabled}>
      <AuthChecker enabled={enabled}>{children}</AuthChecker>
    </AuthProvider>
  );
};

export default AuthWall;
