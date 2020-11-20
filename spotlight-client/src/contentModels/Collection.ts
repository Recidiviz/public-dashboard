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

import { assertNever } from "assert-never";
import { CollectionTypeId, MetricTypeId } from "../contentApi/types";
import { MetricMap } from "./types";

type InitOptions = {
  name: string;
  description: string;
  metrics: MetricMap;
};

/**
 * Brings together a set of thematically related `Metric`s with collection-level
 * metadata. The recommended way to instantiate a `Collection` is with the
 * `createCollection` factory exported from this module; it contains all logic
 * needed for assembling known `Collection` kinds.
 */
export default class Collection {
  description: string;

  name: string;

  metrics: MetricMap;

  constructor({ name, description, metrics }: InitOptions) {
    this.name = name;
    this.description = description;
    this.metrics = metrics;
  }
}

function getMetricMapping({
  allMetrics,
  idsToInclude,
}: {
  allMetrics: MetricMap;
  idsToInclude: MetricTypeId[];
}): MetricMap {
  return new Map(
    idsToInclude
      .map((id) => [id, allMetrics.get(id)] as const)
      .filter(([id, metric]) => metric !== undefined)
  );
}

/**
 * Factory function for creating a `Collection` instance
 * of the kind specified by the `typeId` option.
 */
export function createCollection({
  name,
  description,
  metrics,
  typeId,
}: InitOptions & { typeId: CollectionTypeId }): Collection {
  let collectionMetrics;
  // each collection type corresponds to a specific set of Metrics
  // that we want to associate with this Collection instance
  switch (typeId) {
    case "Sentencing":
      collectionMetrics = getMetricMapping({
        idsToInclude: SentenceMetricIdList,
        allMetrics: metrics,
      });
      break;
    case "Prison":
      collectionMetrics = getMetricMapping({
        idsToInclude: PrisonMetricIdList,
        allMetrics: metrics,
      });
      break;
    case "Probation":
      collectionMetrics = getMetricMapping({
        idsToInclude: ProbationMetricIdList,
        allMetrics: metrics,
      });
      break;
    case "Parole":
      collectionMetrics = getMetricMapping({
        idsToInclude: ParoleMetricIdList,
        allMetrics: metrics,
      });
      break;
    default:
      assertNever(typeId);
  }

  const collection = new Collection({
    name,
    description,
    metrics: collectionMetrics,
  });

  // create reciprocal relationship from metrics to collection
  Array.from(collectionMetrics.values()).forEach((metric) => {
    if (metric) {
      metric.collections.set(typeId, collection);
    }
  });

  return collection;
}

const SentenceMetricIdList: MetricTypeId[] = [
  "SentencePopulationCurrent",
  "SentenceTypesCurrent",
];

const PrisonMetricIdList: MetricTypeId[] = [
  "PrisonAdmissionReasonsCurrent",
  "PrisonPopulationCurrent",
  "PrisonPopulationHistorical",
  "PrisonRecidivismRateHistorical",
  "PrisonRecidivismRateSingleFollowupHistorical",
  "PrisonReleaseTypeAggregate",
  "PrisonStayLengthAggregate",
];

const ProbationMetricIdList: MetricTypeId[] = [
  "ProbationPopulationCurrent",
  "ProbationPopulationHistorical",
  "ProbationProgrammingCurrent",
  "ProbationRevocationsAggregate",
  "ProbationSuccessHistorical",
];

const ParoleMetricIdList: MetricTypeId[] = [
  "ParolePopulationCurrent",
  "ParolePopulationHistorical",
  "ParoleProgrammingCurrent",
  "ParoleRevocationsAggregate",
  "ParoleSuccessHistorical",
];
