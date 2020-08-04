import React, { useState } from "react";
import styled from "styled-components";
import DetailPage from "../detail-page";
import {
  ALL_PAGES,
  PATHS,
  RACE_LABELS,
  RACES,
  SECTION_TITLES,
  SUPERVISION_TYPES,
  TOTAL_KEY,
  VIOLATION_TYPES,
} from "../constants";
import { Dropdown } from "../controls";
import useChartData from "../hooks/useChartData";
import Loading from "../loading";
import { formatAsPct, sentenceCase } from "../utils";
import {
  DynamicText,
  getSupervisionCounts36Mo,
  matchRace,
  getCorrectionsPopulationCurrent,
} from "./helpers";
import VizPopulationDisparity from "./VizPopulationDisparity";
import VizRevocationDisparity from "./VizRevocationDisparity";

const ETHNONYMS = {
  [RACES.nativeAmerican]: "people who are Native American",
  [RACES.black]: "people who are Black",
  [RACES.white]: "people who are white",
  [RACES.hispanic]: "people who are Hispanic and/or Latino",
  [RACES.other]: "people of other races",
};

const BodySizeP = styled.p`
  font: ${(props) => props.theme.fonts.body};

  padding-right: calc(100% - ${(props) => props.theme.sectionTextWidthWide}px);
`;

const Footnote = styled.span`
  font-size: 0.8em;
  vertical-align: super;
`;

const FootnoteText = styled.p`
  font-size: 0.8em;
`;

const formatDecimal = (number) => number.toFixed(1);

const typecast = (record) => {
  const typecastRecord = { ...record };
  Object.entries(typecastRecord).forEach(([key, value]) => {
    // we can be blunt here because everything in here should be a number
    // except state name and racial category identifiers
    const n = Number(value);
    if (!Number.isNaN(n)) typecastRecord[key] = n;
  });
  return typecastRecord;
};

