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

import { ERROR_MESSAGES } from "../constants";
import { TenantId } from "../contentApi/types";

/**
 * All data comes back from the server as string values;
 * it will be up to us to cast those strings to other types as needed
 */
export type RawMetricData = Record<string, string>[];

type MetricsApiResponse = Record<string, RawMetricData | null>;
type ErrorAPIResponse = { error: string };

type FetchMetricOptions = {
  metricNames: string[];
  tenantId: TenantId;
};

/**
 * Retrieves the metric data provided for this application in the `/spotlight-api` package.
 */
export async function fetchMetrics({
  metricNames,
  tenantId,
}: FetchMetricOptions): Promise<MetricsApiResponse> {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/${tenantId}/public`,
    {
      body: JSON.stringify({
        metrics: metricNames,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  if (response.ok) {
    const responseData: MetricsApiResponse = await response.json();
    return responseData;
  }

  const errorResponse: ErrorAPIResponse = await response.json();
  throw new Error(
    `Metrics API responded with status ${response.status}. Error message: ${
      errorResponse.error || "none"
    }`
  );
}

/**
 * Implements the standard retrieval for a single metric:
 * fetches one metric, applies a transformation function to it,
 * and throws an error if no data could be fetched.
 */
export async function fetchAndTransformMetric<RecordFormat>({
  sourceFileName,
  tenantId,
  transformFn,
}: {
  sourceFileName: string;
  tenantId: TenantId;
  transformFn: (d: RawMetricData) => RecordFormat[];
}): Promise<RecordFormat[]> {
  const apiResponse = await fetchMetrics({
    metricNames: [sourceFileName],
    tenantId,
  });

  const rawData = apiResponse[sourceFileName];
  if (rawData) {
    return transformFn(rawData);
  }
  throw new Error(ERROR_MESSAGES.noMetricData);
}
