import React from "react";
import DetailPage from "../detail-page";
// once the backend is in place, stop using these test files
import paroleOffices from "../assets/test_data/US_ND_site_offices.json";
import supervisionPopulationData from "../assets/test_data/US_ND_supervision_population_by_district_by_demographics.json";
import supervisionProgramParticipationByRegion from "../assets/test_data/US_ND_active_program_participation_by_region.json";
import supervisionRevocationByMonth from "../assets/test_data/US_ND_supervision_revocations_by_month_by_type_by_demographics.json";
import supervisionSuccessByMonth from "../assets/test_data/US_ND_supervision_success_by_month.json";
import supervisionSuccessDemographics from "../assets/test_data/US_ND_supervision_success_by_period_by_demographics.json";
import VizParolePopulation from "../viz-parole-population";
import VizParoleProgram from "../viz-parole-program";
import VizParoleRevocation from "../viz-parole-revocation";
import VizParoleSuccess from "../viz-parole-success";
import { SUPERVISION_TYPES } from "../constants";

const recordIsParole = (record) =>
  record.supervision_type === SUPERVISION_TYPES.parole;

const officeLocations = paroleOffices.map((record) => {
  return {
    // retain the original fields, which may be of use to viz components
    ...record,
    // transform office list into the format required for location controls
    id: `${record.district}`,
    label: record.site_name,
  };
});

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
    showLocationControl: true,
    locationControlLabel: "Office",
    VizComponent: VizParolePopulation,
    vizData: {
      populationDemographics: supervisionPopulationData.filter(recordIsParole),
      locations: officeLocations,
    },
  },
  {
    title: "What happens after parole?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    showDimensionControl: true,
    showLocationControl: true,
    locationControlLabel: "Office",
    VizComponent: VizParoleSuccess,
    vizData: {
      locations: officeLocations,
      successByMonth: supervisionSuccessByMonth.filter(recordIsParole),
      successByDemographics: supervisionSuccessDemographics
        .filter(recordIsParole)
        .filter((record) => record.metric_period_months === "36"),
    },
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
        recordIsParole
      ),
    },
  },
  {
    title: "Free Through Recovery Program",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
    tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
    ipsum dui gravida.`,
    VizComponent: VizParoleProgram,
    vizData: {
      paroleProgramParticipationByRegion: supervisionProgramParticipationByRegion.filter(
        recordIsParole
      ),
    },
  },
];

export default function PageParole() {
  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