function getMetricsForGroup(data, category) {
  const totals = data.find(matchRace(TOTAL_KEY));
  const selected = data.find(matchRace(category));

  const populationRateCurrent =
    selected.total_state_population / totals.total_state_population;

  const incarceratedPopulation36Mo =
    selected.total_incarcerated_population_36_mo;
  const incarceratedPopulationOverall36Mo =
    totals.total_incarcerated_population_36_mo;
  const totalSentencedCurrent = selected.current_total_sentenced_count;
  const totalSentencedOverallCurrent = totals.current_total_sentenced_count;

  const supervisionPopulationCurrent = selected.current_supervision_population;
  const supervisionPopulationOverallCurrent =
    totals.current_supervision_population;

  const correctionsPopulationCurrent = getCorrectionsPopulationCurrent(
    selected
  );
  const correctionsPopulationOverallCurrent = getCorrectionsPopulationCurrent(
    totals
  );

  const correctionsPopulationRateCurrent =
    correctionsPopulationCurrent / correctionsPopulationOverallCurrent;

  const proportionIncarceratedCurrent =
    selected.current_incarceration_sentence_count / totalSentencedCurrent;

  const proportionSupervisionCurrent =
    selected.current_probation_sentence_count / totalSentencedCurrent;

  const proportionIncarceratedOverallCurrent =
    totals.current_incarceration_sentence_count / totalSentencedOverallCurrent;
  const proportionSupervisionOverallCurrent =
    totals.current_probation_sentence_count / totalSentencedOverallCurrent;

  const paroleRate36Mo =
    selected.parole_release_count_36_mo / totals.parole_release_count_36_mo;

  const prisonPopulationRate36Mo =
    incarceratedPopulation36Mo / incarceratedPopulationOverall36Mo;

  const supervisionTotals36Mo = getSupervisionCounts36Mo(totals);
  const supervisionSelected36Mo = getSupervisionCounts36Mo(selected);
  const supervisionMetrics36Mo = {};

  [...Object.values(SUPERVISION_TYPES), TOTAL_KEY].forEach(
    (supervisionType) => {
      const totalCounts36Mo = supervisionTotals36Mo[supervisionType];
      const selectedCounts36Mo = supervisionSelected36Mo[supervisionType];

      supervisionMetrics36Mo[supervisionType] = {
        populationRate:
          selectedCounts36Mo.population / totalCounts36Mo.population,
        revocationPopulationRate:
          selectedCounts36Mo.totalRevocations /
          totalCounts36Mo.totalRevocations,
        technicalRate:
          selectedCounts36Mo[VIOLATION_TYPES.technical] /
          selectedCounts36Mo.totalRevocations,
        technicalRateOverall:
          totalCounts36Mo[VIOLATION_TYPES.technical] /
          totalCounts36Mo.totalRevocations,
        absconsionRate:
          selectedCounts36Mo[VIOLATION_TYPES.abscond] /
          selectedCounts36Mo.totalRevocations,
        absconsionRateOverall:
          totalCounts36Mo[VIOLATION_TYPES.abscond] /
          totalCounts36Mo.totalRevocations,
        newOffenseRate:
          selectedCounts36Mo[VIOLATION_TYPES.offend] /
          selectedCounts36Mo.totalRevocations,
        newOffenseRateOverall:
          totalCounts36Mo[VIOLATION_TYPES.offend] /
          totalCounts36Mo.totalRevocations,
      };
    }
  );

  const ftrPopulationRateCurrent =
    selected.current_ftr_participation_count /
    totals.current_ftr_participation_count;

  const supervisionPopulationRateCurrent =
    supervisionPopulationCurrent / supervisionPopulationOverallCurrent;

  return {
    correctionsPopulationRateCurrent,
    ftrPopulationRateCurrent,
    paroleRate36Mo,
    populationRateCurrent,
    prisonPopulationRate36Mo,
    proportionIncarceratedCurrent,
    proportionIncarceratedOverallCurrent,
    proportionSupervisionCurrent,
    proportionSupervisionOverallCurrent,
    supervisionMetrics36Mo,
    supervisionPopulationRateCurrent,
  };
}

const getCorrectionsRateCurrent = (record) => {
  const correctionsPopCurrent = getCorrectionsPopulationCurrent(record);
  const statePopCurrent = record.total_state_population;
  return correctionsPopCurrent / statePopCurrent;
};

function getOverallMetrics(data) {
  // these metrics are not group dependent, they're always the same
  const black = data.find(matchRace(RACES.black));
  const white = data.find(matchRace(RACES.white));
  const nativeAmerican = data.find(matchRace(RACES.nativeAmerican));
  const hispanic = data.find(matchRace(RACES.hispanic));
  const total = data.find(matchRace(TOTAL_KEY));

  const totalCorrectionsRateCurrent = getCorrectionsRateCurrent(total);

  const whiteCorrectionsRateCurrent = getCorrectionsRateCurrent(white);

  const whiteLikelihoodCurrent =
    whiteCorrectionsRateCurrent / totalCorrectionsRateCurrent;

  const comparedToWhite = {
    black:
      getCorrectionsRateCurrent(black) /
      totalCorrectionsRateCurrent /
      whiteLikelihoodCurrent,
    hispanic:
      getCorrectionsRateCurrent(hispanic) /
      totalCorrectionsRateCurrent /
      whiteLikelihoodCurrent,
    nativeAmerican:
      getCorrectionsRateCurrent(nativeAmerican) /
      totalCorrectionsRateCurrent /
      whiteLikelihoodCurrent,
  };

  return comparedToWhite;
}

const getRoundedPct = (number) => Number(number.toFixed(2));

const comparePercentagesAsString = (subject, base) => {
  const roundedSubject = getRoundedPct(subject);
  const roundedBase = getRoundedPct(base);

  return (
    <DynamicText>
      {/* eslint-disable-next-line no-nested-ternary */}
      {roundedSubject > roundedBase
        ? "greater"
        : roundedSubject < roundedBase
        ? "smaller"
        : "similar"}
    </DynamicText>
  );
};

