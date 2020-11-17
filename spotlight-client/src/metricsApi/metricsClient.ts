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

export type DataFile = Record<string, string>[];

type MetricsApiResponse = Record<string, DataFile | null>;

/**
 * An asynchronous function that returns a promise which will eventually return the results from
 * invoking the given API endpoint.
 */
export async function callMetricsApi({
  files,
}: {
  // TODO: should/can this signature be narrowed?
  files: string[];
}): Promise<MetricsApiResponse | null> {
  const response = await fetch(
    // TODO: this endpoint is still somewhat imaginary; consider it a realistic placeholder
    `${process.env.REACT_APP_API_URL}/api/public`,
    {
      body: JSON.stringify({
        files: files.map((filename) => `${filename}.json`),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  const responseData: MetricsApiResponse = await response.json();
  return responseData;
}

/**
 * A convenience function returning whether or not the client is still awaiting what it needs to
 * display results to the user.
 */
export function awaitingResults(awaitingApi: boolean): boolean {
  return awaitingApi;
}
