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
import { ascending } from "d3-array";
import DetailPage from "../detail-page";
import { PATHS, ALL_PAGES, SECTION_TITLES, DIMENSION_KEYS } from "../constants";
import {
  assignOrderedDatavizColor,
  formatLocation,
  recordIsMetricPeriodMonths,
  typecastRecidivismData,
} from "../utils";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import VizPopulationOverTime from "../viz-population-over-time";
import VizPrisonPopulation from "../viz-prison-population";
import VizPrisonReleases from "../viz-prison-releases";
import VizPrisonReasons from "../viz-prison-reasons";
import VizSentenceLengths from "../viz-sentence-lengths";
import { CohortSelect, DimensionControl, Dropdown } from "../controls";
import VizRecidivismRates from "../viz-recidivism-rates";
import VizRecidivismSingleFollowup from "../viz-recidivism-single-followup";

const TITLE = ALL_PAGES.get(PATHS.prison);
const DESCRIPTION = (
  <>
    People sentenced for a Class A misdemeanor or greater offense may serve
    their sentence in a DOCR prison or contract facility. Prisons run
    programming to help residents work towards rehabilitation and successful
    reentry.
  </>
);

function getCohortOptions(data) {
  const cohortsFromData = new Set(data.map((d) => d.releaseCohort));
  return [...cohortsFromData]
    .map((cohort) => ({
      id: cohort,
      label: cohort,
    }))
    .map(assignOrderedDatavizColor);
}

export default function PagePrison() {
  const { apiData, isLoading } = useChartData("us_nd/prison");

  // lifted state for the recidivism sections
  const recidivismRates = useMemo(
    () =>
      isLoading
        ? []
        : apiData.recidivism_rates_by_cohort_by_year
            .map(typecastRecidivismData)
            .sort((a, b) => {
              // hierarchical sort: cohort, then followup
              return (
                ascending(a.releaseCohort, b.releaseCohort) ||
                ascending(a.followupYears, b.followupYears)
              );
            }),
    [apiData.recidivism_rates_by_cohort_by_year, isLoading]
  );
  const cohortOptions = useMemo(
    () => (isLoading ? [] : getCohortOptions(recidivismRates)),
    [isLoading, recidivismRates]
  );
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [highlightedCohort, setHighlightedCohort] = useState();
  const [recidivismDimension, setRecidivismDimension] = useState(
    DIMENSION_KEYS.total
  );
  const [recidivismFollowupPeriod, setRecidivismFollowupPeriod] = useState("3");

  if (isLoading) {
    return <Loading />;
  }

  const facilityLocations = formatLocation({
    locations: apiData.incarceration_facilities,
    idFn: (record) => `${record.facility}`,
    labelFn: (record) => record.name,
  });

  const singleCohortSelected = selectedCohorts.length === 1;

  // doing this inside the render loop rather than in an effect
  // to prevent an intermediate state from flashing on the chart;
  // the current value check avoids an infinite render loop
  if (
    !singleCohortSelected &&
    // we don't need to reset the dimension if no cohorts are selected
    selectedCohorts.length > 1 &&
    recidivismDimension !== DIMENSION_KEYS.total
  ) {
    setRecidivismDimension(DIMENSION_KEYS.total);
  }

  const SECTIONS = [
    {
      title: SECTION_TITLES[PATHS.prison].population,
      description: (
        <>
          The North Dakota Department of Corrections and Rehabilitation (DOCR)
          runs a number of different facilities and contracts with facilities
          across the state.
        </>
      ),
      showLocationControl: true,
      locationControlLabel: "Facility",
      VizComponent: VizPrisonPopulation,
      vizData: {
        populationDemographics:
          apiData.incarceration_population_by_facility_by_demographics,
        locations: facilityLocations,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].overTime,
      description: (
        <>
          Broadly speaking, increased activity in earlier parts of the criminal
          justice system (such as arrests and sentencing) will result in
          increases in the prison population. Changes in sentence lengths,
          revocations from community supervision, etc. may also contribute to
          the rise and fall of this number.
        </>
      ),
      showDimensionControl: true,
      showTimeRangeControl: true,
      VizComponent: VizPopulationOverTime,
      vizData: {
        populationOverTime:
          apiData.incarceration_population_by_month_by_demographics,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].reasons,
      description: (
        <>
          There are many possible paths for someone to come to prison. “New
          Admission” represents someone being incarcerated for the first time as
          part of their sentence. “Revocation” represents when someone on
          probation or parole is sent to (or back to) prison.
        </>
      ),
      showDimensionControl: true,
      VizComponent: VizPrisonReasons,
      vizData: {
        incarcerationReasons:
          apiData.incarceration_population_by_admission_reason,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].terms,
      description: (
        <>
          Each person in prison has a court-decided sentence determining their
          maximum length of stay. The actual time that someone stays in prison
          can be reduced through good behavior credits and parole (discretionary
          decision by Parole Board). While North Dakota requires those convicted
          of violent offenses to remain in prison for at least 85 percent of
          their sentence, most people serve less time in prison than their
          maximum length of stay.
        </>
      ),
      showDimensionControl: true,
      VizComponent: VizSentenceLengths,
      vizData: {
        sentenceLengths: apiData.incarceration_lengths_by_demographics,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].releases,
      description: (
        <>
          Once released, the DOCR’s goal is to help citizens successfully
          reintegrate into their communities. In most cases, formerly
          incarcerated people will be placed on community parole or probation
          supervision.
        </>
      ),
      showDimensionControl: true,
      VizComponent: VizPrisonReleases,
      vizData: {
        releaseTypes: apiData.incarceration_releases_by_type_by_period.filter(
          recordIsMetricPeriodMonths(36)
        ),
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].recidivism,
      description: (
        <>
          After release from prison, a significant proportion of formerly
          incarcerated folks return to prison; this is typically termed
          “recidivism,” and typically includes all forms of reincarceration.
          Here, we can visualize the proportion of individuals released in a
          given year (i.e. a “cohort”) that return to prison up to ten years
          post-release.
          <p>
            <strong>Note:</strong> Race, Age, and Gender views are disabled
            unless a single Cohort is selected.
          </p>
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
        recidivismRates,
        selectedCohorts,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].recidivismSingleFollowup,
      description: (
        <>
          We can also observe how the recidivism rate for a given follow-up
          period changes over time. Typically, recidivism rates are calculated
          using a three year follow-up period (in other words, the proportion of
          individuals that return to prison within three years).
        </>
      ),
      otherControls: (
        <Dropdown
          label="Follow-up Period"
          onChange={setRecidivismFollowupPeriod}
          options={[
            // these are not in ascending order because we want 3 to be default
            // and Dropdown expects the default option to be the first one
            { id: "3", label: "3 Years" },
            { id: "5", label: "5 Years" },
            { id: "1", label: "1 Year" },
          ]}
          selectedId={recidivismFollowupPeriod}
        />
      ),
      showDimensionControl: true,
      VizComponent: VizRecidivismSingleFollowup,
      vizData: {
        followupYears: parseInt(recidivismFollowupPeriod),
        recidivismRates,
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
