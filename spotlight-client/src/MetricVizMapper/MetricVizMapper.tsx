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

import React from "react";
import Metric from "../contentModels/Metric";
import HistoricalPopulationBreakdownMetric from "../contentModels/HistoricalPopulationBreakdownMetric";
import VizHistoricalPopulationBreakdown from "../VizHistoricalPopulationBreakdown";
import { MetricRecord } from "../contentModels/types";
import PopulationBreakdownByLocationMetric from "../contentModels/PopulationBreakdownByLocationMetric";
import VizPopulationBreakdownByLocation from "../VizPopulationBreakdownByLocation";
import DemographicsByCategoryMetric from "../contentModels/DemographicsByCategoryMetric";
import VizDemographicsByCategory from "../VizDemographicsByCategory";
import VizPrisonStayLengths from "../VizPrisonStayLengths";
import RecidivismRateMetric from "../contentModels/RecidivismRateMetric";
import VizRecidivismRateSingleFollowup from "../VizRecidivismRateSingleFollowup";
import SentenceTypeByLocationMetric from "../contentModels/SentenceTypeByLocationMetric";
import VizSentenceTypeByLocation from "../VizSentenceTypeByLocation";
import VizRecidivismRateCumulative from "../VizRecidivismRateCumulative";
import SupervisionSuccessRateMetric from "../contentModels/SupervisionSuccessRateMetric";
import VizSupervisionSuccessRate from "../VizSupervisionSuccessRate";
import ProgramParticipationCurrentMetric from "../contentModels/ProgramParticipationCurrentMetric";
import VizProgramParticipationCurrent from "../VizProgramParticipationCurrent";
import HistoricalPopulationByCategoryMetric from "../contentModels/HistoricalPopulationByCategoryMetric";
import VizHistoricalPopulationByCategory from "../VizHistoricalPopulationByCategory";
import CategoriesByDemographicMetric from "../contentModels/CategoriesByDemographicMetric";
import VizCategoriesByDemographic from "../VizCategoriesByDemographic";
import RateByCategoryAndDemographicsMetric from "../contentModels/RateByCategoryAndDemographicsMetric";
import VizRateByCategoryAndDemographics from "../VizRateByCategoryAndDemographics";

type MetricVizMapperProps = {
  metric: Metric<MetricRecord> | undefined;
  preview?: boolean;
};

const MetricVizMapper: React.FC<MetricVizMapperProps> = ({
  metric,
  preview,
}) => {
  if (metric instanceof HistoricalPopulationBreakdownMetric) {
    return (
      <VizHistoricalPopulationBreakdown preview={preview} metric={metric} />
    );
  }
  if (metric instanceof PopulationBreakdownByLocationMetric) {
    return (
      <VizPopulationBreakdownByLocation preview={preview} metric={metric} />
    );
  }
  if (metric instanceof DemographicsByCategoryMetric) {
    if (metric.id === "PrisonStayLengthAggregate") {
      return <VizPrisonStayLengths metric={metric} />;
    }
    return <VizDemographicsByCategory preview={preview} metric={metric} />;
  }
  if (metric instanceof RecidivismRateMetric) {
    if (metric.id === "PrisonRecidivismRateSingleFollowupHistorical") {
      return <VizRecidivismRateSingleFollowup metric={metric} />;
    }
    return <VizRecidivismRateCumulative metric={metric} />;
  }
  if (metric instanceof SentenceTypeByLocationMetric) {
    return <VizSentenceTypeByLocation metric={metric} />;
  }
  if (metric instanceof SupervisionSuccessRateMetric) {
    return <VizSupervisionSuccessRate metric={metric} />;
  }
  if (metric instanceof ProgramParticipationCurrentMetric) {
    return <VizProgramParticipationCurrent preview={preview} metric={metric} />;
  }
  if (metric instanceof HistoricalPopulationByCategoryMetric) {
    return <VizHistoricalPopulationByCategory metric={metric} />;
  }
  if (metric instanceof CategoriesByDemographicMetric) {
    return <VizCategoriesByDemographic metric={metric} />;
  }
  if (metric instanceof RateByCategoryAndDemographicsMetric) {
    return <VizRateByCategoryAndDemographics metric={metric} />;
  }

  // there are no other metric types, so this should only be reached when developing new ones
  throw new Error("unknown metric type");
};

export default MetricVizMapper;
