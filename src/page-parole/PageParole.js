import React from "react";
import DetailPage from "../detail-page";
import { formatLocation, recordIsMetricPeriodMonths } from "../utils";
import useChartData from "../hooks/useChartData";
import VizParolePopulation from "../viz-parole-population";
import VizSupervisionProgram from "../viz-supervision-program";
import VizSupervisionRevocation from "../viz-supervision-revocation";
import VizSupervisionSuccess from "../viz-supervision-success";
import { SUPERVISION_TYPES } from "../constants";

export default function PageParole() {
  const { apiData, isLoading } = useChartData("us_nd/parole");

  if (isLoading) {
    return null;
  }

  const recordIsParole = (record) =>
    record.supervision_type === SUPERVISION_TYPES.parole;

  const officeLocations = formatLocation({
    locations: apiData.site_offices,
    idFn: (record) => `${record.district}`,
    labelFn: (record) => record.site_name,
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
        populationDemographics: apiData.supervision_population_by_district_by_demographics.filter(
          recordIsParole
        ),
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
      VizComponent: VizSupervisionSuccess,
      vizData: {
        locations: officeLocations,
        successByMonth: apiData.supervision_success_by_month.filter(
          recordIsParole
        ),
        successByDemographics: apiData.supervision_success_by_period_by_demographics
          .filter(recordIsParole)
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
          .filter(recordIsParole)
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
          recordIsParole
        ),
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
