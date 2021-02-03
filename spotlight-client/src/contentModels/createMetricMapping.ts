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
import { MetricTypeIdList, TenantContent, TenantId } from "../contentApi/types";
import {
  parolePopulationCurrent,
  parolePopulationHistorical,
  paroleProgramParticipationCurrent,
  paroleRevocationReasons,
  paroleSuccessRateDemographics,
  paroleSuccessRateMonthly,
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
  recidivismRateAllFollowup,
  recidivismRateConventionalFollowup,
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
import SupervisionSuccessRateDemographicsMetric from "./SupervisionSuccessRateDemographicsMetric";
import SupervisionSuccessRateMonthlyMetric from "./SupervisionSuccessRateMonthlyMetric";
import { ERROR_MESSAGES } from "../constants";
import { NOFILTER_KEY, TOTAL_KEY } from "../demographics";
import { colors } from "../UiLibrary";

type MetricMappingFactoryOptions = {
  localityLabelMapping: TenantContent["localities"];
  metadataMapping: TenantContent["metrics"];
  tenantId: TenantId;
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
  tenantId,
}: MetricMappingFactoryOptions): MetricMapping {
  const metricMapping: MetricMapping = new Map();

  // to maintain type safety we iterate through all of the known metrics;
  // iterating through the metadata object's keys widens the type to `string`,
  // which prevents us from guaranteeing exhaustiveness at the type level
  MetricTypeIdList.forEach((metricType) => {
    // not all metrics are required; metadata object is the source of truth
    // for which metrics to include
    const metadata = metadataMapping[metricType];
    if (!metadata) {
      return;
    }

    // messages for errors we may hit at various points below
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
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Sentencing,
              dataTransformer: sentencePopulationCurrent,
              sourceFileName: "sentence_type_by_district_by_demographics",
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
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Sentencing,
            dataTransformer: sentenceTypesCurrent,
            sourceFileName: "sentence_type_by_district_by_demographics",
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
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Prison,
              dataTransformer: prisonPopulationCurrent,
              sourceFileName:
                "incarceration_population_by_facility_by_demographics",
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
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Probation,
              dataTransformer: probationPopulationCurrent,
              sourceFileName:
                "supervision_population_by_district_by_demographics",
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
              id: metricType,
              tenantId,
              defaultDemographicView: NOFILTER_KEY,
              defaultLocalityId: TOTAL_KEY,
              localityLabels: localityLabelMapping.Parole,
              dataTransformer: parolePopulationCurrent,
              sourceFileName:
                "supervision_population_by_district_by_demographics",
            })
          );
        else throw new Error(totalLabelError);
        break;
      case "PrisonPopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationBreakdownMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonPopulationHistorical,
            sourceFileName: "incarceration_population_by_month_by_demographics",
          })
        );
        break;
      case "ProbationPopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationBreakdownMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: probationPopulationHistorical,
            sourceFileName: "supervision_population_by_month_by_demographics",
          })
        );
        break;
      case "ParolePopulationHistorical":
        metricMapping.set(
          metricType,
          new HistoricalPopulationBreakdownMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: parolePopulationHistorical,
            sourceFileName: "supervision_population_by_month_by_demographics",
          })
        );
        break;
      case "ProbationProgrammingCurrent":
        if (!localityLabelMapping?.Probation)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new ProgramParticipationCurrentMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: NOFILTER_KEY,
            localityLabels: localityLabelMapping.Probation,
            dataTransformer: probationProgramParticipationCurrent,
            sourceFileName: "active_program_participation_by_region",
          })
        );
        break;
      case "ParoleProgrammingCurrent":
        if (!localityLabelMapping?.Parole)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new ProgramParticipationCurrentMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: NOFILTER_KEY,
            localityLabels: localityLabelMapping.Parole,
            dataTransformer: paroleProgramParticipationCurrent,
            sourceFileName: "active_program_participation_by_region",
          })
        );
        break;
      case "ProbationSuccessHistorical":
        if (!localityLabelMapping?.Probation)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateMonthlyMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Probation,
            dataTransformer: probationSuccessRateMonthly,
            sourceFileName: "supervision_success_by_month",
          })
        );
        break;
      case "ParoleSuccessHistorical":
        if (!localityLabelMapping?.Parole)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateMonthlyMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: undefined,
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Parole,
            dataTransformer: paroleSuccessRateMonthly,
            sourceFileName: "supervision_success_by_month",
          })
        );
        break;
      case "ProbationSuccessAggregate":
        if (!localityLabelMapping?.Probation)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateDemographicsMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Probation,
            dataTransformer: probationSuccessRateDemographics,
            sourceFileName: "supervision_success_by_period_by_demographics",
          })
        );
        break;
      case "ParoleSuccessAggregate":
        if (!localityLabelMapping?.Parole)
          throw new Error(localityContentError);

        metricMapping.set(
          metricType,
          new SupervisionSuccessRateDemographicsMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: TOTAL_KEY,
            localityLabels: localityLabelMapping.Parole,
            dataTransformer: paroleSuccessRateDemographics,
            sourceFileName: "supervision_success_by_period_by_demographics",
          })
        );
        break;
      case "ProbationRevocationsAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: probationRevocationReasons,
            sourceFileName:
              "supervision_revocations_by_period_by_type_by_demographics",
          })
        );
        break;
      case "ParoleRevocationsAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: paroleRevocationReasons,
            sourceFileName:
              "supervision_revocations_by_period_by_type_by_demographics",
          })
        );
        break;
      case "PrisonAdmissionReasonsCurrent":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonAdmissionReasons,
            sourceFileName: "incarceration_population_by_admission_reason",
          })
        );
        break;
      case "PrisonReleaseTypeAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonReleaseTypes,
            sourceFileName: "incarceration_releases_by_type_by_period",
          })
        );
        break;
      case "PrisonRecidivismRateHistorical":
        metricMapping.set(
          metricType,
          new RecidivismRateMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: recidivismRateAllFollowup,
            sourceFileName: "recidivism_rates_by_cohort_by_year",
          })
        );
        break;
      case "PrisonRecidivismRateSingleFollowupHistorical":
        metricMapping.set(
          metricType,
          new RecidivismRateMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            followUpYears: 3,
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: recidivismRateConventionalFollowup,
            sourceFileName: "recidivism_rates_by_cohort_by_year",
          })
        );
        break;
      case "PrisonStayLengthAggregate":
        metricMapping.set(
          metricType,
          new DemographicsByCategoryMetric({
            ...metadata,
            id: metricType,
            tenantId,
            defaultDemographicView: "total",
            defaultLocalityId: undefined,
            localityLabels: undefined,
            dataTransformer: prisonStayLengths,
            sourceFileName: "incarceration_lengths_by_demographics",
            color: colors.dataVizNamed.get("teal"),
          })
        );
        break;
      default:
        assertNever(metricType);
    }
  });

  return metricMapping;
}
