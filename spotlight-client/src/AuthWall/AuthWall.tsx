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

import { when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { withErrorBoundary } from "react-error-boundary";
import { ERROR_MESSAGES } from "../constants";
import ErrorMessage from "../ErrorMessage";
import Loading from "../Loading";
import { useRootStore } from "../StoreProvider";
import VerificationRequired from "../VerificationRequired";

/**
 * Verifies authorization before rendering its children.
 */
const AuthWall: React.FC = ({ children }) => {
  const { userStore } = useRootStore();

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => !userStore.isAuthorized,
        () => userStore.authorize()
      ),
    [userStore]
  );

  if (userStore.authError) {
    throw userStore.authError;
  }

  if (userStore.isLoading) {
    return <Loading />;
  }

  if (userStore.awaitingVerification) {
    return <VerificationRequired />;
  }

  if (userStore.isAuthorized) {
    return <>{children}</>;
  }

  // it should not actually be possible to reach this branch
  // with the current auth implementation, so something is
  // probably very wrong if a user hits it
  throw new Error(ERROR_MESSAGES.unauthorized);
};

export default withErrorBoundary(observer(AuthWall), {
  FallbackComponent: ErrorMessage,
});
