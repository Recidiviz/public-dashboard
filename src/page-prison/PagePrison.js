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
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;

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
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
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
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
        tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
        ipsum dui gravida.`,
      showDimensionControl: true,
      VizComponent: VizPrisonReasons,
      vizData: {
        incarcerationReasons:
          apiData.incarceration_population_by_admission_reason,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].terms,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
        tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
        ipsum dui gravida.`,
      showDimensionControl: true,
      VizComponent: VizSentenceLengths,
      vizData: {
        sentenceLengths: apiData.incarceration_lengths_by_demographics,
      },
    },
    {
      title: SECTION_TITLES[PATHS.prison].releases,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
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
