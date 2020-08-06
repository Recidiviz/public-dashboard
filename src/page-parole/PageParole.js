import React from "react";
import DetailPage from "../detail-page";
import {
  formatLocation,
  recordIsMetricPeriodMonths,
  recordIsAllRaces,
} from "../utils";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import VizParolePopulation from "../viz-parole-population";
import VizSupervisionProgram from "../viz-supervision-program";
import VizSupervisionRevocation from "../viz-supervision-revocation";
import VizSupervisionSuccess from "../viz-supervision-success";
import {
  ALL_PAGES,
  PATHS,
  SECTION_TITLES,
  SUPERVISION_TYPES,
} from "../constants";

export default function PageParole() {
  const { apiData, isLoading } = useChartData("us_nd/parole");

  if (isLoading) {
    return <Loading />;
  }

  const recordIsParole = (record) =>
    record.supervision_type === SUPERVISION_TYPES.parole;

  const officeLocations = formatLocation({
    locations: apiData.site_offices,
    idFn: (record) => `${record.district}`,
    labelFn: (record) => record.site_name,
  });

  const TITLE = ALL_PAGES.get(PATHS.parole);
  const DESCRIPTION = (
    <>
      Parole is a period of supervised release after prison. Releases from
      prison to parole are granted by the parole board. People on parole must
      regularly check in with their parole officer, who ensures that they are
      following all the requirements of the release. If these expectations are
      violated, the person’s parole may be revoked.
    </>
  );
  const SECTIONS = [
    {
      title: SECTION_TITLES[PATHS.parole].population,
      description: (
        <>
          Parole is granted to people in prison with a track record of good
          behavior as a way to complete their sentences in their communities.
        </>
      ),
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
      title: SECTION_TITLES[PATHS.parole].completion,
      description: (
        <>
          After parole, a person may be successfully discharged or revoked to
          prison. Take a look at how the rate of successful parole completion
          has changed over time, and how the overall rate of successful parole
          completion varies by demographic.
        </>
      ),
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
      title: SECTION_TITLES[PATHS.parole].revocations,
      description: (
        <>
          Revocations happen when a person on parole violates a condition of
          their supervision or commits a new crime. In North Dakota, parole
          revocations fall into one of three categories: technical violation,
          new offense, and absconsion.
        </>
      ),
      showDimensionControl: true,
      VizComponent: VizSupervisionRevocation,
      vizData: {
        revocationsByDemographics: apiData.supervision_revocations_by_period_by_type_by_demographics
          .filter(recordIsParole)
          .filter(recordIsMetricPeriodMonths(36)),
      },
    },
    {
      title: SECTION_TITLES[PATHS.parole].ftr,
      description: (
        <>
          Free Through Recovery (FTR) is a community based behavioral health
          program designed to increase recovery support services to individuals
          involved with the criminal justice system who have behavioral health
          concerns. The map below shows the number of people enrolled in the FTR
          program today.
        </>
      ),
      VizComponent: VizSupervisionProgram,
      vizData: {
        supervisionProgramParticipationByRegion: apiData.active_program_participation_by_region
          .filter(recordIsParole)
          .filter(recordIsAllRaces),
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
