// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

/**
 * Handler that will be called during the execution of a PreUserRegistration flow.
 *
 * @param {Event} event - Details about the context and user that is attempting to register.
 * @param {PreUserRegistrationAPI} api - Interface whose methods can be used to change the behavior of the signup.
 */
exports.onExecutePreUserRegistration = async (event, api) => {
  const domainToStateCodeMap = {
    "recidiviz.org": "recidiviz",
    // add authorized domains here
    // DO NOT COMMIT domains to version control
  };

  const emailSplit = event.user.email && event.user.email.split("@");
  const userDomain = emailSplit?.[emailSplit.length - 1].toLowerCase();
  if (userDomain) {
    /** Add user's state_code to the app_metadata */
    if (domainToStateCodeMap[userDomain]) {
      const stateCode = domainToStateCodeMap[userDomain];
      api.user.setAppMetadata("state_code", stateCode);
      return;
    }
  }
  // if we couldn't assign you a state code, you are not authorized
  api.access.deny(
    "email does not match list of approved domains",
    "Access denied"
  );
};
