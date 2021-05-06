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

import { group } from "d3-array";
import flatten from "flat";
import mapValues from "lodash/mapValues";
import pick from "lodash/pick";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { upperCaseFirst } from "upper-case-first";
import { REVOCATION_TYPE_LABELS, SENTENCE_TYPE_LABELS } from "../constants";
import {
  RacialDisparitiesChartLabels,
  RacialDisparitiesNarrativeContent,
  RacialDisparitiesSections,
  RacialDisparitiesSection,
  TenantId,
  DemographicCategoryFilter,
} from "../contentApi/types";
import {
  createDemographicCategories,
  RaceIdentifier,
  RaceOrEthnicityCategory,
} from "../demographics";
import { fetchAndTransformMetric } from "../metricsApi";
import {
  CountsForSupervisionType,
  createRacialDisparitiesRecords,
  RacialDisparitiesRecord,
  RevocationCountKeyList,
} from "../metricsApi/RacialDisparitiesRecord";
import { colors } from "../UiLibrary";
import { formatAsPct } from "../utils";
import calculatePct from "./calculatePct";
import downloadData from "./downloadData";
import { DemographicCategoryRecords, Hydratable } from "./types";

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

export const SupervisionTypeList = [
  "supervision",
  "parole",
  "probation",
] as const;
export type SupervisionType = typeof SupervisionTypeList[number];

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

const getRoundedPct = (number: number) => Number(number.toFixed(2));

/**
 * Given two numbers between 0 and 1, rounds them to two decimal places, compares them,
 * and returns the result in natural language; i.e., "greater", "smaller", or "similar"
 */
const comparePercentagesAsString = (subject: number, base: number) => {
  const roundedSubject = getRoundedPct(subject);
  const roundedBase = getRoundedPct(base);

  if (roundedSubject > roundedBase) {
    return "greater";
  }
  if (roundedSubject < roundedBase) {
    return "smaller";
  }
  return "similar";
};

type SectionData =
  | RacialDisparitiesSection
  | (RacialDisparitiesSection & {
      chartData: DemographicCategoryRecords[];
      supervisionFilter?: boolean;
      download: () => Promise<void>;
    });

export type TemplateVariables = {
  [key: string]: string | TemplateVariables;
};

type ConstructorOpts = {
  tenantId: TenantId;
  defaultCategory?: RaceIdentifier;
  content: RacialDisparitiesNarrativeContent;
  categoryFilter?: DemographicCategoryFilter["raceOrEthnicity"];
};

/**
 * Data model for the racial disparities narrative, which handles computation
 * as well as fetching. The preferred method for instantiating this class is
 * to use the static `build` method.
 * @example
 *
 * ```js
 * const narrative = RacialDisparitiesNarrative.build(props);
 * ```
 */
export default class RacialDisparitiesNarrative implements Hydratable {
  // metadata
  readonly id = "RacialDisparities";

  readonly title = "Racial Disparities";

  readonly introduction: string;

  readonly introductionMethodology: string;

  readonly sectionText: RacialDisparitiesSections;

  readonly chartLabels: RacialDisparitiesChartLabels;

  readonly tenantId: TenantId;

  private readonly focusColor = colors.dataVizNamed.blue;

  private readonly unfocusedColor = colors.dataVizNamed.paleBlue;

  // API data
  isLoading?: boolean;

  private records?: RecordsMapping;

  error?: Error;

  // filters
  readonly allCategories: RaceOrEthnicityCategory[];

  selectedCategory: RaceIdentifier;

  readonly supervisionTypeList: SupervisionType[];

  supervisionType: SupervisionType;

  static build(props: ConstructorOpts): RacialDisparitiesNarrative {
    return new RacialDisparitiesNarrative(props);
  }

