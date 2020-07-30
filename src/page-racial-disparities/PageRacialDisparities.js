import { sum } from "d3-array";
import React, { useState } from "react";
import styled from "styled-components";
import DetailPage from "../detail-page";
import { Dropdown } from "../controls";
import useChartData from "../hooks/useChartData";
import {
  RACE_LABELS,
  RACES,
  TOTAL_KEY,
  VIOLATION_COUNT_KEYS,
  VIOLATION_TYPES,
} from "../constants";
import { formatAsPct } from "../utils";

const ETHNONYMS = {
  [RACES.nativeAmerican]: {
    noun: "Native Americans",
    adjective: "Native American",
  },
  [RACES.black]: { noun: "Black people", adjective: "Black" },
  [RACES.white]: { noun: "White people", adjective: "White" },
  [RACES.hispanic]: { noun: "Latinos", adjective: "Latino" },
};

const DynamicText = styled.span`
  color: ${(props) => props.theme.colors.highlight};
`;

const BodySizeP = styled.p`
  font: ${(props) => props.theme.fonts.body};
`;

const Footnote = styled.span`
  font-size: 0.8em;
  vertical-align: super;
`;

const FootnoteText = styled.p`
  font-size: 0.8em;
`;

const matchRace = (race) => (record) => record.race_or_ethnicity === race;

const getCorrectionsPopulation = (record) =>
  record.total_incarcerated_population +
  record.total_parole_population +
  record.total_probation_population;

const formatDecimal = (number) => number.toFixed(1);

function getMetricsForGroup(data, category) {
  const totals = data.find(matchRace(TOTAL_KEY));
  const selected = data.find(matchRace(category));

  const populationRate =
    selected.total_state_population / totals.total_state_population;

  const incarceratedPopulation = selected.total_incarcerated_population;
  const incarceratedPopulationOverall = totals.total_incarcerated_population;
  const parolePopulation = selected.total_parole_population;
  const parolePopulationOverall = totals.total_parole_population;
  const probationPopulation = selected.total_probation_population;
  const probationPopulationOverall = totals.total_probation_population;

  const supervisionPopulation = parolePopulation + probationPopulation;
  const supervisionPopulationOverall =
    parolePopulationOverall + probationPopulationOverall;

  const correctionsPopulation = incarceratedPopulation + supervisionPopulation;
  const correctionsPopulationOverall =
    incarceratedPopulationOverall + supervisionPopulationOverall;

  const correctionsPopulationRate =
    correctionsPopulation / correctionsPopulationOverall;

  const proportionIncarcerated = incarceratedPopulation / correctionsPopulation;

  const proportionSupervision = 1 - proportionIncarcerated;

  const proportionIncarceratedOverall =
    incarceratedPopulationOverall / correctionsPopulationOverall;
  const proportionSupervisionOverall = 1 - proportionIncarceratedOverall;

  const paroleRate =
    selected.parole_release_count / totals.parole_release_count;

  const prisonPopulationRate =
    incarceratedPopulation / incarceratedPopulationOverall;

  const [parole, probation, supervision] = ["parole", "probation", "total"].map(
    (supervisionType) => {
      let population = 0;
      let populationOverall = 0;
      let revocationCount = 0;
      let revocationCountOverall = 0;
      let technicalCount = 0;
      let absconsionCount = 0;
      let newOffenseCount = 0;
      let technicalCountOverall = 0;
      let absconsionCountOverall = 0;
      let newOffenseCountOverall = 0;

      let types;
      if (supervisionType === "total") {
        types = ["parole", "probation"];
      } else {
        types = [supervisionType];
      }

      types.forEach((type) => {
        population += selected[`total_${type}_population`];
        populationOverall += totals[`total_${type}_population`];

        revocationCount += sum(
          [...VIOLATION_COUNT_KEYS.values()].map(
            (key) => selected[`${type}_${key}`]
          )
        );
        revocationCountOverall += sum(
          [...VIOLATION_COUNT_KEYS.values()].map(
            (key) => totals[`${type}_${key}`]
          )
        );
        technicalCount +=
          selected[
            `${type}_${VIOLATION_COUNT_KEYS.get(VIOLATION_TYPES.technical)}`
          ];
        absconsionCount +=
          selected[
            `${type}_${VIOLATION_COUNT_KEYS.get(VIOLATION_TYPES.abscond)}`
          ];
        newOffenseCount +=
          selected[
            `${type}_${VIOLATION_COUNT_KEYS.get(VIOLATION_TYPES.offend)}`
          ];
        technicalCountOverall +=
          totals[
            `${type}_${VIOLATION_COUNT_KEYS.get(VIOLATION_TYPES.technical)}`
          ];
        absconsionCountOverall +=
          totals[
            `${type}_${VIOLATION_COUNT_KEYS.get(VIOLATION_TYPES.abscond)}`
          ];
        newOffenseCountOverall +=
          totals[`${type}_${VIOLATION_COUNT_KEYS.get(VIOLATION_TYPES.offend)}`];
      });

      return {
        populationRate: population / populationOverall,
        revocationPopulationRate: revocationCount / revocationCountOverall,
        technicalRate: technicalCount / revocationCount,
        technicalRateOverall: technicalCountOverall / revocationCountOverall,
        absconsionRate: absconsionCount / revocationCount,
        absconsionRateOverall: absconsionCountOverall / revocationCountOverall,
        newOffenseRate: newOffenseCount / revocationCount,
        newOffenseRateOverall: newOffenseCountOverall / revocationCountOverall,
      };
    }
  );

  const ftrPopulationRate =
    selected.ftr_admission_count / totals.ftr_admission_count;
  const pretrialPopulationRate =
    selected.pretrial_enrollment_count / totals.pretrial_enrollment_count;

  return {
    populationRate,
    correctionsPopulationRate,
    proportionIncarcerated,
    proportionSupervision,
    proportionIncarceratedOverall,
    proportionSupervisionOverall,
    paroleRate,
    prisonPopulationRate,
    parole,
    probation,
    supervision,
    ftrPopulationRate,
    pretrialPopulationRate,
  };
}

