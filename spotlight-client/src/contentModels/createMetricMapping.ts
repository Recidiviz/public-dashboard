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

import { assertNever } from "assert-never";
import {
  MetricTypeIdList,
  RidersMetricTypeIdList,
  TenantContent,
  TenantId,
} from "../contentApi/types";
import {
  parolePopulationCurrent,
  parolePopulationHistorical,
  paroleProgramParticipationCurrent,
  paroleRevocationReasons,
  paroleSuccessRateDemographics,
  paroleSuccessRateMonthly,
  paroleTerminationRateDemographics,
  paroleTerminationRateMonthly,
  prisonAdmissionReasons,
  prisonPopulationCurrent,
  prisonPopulationHistorical,
  prisonReleaseTypes,
  prisonStayLengths,
  probationPopulationCurrent,
  probationPopulationHistorical,
  probationProgramParticipationCurrent,
  probationRevocationReasons,
  probationSuccessRateDemographics,
  probationSuccessRateMonthly,
  RawMetricData,
  recidivismRateAllFollowup,
  recidivismRateConventionalFollowup,
  riderAdmissionReasons,
  riderCurrentPopulation,
  riderPopulationHistorical,
  riderRateByCategoryAndDemographics,
  sentencePopulationCurrent,
  sentenceTypesCurrent,
} from "../metricsApi";
import { MetricMapping } from "./types";
import DemographicsByCategoryMetric from "./DemographicsByCategoryMetric";
import HistoricalPopulationBreakdownMetric from "./HistoricalPopulationBreakdownMetric";
import PopulationBreakdownByLocationMetric from "./PopulationBreakdownByLocationMetric";
import ProgramParticipationCurrentMetric from "./ProgramParticipationCurrentMetric";
import RecidivismRateMetric from "./RecidivismRateMetric";
import SentenceTypeByLocationMetric from "./SentenceTypeByLocationMetric";
import SupervisionSuccessRateMetric from "./SupervisionSuccessRateMetric";
import HistoricalPopulationByCategoryMetric from "./HistoricalPopulationByCategoryMetric";
import CategoriesByDemographicMetric from "./CategoriesByDemographicMetric";
import { ERROR_MESSAGES } from "../constants";
import { NOFILTER_KEY, TOTAL_KEY } from "../demographics";
import { colors } from "../UiLibrary";
import RootStore from "../DataStore/RootStore";
import RateByCategoryAndDemographicsMetric from "./RateByCategoryAndDemographicsMetric";

type MetricMappingFactoryOptions = {
  localityLabelMapping?: TenantContent["localities"];
  metadataMapping: TenantContent["metrics"];
  topologyMapping?: TenantContent["topologies"];
  tenantId: TenantId;
  demographicFilter?: TenantContent["demographicCategories"];
  rootStore?: RootStore;
};
/**
 * Factory function for converting a mapping of content objects by metric ID
 * to a mapping of Metric instances by metric ID. Creating the entire mapping at once
 * ensures that each ID maps to the proper Metric type without requiring further
 * type guarding on the part of consumers.
 */