// these are for use in inline dynamic text; not necessarily the same as control labels
const supervisionTypeText = {
  [SUPERVISION_TYPES.parole]: "parole",
  [SUPERVISION_TYPES.probation]: "probation",
  [TOTAL_KEY]: "supervision",
};

const supervisionTypeOptions = [
  { id: TOTAL_KEY, label: "Everyone" },
  { id: SUPERVISION_TYPES.probation, label: "Probation" },
  { id: SUPERVISION_TYPES.parole, label: "Parole" },
];

export default function PageRacialDisparities() {
  const { apiData, isLoading } = useChartData("us_nd/race");
  const [category, setCategory] = useState(RACES.black);
  const [supervisionType, setSupervisionType] = useState(TOTAL_KEY);

  if (isLoading) {
    return <Loading />;
  }

  const racialDisparityCounts = apiData.racial_disparities.map(typecast);

  const metrics = getMetricsForGroup(racialDisparityCounts, category);
  const supervisionTypeMetrics36Mo =
    metrics.supervisionMetrics36Mo[supervisionType];
  const overallMetrics = getOverallMetrics(racialDisparityCounts);

  const ethnonym = ETHNONYMS[category];

  const TITLE = ALL_PAGES.get(PATHS.race);
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
        Use the dropdown control on the right to investigate how a specific race
        is affected by each part of the system. Due to a very small number of
        people identified as Asian and Native Hawaiian or Other Pacific Islander
        in the North Dakota DOCR population, these racial groups are included in
        the &ldquo;Other&rdquo; category.
      </BodySizeP>
    </>
  );

  const SECTIONS = [
    {
      title: SECTION_TITLES[PATHS.race].beforeIncarceration,
      description: (
        <>
          <p>
            Disparities emerge long before a person is incarcerated. By the time
            someone comes under the DOCR&rsquo;s care, they have been arrested,
            charged, convicted, and sentenced.<Footnote>1</Footnote> Even before
            contact with the criminal justice system, disparities in community
            investment (education, housing, healthcare) may play an important
            role in creating the disparities that we see in sentencing data.
          </p>
          <p>
            <DynamicText>{sentenceCase(ethnonym)}</DynamicText> make up{" "}
            <DynamicText>
              {formatAsPct(metrics.populationRateCurrent)}
            </DynamicText>{" "}
            of North Dakota&rsquo;s population, but{" "}
            <DynamicText>
              {formatAsPct(metrics.correctionsPopulationRateCurrent)}
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
      VizComponent: VizPopulationDisparity,
      vizData: {
        category,
        countsByRace: racialDisparityCounts,
      },
    },
    {
      title: SECTION_TITLES[PATHS.race].sentencing,
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
            Currently,{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionIncarceratedCurrent)}
            </DynamicText>{" "}
            of <DynamicText>{ethnonym}</DynamicText> under DOCR jurisdiction are
            serving incarceration sentences, while{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionSupervisionCurrent)}
            </DynamicText>{" "}
            are serving probation sentences, a{" "}
            {comparePercentagesAsString(
              metrics.proportionIncarceratedCurrent,
              metrics.proportionIncarceratedOverallCurrent
            )}{" "}
            percentage serving incarceration sentences compared to the overall
            distribution of{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionIncarceratedOverallCurrent)}
            </DynamicText>{" "}
            serving incarceration sentences versus{" "}
            <DynamicText>
              {formatAsPct(metrics.proportionSupervisionOverallCurrent)}
            </DynamicText>{" "}
            serving probation sentences.
          </p>
        </>
      ),
    },
    {
      title: SECTION_TITLES[PATHS.race].parole,
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
            the DOCR and the Parole Board began tracking and reporting racial
            data for the parole process in order to monitor and reduce
            disparities in the population granted parole.
          </p>
          <p>
            In the last 3 years, <DynamicText>{ethnonym}</DynamicText> comprised{" "}
            <DynamicText>{formatAsPct(metrics.paroleRate36Mo)}</DynamicText> of
            the individuals released on parole. They make up{" "}
            <DynamicText>
              {formatAsPct(metrics.prisonPopulationRate36Mo)}
            </DynamicText>{" "}
            of the overall prison population during that time.
          </p>
        </>
      ),
    },
    {
      title: SECTION_TITLES[PATHS.race].supervision,
      otherControls: (
        <Dropdown
          label="Supervision Type"
          onChange={setSupervisionType}
          selectedId={supervisionType}
          options={supervisionTypeOptions}
        />
      ),
      description: (
        <>
          <p>
            For individuals on probation (community supervision in lieu of a
            prison sentence) or on parole, failure can mean revocation: a
            process that removes people from community supervision and places
            them in prison.
          </p>
          <p>
            Use the &ldquo;Supervision Type&rdquo; dropdown above to view
            everyone on supervision, just parolees, or just probationers.
          </p>
          <p>
            <DynamicText>{sentenceCase(ethnonym)}</DynamicText> represent{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.populationRate)}
            </DynamicText>{" "}
            of the {supervisionTypeText[supervisionType]} population, but were{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.revocationPopulationRate)}
            </DynamicText>{" "}
            of revocation admissions to prison in the last 3 years.
          </p>
          <p>
            Reasons for a revocation can vary:{" "}
            <DynamicText>{ethnonym}</DynamicText> are revoked{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.technicalRate)}
            </DynamicText>{" "}
            of the time for technical violations (a rule of{" "}
            {supervisionTypeText[supervisionType]}, rather than a crime),{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.absconsionRate)}
            </DynamicText>{" "}
            of the time for absconsion from{" "}
            {supervisionTypeText[supervisionType]}, and{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.newOffenseRate)}
            </DynamicText>{" "}
            of the time for new crimes. In contrast, overall revocations for
            technical violations are{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.technicalRateOverall)}
            </DynamicText>
            , revocations for absconsion{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.absconsionRateOverall)}
            </DynamicText>{" "}
            and revocations for new crime{" "}
            <DynamicText>
              {formatAsPct(supervisionTypeMetrics36Mo.newOffenseRateOverall)}
            </DynamicText>
            .
          </p>
        </>
      ),
      VizComponent: VizRevocationDisparity,
      vizData: {
        category,
        ethnonym,
        countsByRace: racialDisparityCounts,
        supervisionType,
      },
    },
    {
      title: SECTION_TITLES[PATHS.race].programming,
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
            <DynamicText>{sentenceCase(ethnonym)}</DynamicText> are{" "}
            <DynamicText>
              {formatAsPct(metrics.ftrPopulationRateCurrent)}
            </DynamicText>{" "}
            of active participants in FTR, a{" "}
            {comparePercentagesAsString(
              metrics.ftrPopulationRateCurrent,
              metrics.supervisionPopulationRateCurrent
            )}{" "}
            representation compared to their overall{" "}
            <DynamicText>
              {formatAsPct(metrics.supervisionPopulationRateCurrent)}
            </DynamicText>{" "}
            of the current supervision population.
          </p>
        </>
      ),
    },
    {
      title: SECTION_TITLES[PATHS.race].furtherImprovement,
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
      highlighted
      label="Race"
      onChange={setCategory}
      selectedId={category}
      options={[...RACE_LABELS].map(([id, label]) => ({ id, label }))}
    />
  );

  return (
    <DetailPage
      className="wide-text"
      description={DESCRIPTION}
      title={TITLE}
      sections={SECTIONS}
      pageControls={pageControls}
    />
  );
}

PageRacialDisparities.propTypes = {};
