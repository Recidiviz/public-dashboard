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

import { computed, makeObservable } from "mobx";
import {
  getDemographicCategories,
  recordIsTotalByDimension,
} from "../demographics";
import {
  recordMatchesLocality,
  SentenceTypeByLocationRecord,
} from "../metricsApi";
import Metric, { BaseMetricConstructorOptions } from "./Metric";

type GraphNode = {
  id: string;
};

type GraphEdge = {
  source: string;
  target: string;
  value: number;
};

export default class SentenceTypeByLocationMetric extends Metric<
  SentenceTypeByLocationRecord
> {
  constructor(
    props: BaseMetricConstructorOptions<SentenceTypeByLocationRecord>
  ) {
    super(props);

    makeObservable(this, { dataGraph: computed });
  }

  get records(): SentenceTypeByLocationRecord[] | undefined {
    let recordsToReturn = this.getOrFetchRecords();
    if (!recordsToReturn) return undefined;

    recordsToReturn = recordsToReturn.filter(
      recordMatchesLocality(this.localityId)
    );

    recordsToReturn = recordsToReturn.filter(
      recordIsTotalByDimension(this.demographicView)
    );

    return recordsToReturn;
  }

  get dataGraph():
    | { sources: GraphNode[]; targets: GraphNode[]; edges: GraphEdge[] }
    | undefined {
    const { demographicView, records } = this;
    if (!records || demographicView === "nofilter") return undefined;

    const sources = ["Incarceration", "Probation", "Both"];

    const categories = getDemographicCategories(demographicView);

    const edges = categories
      .map(({ identifier, label }) => {
        let record: SentenceTypeByLocationRecord | undefined;
        if (demographicView === "total") {
          // there's only one!
          [record] = records;
        } else {
          record = records.find((r) => r[demographicView] === identifier);
        }
        return [
          {
            source: sources[0],
            target: label,
            value: Number(record?.incarcerationCount) || 0,
          },
          {
            source: sources[1],
            target: label,
            value: Number(record?.probationCount) || 0,
          },
          {
            source: sources[2],
            target: label,
            value: Number(record?.dualSentenceCount) || 0,
          },
        ];
      })
      .reduce((flat, val) => flat.concat(val));

    return {
      sources: sources.map((name) => ({
        id: name,
      })),
      targets: categories.map(({ label }) => ({
        id: label,
      })),
      edges,
    };
  }
}
