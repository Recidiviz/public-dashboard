import React from "react";
import supervisionPopulationData from "../assets/test_data/US_ND_supervision_population_by_district_by_demographics.json";
import judicialDistricts from "../assets/test_data/US_ND_judicial_districts.json";
import { SUPERVISION_TYPES } from "../constants";
import DetailPage from "../detail-page";
import VizProbationPopulation from "../viz-probation-population";

const recordIsProbation = (record) =>
  record.supervision_type === SUPERVISION_TYPES.probation;

const TITLE = "Probation";
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;

const SECTIONS = [
  {
    title: "Who is on probation?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
    showLocationControl: true,
    locationControlLabel: "Judicial District",
    VizComponent: VizProbationPopulation,
    vizData: {
      populationDemographics: supervisionPopulationData.filter(
        recordIsProbation
      ),
      locations: judicialDistricts,
    },
  },
];

export default function PageProbation() {
  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
