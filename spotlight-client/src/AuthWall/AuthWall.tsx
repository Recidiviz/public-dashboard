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

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import isAuthEnabled from "../utils/isAuthEnabled";

const SHOULD_CHECK_AUTH = isAuthEnabled();

/**
 * If auth is enabled in the current environment, wraps its children
 * in the AuthWall to require authentication. If auth is disabled,
 * renders its children unwrapped.
 */
const AuthWallContainer: React.FC = ({ children }) => {
  // because AuthWall relies on hooks, we don't want to render it at all
  // if auth is not enabled in this environment
  if (SHOULD_CHECK_AUTH) {
    return <AuthWall>{children}</AuthWall>;
  }
  return <>{children}</>;
};

/**
 * Requires that the user is authenticated before rendering its children,
 * and redirects unauthenticated users to an Auth0 login domain.
 */
const AuthWall: React.FC = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return <>Loading...</>;
  }

  return <>{children}</>;
};

export default AuthWallContainer;