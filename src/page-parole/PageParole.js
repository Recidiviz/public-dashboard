import React from "react";
import DetailPage from "../detail-page";
// once the backend is in place, stop using these untracked test files
// eslint-disable-next-line import/no-unresolved
import parolePopulationData from "../assets/test_data/US_ND_parole_population_by_district_by_demographics.json";
// eslint-disable-next-line import/no-unresolved
import paroleDistrictOffices from "../assets/test_data/US_ND_site_offices.json";
// eslint-disable-next-line import/no-unresolved
import supervisionRevocationByMonth from "../assets/test_data/US_ND_supervision_revocations_by_month_by_type_by_demographics.json";
import VizParolePopulation from "../viz-parole-population";
import VizParoleRevocation from "../viz-parole-revocation";
import { SUPERVISION_TYPES } from "../constants";

const TITLE = "Parole";
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
  tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
  ipsum dui gravida.`;
const SECTIONS = [
  {
    title: "Who is on parole?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDistrictControl: true,
    VizComponent: VizParolePopulation,
    vizData: {
      populationDemographics: parolePopulationData,
      districtOffices: paroleDistrictOffices,
    },
  },
  {
    title: "What happens after parole?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    VizComponent: () => null,
    vizData: {},
  },
  {
    title: "Why do revocations happen?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    showMonthControl: true,
    VizComponent: VizParoleRevocation,
    vizData: {
      paroleRevocationByMonth: supervisionRevocationByMonth.filter(
        (record) => record.supervision_type === SUPERVISION_TYPES.parole
      ),
    },
  },
  {
    title: "Free Through Recovery Program",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    VizComponent: () => null,
    vizData: {},
  },
];

export default function PageParole() {
  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
