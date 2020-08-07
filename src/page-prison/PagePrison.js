import React from "react";
import DetailPage from "../detail-page";
import { PATHS, ALL_PAGES, SECTION_TITLES } from "../constants";
import { formatLocation, recordIsMetricPeriodMonths } from "../utils";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import VizPrisonPopulation from "../viz-prison-population";
import VizPrisonReleases from "../viz-prison-releases";
import VizPrisonReasons from "../viz-prison-reasons";
import VizSentenceLengths from "../viz-sentence-lengths";

const TITLE = ALL_PAGES.get(PATHS.prison);
const DESCRIPTION = (
  <>
    People sentenced for a Class A misdemeanor or greater offense may serve
    their sentence in a DOCR prison or contract facility. Prisons run
    programming to help residents work towards rehabilitation and successful
    reentry.
  </>
);

export default function PagePrison() {
  const { apiData, isLoading } = useChartData("us_nd/prison");

  if (isLoading) {
    return <Loading />;
  }

  const facilityLocations = formatLocation({
    locations: apiData.incarceration_facilities,
    idFn: (record) => `${record.facility}`,
    labelFn: (record) => record.name,
  });

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
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
