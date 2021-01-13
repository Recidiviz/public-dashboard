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

type MetricMappingFactoryOptions = {
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
  metadataMapping,
  tenantId,
}: MetricMappingFactoryOptions): MetricMapping {
  const metricMapping: MetricMapping = {};

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
    // this big ol' switch statement ensures that the type ID string union is properly narrowed,
    // allowing for 1:1 correspondence between the ID and the typed Metric instance.
    switch (metricType) {
      case "SentencePopulationCurrent":
        metricMapping[metricType] = new PopulationBreakdownByLocationMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: sentencePopulationCurrent,
          sourceFileName: "sentence_type_by_district_by_demographics",
        });
        break;
      case "SentenceTypesCurrent":
        metricMapping[metricType] = new SentenceTypeByLocationMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: sentenceTypesCurrent,
          sourceFileName: "sentence_type_by_district_by_demographics",
        });
        break;
      case "PrisonPopulationCurrent":
        metricMapping[metricType] = new PopulationBreakdownByLocationMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: prisonPopulationCurrent,
          sourceFileName:
            "incarceration_population_by_facility_by_demographics",
        });
        break;
      case "ProbationPopulationCurrent":
        metricMapping[metricType] = new PopulationBreakdownByLocationMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: probationPopulationCurrent,
          sourceFileName: "supervision_population_by_district_by_demographics",
        });
        break;
      case "ParolePopulationCurrent":
        metricMapping[metricType] = new PopulationBreakdownByLocationMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: parolePopulationCurrent,
          sourceFileName: "supervision_population_by_district_by_demographics",
        });
        break;
      case "PrisonPopulationHistorical":
        metricMapping[metricType] = new HistoricalPopulationBreakdownMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: prisonPopulationHistorical,
          sourceFileName: "incarceration_population_by_month_by_demographics",
        });
        break;
      case "ProbationPopulationHistorical":
        metricMapping[metricType] = new HistoricalPopulationBreakdownMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: probationPopulationHistorical,
          sourceFileName: "supervision_population_by_month_by_demographics",
        });
        break;
      case "ParolePopulationHistorical":
        metricMapping[metricType] = new HistoricalPopulationBreakdownMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: parolePopulationHistorical,
          sourceFileName: "supervision_population_by_month_by_demographics",
        });
        break;
      case "ProbationProgrammingCurrent":
        metricMapping[metricType] = new ProgramParticipationCurrentMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: probationProgramParticipationCurrent,
          sourceFileName: "active_program_participation_by_region",
        });
        break;
      case "ParoleProgrammingCurrent":
        metricMapping[metricType] = new ProgramParticipationCurrentMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: paroleProgramParticipationCurrent,
          sourceFileName: "active_program_participation_by_region",
        });
        break;
      case "ProbationSuccessHistorical":
        metricMapping[metricType] = new SupervisionSuccessRateMonthlyMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: probationSuccessRateMonthly,
          sourceFileName: "supervision_success_by_month",
        });
        break;
      case "ParoleSuccessHistorical":
        metricMapping[metricType] = new SupervisionSuccessRateMonthlyMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: paroleSuccessRateMonthly,
          sourceFileName: "supervision_success_by_month",
        });
        break;
      case "ProbationSuccessAggregate":
        metricMapping[
          metricType
        ] = new SupervisionSuccessRateDemographicsMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: probationSuccessRateDemographics,
          sourceFileName: "supervision_success_by_period_by_demographics",
        });
        break;
      case "ParoleSuccessAggregate":
        metricMapping[
          metricType
        ] = new SupervisionSuccessRateDemographicsMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: paroleSuccessRateDemographics,
          sourceFileName: "supervision_success_by_period_by_demographics",
        });
        break;
      case "ProbationRevocationsAggregate":
        metricMapping[metricType] = new DemographicsByCategoryMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: probationRevocationReasons,
          sourceFileName:
            "supervision_revocations_by_period_by_type_by_demographics",
        });
        break;
      case "ParoleRevocationsAggregate":
        metricMapping[metricType] = new DemographicsByCategoryMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: paroleRevocationReasons,
          sourceFileName:
            "supervision_revocations_by_period_by_type_by_demographics",
        });
        break;
      case "PrisonAdmissionReasonsCurrent":
        metricMapping[metricType] = new DemographicsByCategoryMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: prisonAdmissionReasons,
          sourceFileName: "incarceration_population_by_admission_reason",
        });
        break;
      case "PrisonReleaseTypeAggregate":
        metricMapping[metricType] = new DemographicsByCategoryMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: prisonReleaseTypes,
          sourceFileName: "incarceration_releases_by_type_by_period",
        });
        break;
      case "PrisonRecidivismRateHistorical":
        metricMapping[metricType] = new RecidivismRateMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: recidivismRateAllFollowup,
          sourceFileName: "recidivism_rates_by_cohort_by_year",
        });
        break;
      case "PrisonRecidivismRateSingleFollowupHistorical":
        metricMapping[metricType] = new RecidivismRateMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: recidivismRateConventionalFollowup,
          sourceFileName: "recidivism_rates_by_cohort_by_year",
        });
        break;
      case "PrisonStayLengthAggregate":
        metricMapping[metricType] = new DemographicsByCategoryMetric({
          ...metadata,
          id: metricType,
          tenantId,
          dataTransformer: prisonStayLengths,
          sourceFileName: "incarceration_lengths_by_demographics",
        });
        break;
      default:
        assertNever(metricType);
    }
  });

  return metricMapping;
}
