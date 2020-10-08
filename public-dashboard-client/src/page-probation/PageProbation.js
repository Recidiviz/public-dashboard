import React from "react";
import {
  ALL_PAGES,
  PATHS,
  SECTION_TITLES,
  SUPERVISION_TYPES,
} from "../constants";
import DetailPage from "../detail-page";
import { recordIsMetricPeriodMonths, recordIsAllRaces } from "../utils";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import TextLink from "../text-link";
import VizProbationPopulation from "../viz-probation-population";
import VizPopulationOverTime from "../viz-population-over-time";
import VizSupervisionProgram from "../viz-supervision-program";
import VizSupervisionRevocation from "../viz-supervision-revocation";
import VizSupervisionSuccess from "../viz-supervision-success";

export default function PageProbation() {
  const { apiData, isLoading } = useChartData("us_nd/probation");

  if (isLoading) {
    return <Loading />;
  }

  const recordIsProbation = (record) =>
    record.supervision_type === SUPERVISION_TYPES.probation;

  const TITLE = ALL_PAGES.get(PATHS.probation);
  const DESCRIPTION = (
    <>
      Probation refers to adults whom the courts place on supervision in the
      community in lieu of or in addition to incarceration. In North Dakota,
      probation is managed by the Department of Corrections and Rehabilitation
      (DOCR).
    </>
  );

  const SECTIONS = [
    {
      title: SECTION_TITLES[PATHS.probation].population,
      description: (
        <>
          Judges may sentence people to a period of probation for a Class A
          misdemeanor crime or greater. Probation can be either a suspended
          sentence in which the judge has decided on a carceral sentence but has
          declined to carry it out unless the defendant does not successfully
          complete a period of probation supervision, or a deferred sentence, in
          which the defendant has an opportunity for the crime to be recorded as
          “dismissed” on the criminal record.
        </>
      ),
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
      title: SECTION_TITLES[PATHS.probation].overTime,
      description: (
        <>
          Broadly speaking, increased activity in earlier parts of the criminal
          justice system (such as arrests and sentencing) will result in
          increases in the probation population. Changes in probation sentence
          lengths, etc. may also contribute to the rise and fall of this number.
        </>
      ),
      showDimensionControl: true,
      showTimeRangeControl: true,
      VizComponent: VizPopulationOverTime,
      vizData: {
        populationOverTime: apiData.supervision_population_by_month_by_demographics.filter(
          recordIsProbation
        ),
      },
    },
    {
      title: SECTION_TITLES[PATHS.probation].completion,
      description: (
        <>
          After probation, a person may be successfully discharged or revoked to
          prison. Take a look at how the rate of successful probation completion
          has changed over time, and how the overall rate of successful
          probation completion varies by demographic.
        </>
      ),
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
      title: SECTION_TITLES[PATHS.probation].revocations,
      description: (
        <>
          Revocations happen when a person on probation violates a condition of
          their supervision or commits a new crime. In North Dakota, probation
          revocations fall into one of three categories: technical violation,
          new offense, and absconsion.
        </>
      ),
      showDimensionControl: true,
      VizComponent: VizSupervisionRevocation,
      vizData: {
        revocationsByDemographics: apiData.supervision_revocations_by_period_by_type_by_demographics
          .filter(recordIsProbation)
          .filter(recordIsMetricPeriodMonths(36)),
      },
    },
    {
      title: SECTION_TITLES[PATHS.probation].ftr,
      description: (
        <>
          <TextLink href="https://www.behavioralhealth.nd.gov/addiction/FTR-old">
            Free Through Recovery (FTR)
          </TextLink>{" "}
          is a community based behavioral health program designed to increase
          recovery support services to individuals involved with the criminal
          justice system who have behavioral health concerns. The map below
          shows the number of people enrolled in the FTR program today.
        </>
      ),
      VizComponent: VizSupervisionProgram,
      vizData: {
        supervisionProgramParticipationByRegion: apiData.active_program_participation_by_region
          .filter(recordIsProbation)
          .filter(recordIsAllRaces),
      },
    },
  ];

  return (
    <DetailPage title={TITLE} description={DESCRIPTION} sections={SECTIONS} />
  );
}
