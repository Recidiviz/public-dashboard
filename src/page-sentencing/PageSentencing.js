import React from "react";
import DetailPage from "../detail-page";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import VizSentencePopulation from "../viz-sentence-population";
import VizSentenceTypes from "../viz-sentence-types";
import { PATHS, ALL_PAGES, SECTION_TITLES } from "../constants";

export default function PageSentencing() {
  const { apiData, isLoading } = useChartData("us_nd/sentencing");

  if (isLoading) {
    return <Loading />;
  }

  const TITLE = ALL_PAGES.get(PATHS.sentencing);
  const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`;

  const SECTIONS = [
    {
      title: SECTION_TITLES[PATHS.sentencing].population,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
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
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
      showDimensionControl: true,
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSentenceTypes,
      vizData: {
        sentenceTypes: apiData.sentence_type_by_district_by_demographics,
        locations: apiData.judicial_districts,
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
