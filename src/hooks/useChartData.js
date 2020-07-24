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

import { useState, useCallback, useEffect } from "react";
import logger from "../utils/logger";
import { callMetricsApi, awaitingResults } from "../utils/metricsClient";

function useChartData(url, file) {
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = useCallback(async () => {
    try {
      if (file) {
        const responseData = await callMetricsApi(`${url}/${file}`);
        setApiData(responseData[file]);
      } else {
        const responseData = await callMetricsApi(url);
        setApiData(responseData);
      }
      setAwaitingApi(false);
    } catch (error) {
      logger.error(error);
    }
  }, [file, url]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const isLoading = awaitingResults(awaitingApi);

  return { apiData, isLoading };
}

export default useChartData;
