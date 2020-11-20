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
import { CollectionTypeId } from "../contentApi/types";
import { MetricMap } from "./types";

type InitOptions = {
  name: string;
  description: string;
  metrics: MetricMap;
};

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
      collectionMetrics = new Map(
        SentenceMetricIdList.map((id) => [id, metrics.get(id)])
      );
      break;
    case "Prison":
      collectionMetrics = new Map(
        PrisonMetricIdList.map((id) => [id, metrics.get(id)])
      );
      break;
    case "Probation":
      collectionMetrics = new Map(
        ProbationMetricIdList.map((id) => [id, metrics.get(id)])
      );
      break;
    case "Parole":
      collectionMetrics = new Map(
        ParoleMetricIdList.map((id) => [id, metrics.get(id)])
      );
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

const SentenceMetricIdList = [
  "SentencePopulationCurrent",
  "SentenceTypesCurrent",
] as const;

const PrisonMetricIdList = [
  "PrisonAdmissionReasonsCurrent",
  "PrisonPopulationCurrent",
  "PrisonPopulationHistorical",
  "PrisonRecidivismRateHistorical",
  "PrisonRecidivismRateSingleFollowupHistorical",
  "PrisonReleaseTypeAggregate",
  "PrisonStayLengthAggregate",
] as const;

const ProbationMetricIdList = [
  "ProbationPopulationCurrent",
  "ProbationPopulationHistorical",
  "ProbationProgrammingCurrent",
  "ProbationRevocationsAggregate",
  "ProbationSuccessHistorical",
] as const;

const ParoleMetricIdList = [
  "ParolePopulationCurrent",
  "ParolePopulationHistorical",
  "ParoleProgrammingCurrent",
  "ParoleRevocationsAggregate",
  "ParoleSuccessHistorical",
] as const;
