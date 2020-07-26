import React from "react";
import DetailPage from "../detail-page";
import useChartData from "../hooks/useChartData";
import VizSentenceTypes from "../viz-sentence-types";
import VizSentenceLengths from "../viz-sentence-lengths";

import VizSentencePopulation from "../viz-sentence-population";

export default function PageSentencing() {
  const { apiData, isLoading } = useChartData("us_nd/sentencing");

  if (isLoading) {
    return null;
  }

  const sentenceTypeByDistrictByDemographics =
    apiData.sentence_type_by_district_by_demographics;
  const populatedDistricts = new Set(
    sentenceTypeByDistrictByDemographics.map((record) => record.district)
  );
  const districtIsPopulated = (record) => populatedDistricts.has(record.id);

  const TITLE = "Sentencing";
  const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`;

  const SECTIONS = [
    {
      title: "Who is being sentenced?",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSentencePopulation,
      vizData: {
        populationDemographics: sentenceTypeByDistrictByDemographics,
        locations: apiData.judicial_districts.filter(districtIsPopulated),
      },
    },

    {
      title: "What types of sentences do people receive?",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
      showDimensionControl: true,
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSentenceTypes,
      vizData: {
        sentenceTypes: sentenceTypeByDistrictByDemographics,
        locations: apiData.judicial_districts,
      },
    },
    {
      title: "How long do they serve?",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
      showDimensionControl: true,
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSentenceLengths,
      vizData: {
        sentenceLengths: apiData.sentence_lengths_by_district_by_demographics,
        locations: apiData.judicial_districts,
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
