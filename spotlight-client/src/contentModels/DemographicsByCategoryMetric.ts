// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { DataSeries } from "../charts/types";
import { recordIsTotalByDimension } from "../demographics";
import { DemographicsByCategoryRecord } from "../metricsApi";
import Metric from "./Metric";

export default class DemographicsByCategoryMetric extends Metric<
  DemographicsByCategoryRecord
> {
  get records(): DemographicsByCategoryRecord[] | undefined {
    let recordsToReturn = this.getOrFetchRecords();
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );
    return recordsToReturn;
  }

  // eslint-disable-next-line class-methods-use-this
  get dataSeries(): DataSeries<DemographicsByCategoryRecord>[] | null {
    throw new Error("Method not implemented.");
  }
}