const getCorrectionsRate = (record) => {
  const correctionsPop = getCorrectionsPopulation(record);
  const statePop = record.total_state_population;
  return correctionsPop / statePop;
};

function getOverallMetrics(data) {
  // these metrics are not group dependent, they're always the same
  const black = data.find(matchRace(RACES.black));
  const white = data.find(matchRace(RACES.white));
  const nativeAmerican = data.find(matchRace(RACES.nativeAmerican));
  const hispanic = data.find(matchRace(RACES.hispanic));
  const total = data.find(matchRace(TOTAL_KEY));

  const totalCorrectionsRate = getCorrectionsRate(total);

  const whiteCorrectionsRate = getCorrectionsRate(white);

  const whiteLikelihood = whiteCorrectionsRate / totalCorrectionsRate;

  const comparedToWhite = {
    black: getCorrectionsRate(black) / totalCorrectionsRate / whiteLikelihood,
    hispanic:
      getCorrectionsRate(hispanic) / totalCorrectionsRate / whiteLikelihood,
    nativeAmerican:
      getCorrectionsRate(nativeAmerican) /
      totalCorrectionsRate /
      whiteLikelihood,
  };

  return comparedToWhite;
}

export default function PageRacialDisparities() {
  const { apiData, isLoading } = useChartData("us_nd/race");
  const [category, setCategory] = useState(RACES.black);

  if (isLoading) {
    return null;
  }

  const metrics = getMetricsForGroup(apiData.racial_disparities, category);
  const overallMetrics = getOverallMetrics(apiData.racial_disparities);

  const { noun, adjective } = ETHNONYMS[category];

  const TITLE = "Racial Disparities";
  const DESCRIPTION = (
    <>
      <p>
        In North Dakota, people of color are overrepresented in prison, on
        probation, and on parole.
      </p>
      <p>
        Black North Dakotans are{" "}
        <DynamicText>{formatDecimal(overallMetrics.black)}</DynamicText> times
        as likely to be under DOCR control as their white counterparts, Latino
        North Dakotans are{" "}
        <DynamicText>{formatDecimal(overallMetrics.hispanic)}</DynamicText>{" "}
        times as likely, and Native American North Dakotans{" "}
        <DynamicText>
          {formatDecimal(overallMetrics.nativeAmerican)}
        </DynamicText>{" "}
        times.
      </p>
      <BodySizeP>
        Due to a very small number of people with a race marked as Asian or
        Native Hawaiian Pacific Islander in the North Dakota DOCR population
        these racial groups have been included in the &ldquo;other&rdquo;
        category.
      </BodySizeP>
    </>
  );

  const SECTIONS = [
    {
      title: "Disparities are already present before incarceration",
      description: (
        <>
          <p>
            Disparities emerge long before a person is incarcerated. By the time
            someone comes under the state&rsquo;s care, they have been arrested,
            charged, convicted, and sentenced.<Footnote>1</Footnote> Even before
            contact with the criminal justice system, disparities in community
            investment (education, housing, healthcare) may play an important
            role in creating the disparities that we see in sentencing data.
          </p>
          <p>
            <DynamicText>{noun}</DynamicText> make up{" "}
            <DynamicText>{formatAsPct(metrics.populationRate)}</DynamicText> of
            North Dakota&rsquo;s population, but{" "}
            <DynamicText>
              {formatAsPct(metrics.correctionsPopulationRate)}
            </DynamicText>{" "}
            of the population sentenced to time under DOCR control.
          </p>
          <FootnoteText>
            1. This dashboard only focuses on data from DOCR at the moment,
            which is why disparities in arrests and charging aren&rsquo;t shown.
            We&rsquo;re working with colleagues across the state to show the
            entire criminal justice system end-to-end as this page evolves.
          </FootnoteText>
        </>
      ),
    },
    {
      title: "How can sentencing impact disparities?",
      description: (
        <>
          <p>
            Many parts of the criminal justice system involve human judgment,
            creating the potential for disparities to develop over time.
            Sentences are imposed based on the type and severity of crime. In
            many cases, courts have some discretion over what sentence to impose
            on a person convicted of an offense. In the aggregate, these
            variations in sentencing add up to significant trends.
          </p>
          <p>
            In the last 6 months,{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionIncarcerated)}
            </DynamicText>{" "}
            of <DynamicText>{noun}</DynamicText> under DOCR jurisdiction were
            incarcerated while{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionSupervision)}
            </DynamicText>{" "}
            were on supervision, a{" "}
            <DynamicText>
              {metrics.proportionIncarcerated >
              metrics.proportionIncarceratedOverall
                ? "greater"
                : "smaller"}
            </DynamicText>{" "}
            percent incarcerated than the overall distribution of{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionIncarceratedOverall)}
            </DynamicText>{" "}
            incarcerated and{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionSupervisionOverall)}
            </DynamicText>{" "}
            on supervision. &nbsp;Maximum sentences for people who are{" "}
            <DynamicText>{adjective}</DynamicText> average{" "}
            <DynamicText>TK years</DynamicText> in prison or{" "}
            <DynamicText>TK years</DynamicText> on probation compared with a
            state average of <DynamicText>TK years</DynamicText> in prison and{" "}
            <DynamicText>TK years</DynamicText> on probation.
          </p>
        </>
      ),
    },
    {
      title: "How can parole grant rates impact disparities?",
      description: (
        <>
          <p>
            People sentenced to a prison term can serve the end-portion of their
            term while supervised in the community, through the parole process.
          </p>
          <p>
            The parole process is governed by the Parole Board, an independent
            commission that works closely with the DOCR. In 2019, under guidance
            from Governor Burgum and then-Director of Corrections Leann Bertsch,
            The DOCR and the Parole Board began tracking and reporting racial
            data for the parole process in order to monitor and reduce
            disparities in the population granted parole.
          </p>
          <p>
            In the last 6 months, <DynamicText>{noun}</DynamicText> comprised{" "}
            <DynamicText>{formatAsPct(metrics.paroleRate)}</DynamicText> of the
            individuals released on parole. They make up{" "}
            <DynamicText>
              {formatAsPct(metrics.prisonPopulationRate)}
            </DynamicText>{" "}
            of the overall prison population. <DynamicText>{noun}</DynamicText>{" "}
            typically served a <DynamicText>longer/shorter</DynamicText>{" "}
            proportion of their sentence prior to release, serving on average{" "}
            <DynamicText>TK%</DynamicText> of their sentence relative to the{" "}
            <DynamicText>TK%</DynamicText> served before release on average.
          </p>
        </>
      ),
    },
    {
      title: "How can community supervision impact disparities?",
      description: (
        <>
          <p>
            For individuals on probation (community supervision in lieu of a
            prison sentence) or on parole, failure can mean revocation: a
            process that removes people from community supervision and places
            them in prison.
          </p>
          <p>
            Examine{" "}
            <DynamicText>
              everyone on supervision / just parole / just probation
            </DynamicText>
            .
          </p>
          <p>
            <DynamicText>{noun}</DynamicText> represent{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.populationRate)}
            </DynamicText>{" "}
            of the supervision population, but are{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.revocationPopulationRate)}
            </DynamicText>{" "}
            of revocation admissions to prison.
          </p>
          <p>
            Reasons for a revocation can vary: <DynamicText>{noun}</DynamicText>{" "}
            are revoked{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.technicalRate)}
            </DynamicText>{" "}
            of the time for technical violations (a rule of supervision, rather
            than a crime),{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.absconsionRate)}
            </DynamicText>{" "}
            of the time for absconsion from supervision, and{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.newOffenseRate)}
            </DynamicText>{" "}
            of the time for new crimes. In contrast, overall revocations for
            technical violations are{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.technicalRateOverall)}
            </DynamicText>
            , revocations for absconsion{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.absconsionRateOverall)}
            </DynamicText>{" "}
            and revocations for new crime{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.newOffenseRateOverall)}
            </DynamicText>
            .
          </p>
        </>
      ),
    },
    {
      title: "Can programming help reduce disparities?",
      description: (
        <>
          <p>
            Programming is designed to improve outcomes for justice-involved
            individuals. If programming is utilized more by groups
            overrepresented in the justice system, it could help close the gap.
          </p>
          <p>
            In 2018, North Dakota launched Free Through Recovery, a wrap-around
            behavioral health program that helps those with behavioral health
            challenges to succeed on community supervision.{" "}
            <DynamicText>{noun}</DynamicText> are{" "}
            <DynamicText>{formatAsPct(metrics.ftrPopulationRate)}</DynamicText>{" "}
            of referrals to FTR, a greater representation than their overall{" "}
            <DynamicText>
              {formatAsPct(metrics.supervision.populationRate)}
            </DynamicText>{" "}
            of the supervision population.
          </p>
          <p>
            On July 1, 2020, the DOCR began a pilot of pre-trial services,
            programming designed to reduce the number of people held in jail
            between arrest and appearance before a judge.{" "}
            <DynamicText>{noun}</DynamicText> make up{" "}
            <DynamicText>
              {formatAsPct(metrics.pretrialPopulationRate)}
            </DynamicText>{" "}
            of individuals enrolled in pre-trial services rather than detained
            prior to appearance in court.
          </p>
        </>
      ),
    },
    {
      title:
        "What are we doing to further improve disparities in criminal justice in North Dakota?",
      description: (
        <>
          <p>
            In 2019, the DOCR announced participation in the Restoring Promise
            initiative with the Vera Institute of Justice and MILPA. This
            initiative will focus on strategies to improve outcomes for
            incarcerated individuals age 18-25 with a strong emphasis on
            addressing racial inequities.
          </p>
          <p>We all have a part to play in reducing racial disparities.</p>
          <p>
            The good news is that many approaches have been shown to reduce
            disparities in criminal justice:
          </p>
          <ul>
            <li>
              Investing in community-based education, housing, and healthcare
              (citation)
            </li>
            <li>Re-evaluation of community policing practices (citation)</li>
            <li>
              Looking for and reducing bias in charging, and sentencing
              practices (citation)
            </li>
          </ul>
          <p>
            Finally, progress starts with transparency; this page helps North
            Dakota and those of us at the DOCR to continue work to reduce the
            disparities in our system and create an equitable justice system.
          </p>
        </>
      ),
    },
  ];

  const pageControls = (
    <Dropdown
      label="Race"
      onChange={setCategory}
      selectedId={category}
      options={[...RACE_LABELS].map(([id, label]) => ({ id, label }))}
    />
  );

  return (
    <DetailPage
      title={TITLE}
      description={DESCRIPTION}
      sections={SECTIONS}
      pageControls={pageControls}
    />
  );
}

PageRacialDisparities.propTypes = {};