  constructor({
    tenantId,
    defaultCategory,
    content,
    categoryFilter,
  }: ConstructorOpts) {
    this.tenantId = tenantId;
    this.selectedCategory = defaultCategory || "BLACK";
    this.supervisionTypeList = [
      ...(content.supervisionTypes || SupervisionTypeList),
    ];
    [this.supervisionType] = this.supervisionTypeList;
    this.chartLabels = content.chartLabels;
    this.introduction = content.introduction;
    this.introductionMethodology = content.introductionMethodology;
    this.sectionText = content.sections;
    this.allCategories = createDemographicCategories({
      raceOrEthnicity: categoryFilter,
    }).raceOrEthnicity;

    makeAutoObservable<RacialDisparitiesNarrative, "records">(this, {
      records: observable.ref,
      sectionText: false,
      allCategories: false,
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

  get selectedCategoryLabel(): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.allCategories.find(
      ({ identifier }) => identifier === this.selectedCategory
    )!.label;
  }

  get ethnonym(): string {
    const { selectedCategory, selectedCategoryLabel } = this;
    return selectedCategory === "OTHER"
      ? "people of other races"
      : `people who are ${selectedCategoryLabel}`;
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

  get populationDataSeries(): undefined | DemographicCategoryRecords[] {
    const { records, chartLabels, allCategories } = this;
    if (records === undefined) return undefined;

    const totalPopulation = {
      label: chartLabels.totalPopulation,
      records: calculatePct(
        allCategories.map(({ identifier, label }, index) => {
          return {
            label,
            color: colors.dataViz[index],
            value: records[identifier as RaceIdentifier].totalStatePopulation,
          };
        })
      ),
    };

    const correctionsPopulation = {
      label: chartLabels.totalSentenced,
      records: calculatePct(
        allCategories.map(({ identifier, label }, index) => {
          return {
            label,
            color: colors.dataViz[index],
            value:
              records[identifier as RaceIdentifier].currentTotalSentencedCount,
          };
        })
      ),
    };

    return [totalPopulation, correctionsPopulation];
  }

  get focusedPopulationDataSeries(): undefined | DemographicCategoryRecords[] {
    const {
      chartLabels,
      focusColor,
      populationDataSeries,
      selectedCategoryLabel,
      unfocusedColor,
    } = this;
    if (populationDataSeries === undefined) return undefined;

    return populationDataSeries.map((series) => {
      // merge all unselected categories into one
      const splitRecords = group(
        series.records,
        (record) => record.label === selectedCategoryLabel
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const focusedRecord = { ...splitRecords.get(true)![0] };
      focusedRecord.color = focusColor;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const otherRecord = splitRecords.get(false)!.reduce(
        (composite, currentRecord) => {
          return { ...composite, value: composite.value + currentRecord.value };
        },
        {
          label: chartLabels.otherGroups,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          color: unfocusedColor,
          value: 0,
          pct: 0,
        }
      );

      otherRecord.pct = 1 - focusedRecord.pct;

      return { ...series, records: [focusedRecord, otherRecord] };
    });
  }

  get revocationsDataSeries(): undefined | DemographicCategoryRecords[] {
    const { records, selectedCategory, supervisionType, ethnonym } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory][supervisionType];
    const total = records.ALL[supervisionType];

    const seriesRecords = [selected, total].map((supervisionCounts) => {
      return calculatePct([
        {
          label: REVOCATION_TYPE_LABELS.ABSCOND,
          color: colors.dataViz[0],
          value: supervisionCounts.absconsionCount36Mo,
        },
        {
          label: REVOCATION_TYPE_LABELS.NEW_CRIME,
          color: colors.dataViz[1],
          value: supervisionCounts.newCrimeCount36Mo,
        },
        {
          label: REVOCATION_TYPE_LABELS.TECHNICAL,
          color: colors.dataViz[2],
          value: supervisionCounts.technicalCount36Mo,
        },
        {
          label: REVOCATION_TYPE_LABELS.UNKNOWN,
          color: colors.dataViz[3],
          value: supervisionCounts.unknownCount36Mo,
        },
      ]);
    });

    return [
      {
        label: `Proportions of revocation reasons for ${ethnonym}`,
        records: seriesRecords[0],
      },
      {
        label: "Proportions of revocation reasons overall",
        records: seriesRecords[1],
      },
    ];
  }

  get paroleReleaseDataSeries(): undefined | DemographicCategoryRecords[] {
    const {
      chartLabels,
      focusColor,
      records,
      selectedCategory,
      selectedCategoryLabel,
      unfocusedColor,
    } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    const total = records.ALL;

    const paroleReleases = {
      label: chartLabels.paroleGrant,
      records: calculatePct([
        {
          label: selectedCategoryLabel,
          color: focusColor,
          value: selected.parole.releaseCount36Mo,
        },
        {
          label: chartLabels.otherGroups,
          color: unfocusedColor,
          value:
            total.parole.releaseCount36Mo - selected.parole.releaseCount36Mo,
        },
      ]),
    };

    const prisonPopulation = {
      label: chartLabels.incarceratedPopulation,
      records: calculatePct([
        {
          label: selectedCategoryLabel,
          color: focusColor,
          value: selected.totalIncarceratedPopulation36Mo,
        },
        {
          label: chartLabels.otherGroups,
          color: unfocusedColor,
          value:
            total.totalIncarceratedPopulation36Mo -
            selected.totalIncarceratedPopulation36Mo,
        },
      ]),
    };

    return [paroleReleases, prisonPopulation];
  }

  get programmingDataSeries(): undefined | DemographicCategoryRecords[] {
    const {
      chartLabels,
      focusColor,
      records,
      selectedCategory,
      selectedCategoryLabel,
      unfocusedColor,
    } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    const total = records.ALL;

    const programParticipants = {
      label: chartLabels.programmingParticipants,
      records: calculatePct([
        {
          label: selectedCategoryLabel,
          color: focusColor,
          value: selected.currentFtrParticipationCount,
        },
        {
          label: chartLabels.otherGroups,
          color: unfocusedColor,
          value:
            total.currentFtrParticipationCount -
            selected.currentFtrParticipationCount,
        },
      ]),
    };

    const supervisionPopulation = {
      label: chartLabels.supervisionPopulation,
      records: calculatePct([
        {
          label: selectedCategoryLabel,
          color: focusColor,
          value: selected.currentSupervisionPopulation,
        },
        {
          label: chartLabels.otherGroups,
          color: unfocusedColor,
          value:
            total.currentSupervisionPopulation -
            selected.currentSupervisionPopulation,
        },
      ]),
    };

    return [programParticipants, supervisionPopulation];
  }

  get sentencingDataSeries(): undefined | DemographicCategoryRecords[] {
    const { chartLabels, ethnonym, records, selectedCategory } = this;
    if (records === undefined) return undefined;

    const selected = records[selectedCategory];
    const total = records.ALL;

    const seriesRecords = [selected, total].map((record) => {
      return calculatePct([
        {
          label: SENTENCE_TYPE_LABELS.INCARCERATION,
          color: colors.dataViz[0],
          value: record.currentIncarcerationSentenceCount,
        },
        {
          label: SENTENCE_TYPE_LABELS.PROBATION,
          color: colors.dataViz[1],
          value: record.currentProbationSentenceCount,
        },
        {
          label: SENTENCE_TYPE_LABELS.DUAL_SENTENCE,
          color: colors.dataViz[2],
          value: record.currentDualSentenceCount,
        },
      ]);
    });

    return [
      { label: upperCaseFirst(ethnonym), records: seriesRecords[0] },
      {
        label: chartLabels.totalPopulationSentences,
        records: seriesRecords[1],
      },
    ];
  }

  get templateData(): TemplateVariables {
    const data: TemplateVariables = {
      ethnonym: this.ethnonym,
      ethnonymCapitalized: upperCaseFirst(this.ethnonym),
      supervisionType: this.supervisionType,
    };

    if (this.likelihoodVsWhite) {
      data.likelihoodVsWhite = mapValues(this.likelihoodVsWhite, (val) =>
        val.toFixed(1)
      );
    }

    (["beforeCorrections", "releasesToParole"] as const).forEach((key) => {
      if (this[key]) {
        data[key] = mapValues(this[key], formatAsPct);
      }
    });

    if (this.programming) {
      data.programming = {
        ...mapValues(this.programming, formatAsPct),
        comparison: comparePercentagesAsString(
          this.programming.participantProportionCurrent,
          this.programming.supervisionProportionCurrent
        ),
      };
    }

    if (this.sentencing && this.sentencingOverall) {
      data.sentencing = {
        ...mapValues(this.sentencing, formatAsPct),
        overall: mapValues(this.sentencingOverall, formatAsPct),
        comparison: comparePercentagesAsString(
          this.sentencing.incarcerationPctCurrent,
          this.sentencingOverall.incarcerationPctCurrent
        ),
      };
    }

    if (this.supervision && this.supervisionOverall) {
      data.supervision = {
        ...mapValues(this.supervision, formatAsPct),
        overall: mapValues(this.supervisionOverall, formatAsPct),
      };
    }

    return data;
  }

  get sections(): SectionData[] {
    const { sectionText } = this;
    const sections: SectionData[] = [];
    const {
      beforeCorrections,
      conclusion,
      programming,
      releasesToParole,
      supervision,
      sentencing,
    } = sectionText;
    if (beforeCorrections) {
      sections.push({
        ...beforeCorrections,
        chartData: this.focusedPopulationDataSeries,
        download: this.downloadPopulation,
      });
    }
    if (sentencing) {
      sections.push({
        ...sentencing,
        chartData: this.sentencingDataSeries,
        download: this.getDownloadFn({
          name: "sentencing",
          fieldsToInclude: [
            "currentIncarcerationSentenceCount",
            "currentProbationSentenceCount",
            "currentDualSentenceCount",
          ],
        }),
      });
    }
    if (releasesToParole) {
      sections.push({
        ...releasesToParole,
        chartData: this.paroleReleaseDataSeries,
        download: this.getDownloadFn({
          name: "parole grants",
          fieldsToInclude: [
            "parole.releaseCount36Mo",
            "totalIncarceratedPopulation36Mo",
          ],
        }),
      });
    }
    if (supervision) {
      sections.push({
        ...supervision,
        chartData: this.revocationsDataSeries,
        // TODO: only true if there are multiple types available
        supervisionFilter: true,
        download: this.getDownloadFn({
          name: "supervision",
          // TODO: limit to what's known to be available? or will that happen automatically
          fieldsToInclude: ["parole", "probation", "supervision"],
        }),
      });
    }
    if (programming) {
      sections.push({
        ...programming,
        chartData: this.programmingDataSeries,
        download: this.getDownloadFn({
          name: "programming",
          fieldsToInclude: [
            "currentFtrParticipationCount",
            "currentSupervisionPopulation",
          ],
        }),
      });
    }
    if (conclusion) {
      sections.push(conclusion);
    }
    return sections;
  }

  private getDownloadFn({
    name,
    fieldsToInclude,
  }: {
    name: string;
    fieldsToInclude: string[];
  }) {
    return (): Promise<void> =>
      downloadData({
        archiveName: `${this.tenantId} ${this.id} ${name}`,
        readmeContents: this.introductionMethodology,
        dataFiles: [
          {
            name: "data",
            data: Object.values(
              mapValues(this.records, (record) => {
                return flatten<Partial<typeof record>, Record<string, unknown>>(
                  pick(record, ["raceOrEthnicity", ...fieldsToInclude])
                );
              })
            ),
          },
        ],
      });
  }

  get downloadPopulation(): () => Promise<void> {
    return this.getDownloadFn({
      name: "population",
      fieldsToInclude: ["totalStatePopulation", "currentTotalSentencedCount"],
    });
  }
}