export default function createMetricMapping({
  localityLabelMapping,
  metadataMapping,
  topologyMapping,
  tenantId,
  demographicFilter,
  rootStore,
}: MetricMappingFactoryOptions): MetricMapping {
  const metricMapping: MetricMapping = new Map();

  // to maintain type safety we iterate through all of the known metrics;
  // iterating through the metadata object's keys widens the type to `string`,
  // which prevents us from guaranteeing exhaustiveness at the type level
  [...MetricTypeIdList, ...RidersMetricTypeIdList].forEach((metricType) => {
    // not all metrics are required; metadata object is the source of truth
    // for which metrics to include
    const metadata = metadataMapping[metricType];
    if (!metadata) {
      return;
    }

    // messages for errors we may hit at various points below
    const topologyContentError = `${ERROR_MESSAGES.missingRequiredContent} (map topology)`;
    const localityContentError = `${ERROR_MESSAGES.missingRequiredContent} (locality labels)`;
    const totalLabelError = `${ERROR_MESSAGES.missingRequiredContent} (total population label)`;

    // this big ol' switch statement ensures that the type ID string union is properly narrowed,
    // allowing for 1:1 correspondence between the ID and the typed Metric instance.
    switch (metricType) {
      case "SentencePopulationCurrent":
        if (!localityLabelMapping?.Sentencing)
          throw new Error(localityContentError);

        if ("totalLabel" in metadata)
          metricMapping.set(
            metricType,
            new PopulationBreakdownByLocationMetric({
              ...metadata,
              demographicFilter,
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Sentencing,
              dataTransformer: sentencePopulationCurrent,
              sourceFileName: "sentence_type_by_district_by_demographics",
              rootStore,
            })
          );
        else throw new Error(totalLabelError);

        break;
      case "SentenceTypesCurrent":
        if (!localityLabelMapping?.Sentencing)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SentenceTypeByLocationMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Sentencing,
            dataTransformer: sentenceTypesCurrent,
            sourceFileName: "sentence_type_by_district_by_demographics",
            rootStore,
          })
        );
        break;
      case "PrisonPopulationCurrent":
        if (!localityLabelMapping?.Prison)
          throw new Error(localityContentError);

        if ("totalLabel" in metadata)
          metricMapping.set(
            metricType,
            new PopulationBreakdownByLocationMetric({
              ...metadata,
              demographicFilter,
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Prison,
              dataTransformer: prisonPopulationCurrent,
              sourceFileName:
                "incarceration_population_by_facility_by_demographics",
              rootStore,
            })
          );
        else throw new Error(totalLabelError);
        break;
      case "CommunityCorrectionsPopulationCurrent":
        if (!localityLabelMapping?.CommunityCorrections)
          throw new Error(localityContentError);

        if ("totalLabel" in metadata)
          metricMapping.set(
            metricType,
            new PopulationBreakdownByLocationMetric({
              ...metadata,
              demographicFilter,
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.CommunityCorrections,
              dataTransformer: prisonPopulationCurrent,
              sourceFileName:
                "community_corrections_population_by_facility_by_demographics",
              rootStore,
            })
          );
        else throw new Error(totalLabelError);
        break;
      case "ProbationPopulationCurrent":
        if (!localityLabelMapping?.Probation)
          throw new Error(localityContentError);
        if ("totalLabel" in metadata)
          metricMapping.set(
            metricType,
            new PopulationBreakdownByLocationMetric({
              ...metadata,
              demographicFilter,
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Probation,
              dataTransformer: probationPopulationCurrent,
              sourceFileName:
                "supervision_population_by_district_by_demographics",
              rootStore,
            })
          );
        else throw new Error(totalLabelError);
        break;
      case "ParolePopulationCurrent":
        if (!localityLabelMapping?.Parole)
          throw new Error(localityContentError);
        if ("totalLabel" in metadata)
          metricMapping.set(
            metricType,
            new PopulationBreakdownByLocationMetric({
              ...metadata,
              demographicFilter,
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Parole,
              dataTransformer: parolePopulationCurrent,
              sourceFileName:
                "supervision_population_by_district_by_demographics",
              rootStore,
            })
          );
        else throw new Error(totalLabelError);
        break;
      case "PrisonPopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationBreakdownMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonPopulationHistorical,
            sourceFileName: "incarceration_population_by_month_by_demographics",
            rootStore,
          })
        );
        break;
      case "ProbationPopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationBreakdownMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: probationPopulationHistorical,
            sourceFileName: "supervision_population_by_month_by_demographics",
            rootStore,
          })
        );
        break;
      case "ParolePopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationBreakdownMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: parolePopulationHistorical,
            sourceFileName: "supervision_population_by_month_by_demographics",
            rootStore,
          })
        );
        break;
      case "ProbationProgrammingCurrent":
        if (!localityLabelMapping?.ProgramRegions)
          throw new Error(localityContentError);

        if (!topologyMapping?.ProgramRegions)
          throw new Error(topologyContentError);

        metricMapping.set(
          metricType,
          new ProgramParticipationCurrentMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: NOFILTER_KEY,
            localityLabels: localityLabelMapping.ProgramRegions,
            mapData: topologyMapping?.ProgramRegions,
            dataTransformer: probationProgramParticipationCurrent,
            sourceFileName: "active_program_participation_by_region",
            rootStore,
          })
        );
        break;
      case "ParoleProgrammingCurrent":
        if (!localityLabelMapping?.ProgramRegions)
          throw new Error(localityContentError);

        if (!topologyMapping?.ProgramRegions)
          throw new Error(topologyContentError);

        metricMapping.set(
          metricType,
          new ProgramParticipationCurrentMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: NOFILTER_KEY,
            localityLabels: localityLabelMapping.ProgramRegions,
            mapData: topologyMapping?.ProgramRegions,
            dataTransformer: paroleProgramParticipationCurrent,
            sourceFileName: "active_program_participation_by_region",
            rootStore,
          })
        );
        break;
      case "ProbationSuccessHistorical":
        if (!localityLabelMapping?.Probation)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Probation,
            dataTransformer: probationSuccessRateMonthly,
            sourceFileName: "supervision_success_by_month",
            demographicDataTransformer: probationSuccessRateDemographics,
            demographicSourceFileName:
              "supervision_success_by_period_by_demographics",
            rootStore,
          })
        );
        break;
      case "ParoleSuccessHistorical":
        if (!localityLabelMapping?.Parole)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Parole,
            dataTransformer: paroleSuccessRateMonthly,
            sourceFileName: "supervision_success_by_month",
            demographicDataTransformer: paroleSuccessRateDemographics,
            demographicSourceFileName:
              "supervision_success_by_period_by_demographics",
            rootStore,
          })
        );
        break;
      case "ParoleTerminationsHistorical":
        if (!localityLabelMapping?.Parole)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Parole,
            dataTransformer: paroleTerminationRateMonthly,
            sourceFileName: "supervision_terminations_by_month",
            demographicDataTransformer: paroleTerminationRateDemographics,
            demographicSourceFileName:
              "supervision_terminations_by_period_by_demographics",
            rootStore,
          })
        );
        break;
      case "ProbationRevocationsAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: probationRevocationReasons,
            sourceFileName:
              "supervision_revocations_by_period_by_type_by_demographics",
            rootStore,
          })
        );
        break;
      case "ParoleRevocationsAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: paroleRevocationReasons,
            sourceFileName:
              "supervision_revocations_by_period_by_type_by_demographics",
            rootStore,
          })
        );
        break;
      case "PrisonAdmissionReasonsCurrent":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: (rawRecords: RawMetricData) => {
              let fieldMapping;

              if ("fieldMapping" in metadata) {
                fieldMapping = metadata.fieldMapping;
              }
              return prisonAdmissionReasons(rawRecords, fieldMapping);
            },
            sourceFileName: "incarceration_population_by_admission_reason",
            rootStore,
          })
        );
        break;
      case "PrisonReleaseTypeAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonReleaseTypes,
            sourceFileName: "incarceration_releases_by_type_by_period",
            rootStore,
          })
        );
        break;
      case "PrisonRecidivismRateHistorical":
        metricMapping.set(
          metricType,
          new RecidivismRateMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: recidivismRateAllFollowup,
            sourceFileName: "recidivism_rates_by_cohort_by_year",
            rootStore,
          })
        );
        break;
      case "PrisonRecidivismRateSingleFollowupHistorical":
        metricMapping.set(
          metricType,
          new RecidivismRateMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            followUpYears: 3,
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: recidivismRateConventionalFollowup,
            sourceFileName: "recidivism_rates_by_cohort_by_year",
            rootStore,
          })
        );
        break;
      case "PrisonStayLengthAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonStayLengths,
            sourceFileName: "incarceration_lengths_by_demographics",
            color: colors.dataVizNamed.teal,
            rootStore,
          })
        );
        break;
      case "RidersPopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationByCategoryMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: riderPopulationHistorical,
            sourceFileName: "rider_term_average_population",
            rootStore,
          })
        );
        break;
      case "RidersPopulationCurrent":
        metricMapping.set(
          metricType,
          new CategoriesByDemographicMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "raceOrEthnicity",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: riderCurrentPopulation,
            sourceFileName: "rider_term_current_population",
            rootStore,
          })
        );
        break;
      case "RidersOriginalCharge":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: riderAdmissionReasons,
            sourceFileName: "rider_offense",
            rootStore,
          })
        );
        break;
      case "RidersReincarcerationRate":
        metricMapping.set(
          metricType,
          new RateByCategoryAndDemographicsMetric({
            ...metadata,
            demographicFilter,
            id: metricType,
            tenantId,
            defaultDemographicView: "raceOrEthnicity",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: riderRateByCategoryAndDemographics,
            sourceFileName: "rider_reincarceration_rates",
            rootStore,
          })
        );
        break;

      default:
        assertNever(metricType);
    }
  });

  return metricMapping;
}
