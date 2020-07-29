import React from "react";
import DetailPage from "../detail-page";
import { formatLocation, recordIsMetricPeriodMonths } from "../utils";
import useChartData from "../hooks/useChartData";
import VizPrisonPopulation from "../viz-prison-population";
import VizPrisonReleases from "../viz-prison-releases";
import VizPrisonReasons from "../viz-prison-reasons";
import VizSentenceLengths from "../viz-sentence-lengths";

const TITLE = "Prison";
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;

export default function PagePrison() {
  const { apiData, isLoading } = useChartData("us_nd/prison");

  if (isLoading) {
    return null;
  }

  const facilityLocations = formatLocation({
    locations: apiData.incarceration_facilities,
    idFn: (record) => `${record.facility}`,
    labelFn: (record) => record.name,
  });

  const SECTIONS = [
    {
      title: "Who is in prison?",
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
      title: "How did they get there?",
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
      title: "How long are they there?",
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
      title: "Where do they go from there?",
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
