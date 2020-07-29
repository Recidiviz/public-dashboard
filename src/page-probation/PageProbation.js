import React from "react";
import { SUPERVISION_TYPES } from "../constants";
import DetailPage from "../detail-page";
import { recordIsMetricPeriodMonths } from "../utils";
import useChartData from "../hooks/useChartData";
import VizProbationPopulation from "../viz-probation-population";
import VizSupervisionProgram from "../viz-supervision-program";
import VizSupervisionRevocation from "../viz-supervision-revocation";
import VizSupervisionSuccess from "../viz-supervision-success";

export default function PageProbation() {
  const { apiData, isLoading } = useChartData("us_nd/probation");

  if (isLoading) {
    return null;
  }

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
        populationDemographics: apiData.supervision_population_by_district_by_demographics.filter(
          recordIsProbation
        ),
        locations: apiData.judicial_districts,
      },
    },
    {
      title: "What happens after probation?",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
      showDimensionControl: true,
      showLocationControl: true,
      locationControlLabel: "Judicial District",
      VizComponent: VizSupervisionSuccess,
      vizData: {
        locations: apiData.judicial_districts,
        successByMonth: apiData.supervision_success_by_month.filter(
          recordIsProbation
        ),
        successByDemographics: apiData.supervision_success_by_period_by_demographics
          .filter(recordIsProbation)
          .filter(recordIsMetricPeriodMonths(36)),
      },
    },
    {
      title: "Why do revocations happen?",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
      showDimensionControl: true,
      VizComponent: VizSupervisionRevocation,
      vizData: {
        revocationsByDemographics: apiData.supervision_revocations_by_period_by_type_by_demographics
          .filter(recordIsProbation)
          .filter(recordIsMetricPeriodMonths(36)),
      },
    },
    {
      title: "Free Through Recovery Program",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vestibulum in finibus tellus, et ullamcorper augue. Quisque eleifend
      tortor vitae iaculis egestas. Donec dictum, nunc nec tincidunt cursus,
      ipsum dui gravida.`,
      VizComponent: VizSupervisionProgram,
      vizData: {
        supervisionProgramParticipationByRegion: apiData.active_program_participation_by_region.filter(
          recordIsProbation
        ),
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
