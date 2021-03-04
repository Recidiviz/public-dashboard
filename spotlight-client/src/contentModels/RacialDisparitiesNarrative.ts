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

import mapValues from "lodash.mapvalues";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { TenantId } from "../contentApi/types";
import { RaceIdentifier } from "../demographics";
import { fetchAndTransformMetric } from "../metricsApi";
import {
  CountsForSupervisionType,
  createRacialDisparitiesRecords,
  RacialDisparitiesRecord,
  RevocationCountKeyList,
} from "../metricsApi/RacialDisparitiesRecord";

const getCorrectionsRateCurrent = (record: RacialDisparitiesRecord) => {
  return record.currentTotalSentencedCount / record.totalStatePopulation;
};

const getTotalRevocationsCount = (record: CountsForSupervisionType) =>
  RevocationCountKeyList.reduce(
    (total, currentKey) => total + record[currentKey],
    0
  );

type RevocationProportions = Record<
  | "absconsionProportion36Mo"
  | "newCrimeProportion36Mo"
  | "technicalProportion36Mo"
  | "unknownProportion36Mo",
  number
>;

const getRevocationTypeProportions = (record: CountsForSupervisionType) => {
  const totalRevocations = getTotalRevocationsCount(record);
  return RevocationCountKeyList.reduce(
    (mapping, currentKey) => ({
      ...mapping,
      [currentKey.replace("Count", "Proportion")]:
        record[currentKey] / totalRevocations,
    }),
    {} as RevocationProportions
  );
};

type RecordsMapping = { [key in RaceIdentifier]: RacialDisparitiesRecord };

type SentencingMetrics = {
  incarcerationPctCurrent: number;
  probationPctCurrent: number;
};

type SupervisionType = "parole" | "probation" | "supervision";

function getSentencingMetrics(
  record: RacialDisparitiesRecord
): SentencingMetrics {
  const totalSentencedCurrent = record.currentTotalSentencedCount;

  const incarcerationPctCurrent =
    (record.currentIncarcerationSentenceCount +
      record.currentDualSentenceCount) /
    totalSentencedCurrent;

  const probationPctCurrent =
    (record.currentProbationSentenceCount + record.currentDualSentenceCount) /
    totalSentencedCurrent;

  return {
    incarcerationPctCurrent,
    probationPctCurrent,
  };
}

type ConstructorOpts = {
  tenantId: TenantId;
  defaultCategory?: RaceIdentifier;
  defaultSupervisionType?: SupervisionType;
};

export default class RacialDisparitiesNarrative {
  // metadata
  readonly title = "Racial Disparities";

  readonly tenantId: TenantId;

  // API data
  isLoading?: boolean;

  private records?: RecordsMapping;

  error?: Error;

  // filters
  selectedCategory: RaceIdentifier;

  supervisionType: SupervisionType;

  static build(props: ConstructorOpts): RacialDisparitiesNarrative {
    return new RacialDisparitiesNarrative(props);
  }

  constructor({
    tenantId,
    defaultCategory,
    defaultSupervisionType,
  }: ConstructorOpts) {
    this.tenantId = tenantId;
    this.selectedCategory = defaultCategory || "BLACK";
    this.supervisionType = defaultSupervisionType || "supervision";

    makeAutoObservable<RacialDisparitiesNarrative, "records">(this, {
      records: observable.ref,
    });
  }

  /**
   * Fetches metric data and stores the result reactively on this Metric instance.
   */
  async hydrate(): Promise<void> {
    this.isLoading = true;
    try {
      const fetchedData = await fetchAndTransformMetric({
        sourceFileName: "racial_disparities",
        tenantId: this.tenantId,
        transformFn: createRacialDisparitiesRecords,
      });
      runInAction(() => {
        this.records = fetchedData.reduce((mapping, record) => {
          return { ...mapping, [record.raceOrEthnicity]: record };
        }, {} as RecordsMapping);
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
        this.error = e;
      });
    }
  }

  get likelihoodVsWhite():
    | undefined
    | {
        [key in Extract<
          RaceIdentifier,
          "BLACK" | "HISPANIC" | "AMERICAN_INDIAN_ALASKAN_NATIVE"
        >]: number;
      } {
    const { records } = this;
    if (records === undefined) return undefined;

    const correctionsRates = mapValues(records, (record) =>
      getCorrectionsRateCurrent(record)
    );

    const getSentenceLikelihood = (category: RaceIdentifier) =>
      correctionsRates[category] / correctionsRates.ALL;

    const whiteLikelihood = getSentenceLikelihood("WHITE");

    return {
      BLACK: getSentenceLikelihood("BLACK") / whiteLikelihood,
      HISPANIC: getSentenceLikelihood("HISPANIC") / whiteLikelihood,
      AMERICAN_INDIAN_ALASKAN_NATIVE:
        getSentenceLikelihood("AMERICAN_INDIAN_ALASKAN_NATIVE") /
        whiteLikelihood,
    };
  }

  get beforeCorrections():
    | undefined
    | { populationPctCurrent: number; correctionsPctCurrent: number } {
    const { records, selectedCategory } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    const total = records.ALL;

    const populationPctCurrent =
      selected.totalStatePopulation / total.totalStatePopulation;

    const correctionsPctCurrent =
      selected.currentTotalSentencedCount / total.currentTotalSentencedCount;

    return {
      populationPctCurrent,
      correctionsPctCurrent,
    };
  }

  get sentencing(): undefined | SentencingMetrics {
    const { records, selectedCategory } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    return getSentencingMetrics(selected);
  }

  get sentencingOverall(): undefined | SentencingMetrics {
    const { records } = this;
    if (records === undefined) return undefined;
    return getSentencingMetrics(records.ALL);
  }

  get releasesToParole():
    | undefined
    | {
        paroleReleaseProportion36Mo: number;
        prisonPopulationProportion36Mo: number;
      } {
    const { records, selectedCategory } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    const total = records.ALL;

    const paroleReleaseProportion36Mo =
      selected.parole.releaseCount36Mo / total.parole.releaseCount36Mo;

    const prisonPopulationProportion36Mo =
      selected.totalIncarceratedPopulation36Mo /
      total.totalIncarceratedPopulation36Mo;

    return { paroleReleaseProportion36Mo, prisonPopulationProportion36Mo };
  }

  get programming():
    | undefined
    | {
        participantProportionCurrent: number;
        supervisionProportionCurrent: number;
      } {
    const { records, selectedCategory } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    const total = records.ALL;

    const participantProportionCurrent =
      selected.currentFtrParticipationCount /
      total.currentFtrParticipationCount;

    const supervisionProportionCurrent =
      selected.currentSupervisionPopulation /
      total.currentSupervisionPopulation;

    return { participantProportionCurrent, supervisionProportionCurrent };
  }

  get supervision():
    | undefined
    | (RevocationProportions &
        Record<
          "populationProportion36Mo" | "revocationProportion36Mo",
          number
        >) {
    const { records, selectedCategory, supervisionType } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory][supervisionType];
    const total = records.ALL[supervisionType];

    const populationProportion36Mo =
      selected.totalPopulation36Mo / total.totalPopulation36Mo;

    const revocationProportion36Mo =
      getTotalRevocationsCount(selected) / getTotalRevocationsCount(total);

    return {
      populationProportion36Mo,
      revocationProportion36Mo,
      ...getRevocationTypeProportions(selected),
    };
  }

  get supervisionOverall(): undefined | RevocationProportions {
    const { records, supervisionType } = this;
    if (records === undefined) return undefined;

    const total = records.ALL[supervisionType];
    return getRevocationTypeProportions(total);
  }
}
