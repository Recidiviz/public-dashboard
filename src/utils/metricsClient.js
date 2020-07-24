// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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
 * An asynchronous function that returns a promise which will eventually return the results from
 * invoking the given API endpoint. Takes in the |endpoint| as a string and the |getTokenSilently|
 * function, which will be used to authenticate the client against the API.
 */
async function callMetricsApi(endpoint) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/${endpoint}`
    );

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * A convenience function returning whether or not the client is still awaiting what it needs to
 * display results to the user.
 */
function awaitingResults(awaitingApi) {
  return awaitingApi;
}

export { callMetricsApi, awaitingResults };
