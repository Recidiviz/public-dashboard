import React from "react";
import DetailPage from "../detail-page";
import judicialDistricts from "../assets/test_data/US_ND_judicial_districts.json";
import sentenceLengths from "../assets/test_data/US_ND_sentence_lengths_by_district_by_demographics.json";
import sentenceTypes from "../assets/test_data/US_ND_sentence_type_by_district_by_demographics.json";
import VizSentenceTypes from "../viz-sentence-types";
import VizSentenceLengths from "../viz-sentence-lengths";

const TITLE = "Sentencing";
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;

const SECTIONS = [
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
      sentenceTypes,
      locations: judicialDistricts,
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
      sentenceLengths,
      locations: judicialDistricts,
    },
  },
];

export default function PageSentencing() {
  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
