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

import React, { useMemo, useState } from "react";
import DetailPage from "../detail-page";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import VizRecidivismRates from "../viz-recidivism-rates";
import VizSentencePopulation from "../viz-sentence-population";
import VizSentenceTypes from "../viz-sentence-types";
import { PATHS, ALL_PAGES, SECTION_TITLES, DIMENSION_KEYS } from "../constants";
import { CohortSelect, DimensionControl } from "../controls";
import { assignOrderedDatavizColor } from "../utils";

function getCohortOptions(data) {
  const cohortsFromData = new Set(data.map((d) => d.release_cohort));
  return [...cohortsFromData]
    .map((cohort) => ({
      id: cohort,
      label: cohort,
    }))
    .map(assignOrderedDatavizColor);
}

export default function PageSentencing() {
  const { apiData, isLoading } = useChartData("us_nd/sentencing");
  // lifted state for the recidivism section
  const cohortOptions = useMemo(
    () =>
      isLoading
        ? []
        : getCohortOptions(apiData.recidivism_rates_by_cohort_by_year),
    [apiData.recidivism_rates_by_cohort_by_year, isLoading]
  );
  const [selectedCohorts, setSelectedCohorts] = useState();
  const [highlightedCohort, setHighlightedCohort] = useState();

  // lifted state for the recidivism section
  const cohortOptions = useMemo(
    () =>
      isLoading
        ? []
        : getCohortOptions(apiData.recidivism_rates_by_cohort_by_year),
    [apiData.recidivism_rates_by_cohort_by_year, isLoading]
  );
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [highlightedCohort, setHighlightedCohort] = useState();
  const [recidivismDimension, setRecidivismDimension] = useState(
    DIMENSION_KEYS.total
  );

  if (isLoading) {
    return <Loading />;
  }

  const singleCohortSelected = selectedCohorts.length === 1;

  // doing this inside the render loop rather than in an effect
  // to prevent an intermediate state from flashing on the chart;
  // the current value check avoids an infinite render loop
  if (!singleCohortSelected && recidivismDimension !== DIMENSION_KEYS.total) {
    setRecidivismDimension(DIMENSION_KEYS.total);
  }

  const TITLE = ALL_PAGES.get(PATHS.sentencing);
  const DESCRIPTION = (
    <>
      When someone is convicted of a crime, they receive a sentence that is
      meant to correspond with facts, circumstances and the severity of the
      offense and the offender, to provide retribution to the victim and set a
      course for rehabilitation. The data below gives an overview of sentences
      for people who enter the North Dakota corrections system – that is, people
      who are sentenced to serve time in prison or on supervised probation.
    </>
  );

  const SECTIONS = [
    {
      title: SECTION_TITLES[PATHS.sentencing].population,
      description: (
        <>
          After being convicted of a Class A misdemeanor or greater offense by a
          district court, a person may be sentenced to time in prison or
          probation, at which point they come under the jurisdiction of the
          Department of Corrections and Rehabilitation (DOCR). These charts show
          everyone currently involved with the North Dakota DOCR.
        </>
      ),
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSentencePopulation,
      vizData: {
        populationDemographics:
          apiData.sentence_type_by_district_by_demographics,
        locations: apiData.judicial_districts,
      },
    },
    {
      title: SECTION_TITLES[PATHS.sentencing].types,
      description: (
        <>
          Sentences that lead to individuals coming under DOCR jurisdiction fall
          broadly into two categories: Probation and Incarceration.
        </>
      ),
      showDimensionControl: true,
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSentenceTypes,
      vizData: {
        sentenceTypes: apiData.sentence_type_by_district_by_demographics,
        locations: apiData.judicial_districts,
      },
    },
    {
      title: SECTION_TITLES[PATHS.sentencing].recidivism,
      description: (
        <>
          After release from prison, a significant proportion of formerly
          incarcerated folks end up back in prison. This is typically termed
          “recidivism.” The below graph shows recidivism as reincarceration;
          that is, the proportion of individuals who are incarcerated again at
          some point after their release.
        </>
      ),
      otherControls: (
        <>
          <CohortSelect
            options={cohortOptions}
            onChange={setSelectedCohorts}
            onHighlight={setHighlightedCohort}
          />
          <DimensionControl
            disabled={!singleCohortSelected}
            onChange={setRecidivismDimension}
            selectedId={recidivismDimension}
          />
        </>
      ),
      VizComponent: VizRecidivismRates,
      vizData: {
        dimension: recidivismDimension,
        highlightedCohort,
        recidivismRates: apiData.recidivism_rates_by_cohort_by_year,
        selectedCohorts,
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
