// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { TenantContent } from "../types";

const content: TenantContent = {
  name: "Pennsylvania",
  docName: "Pennsylvania Department of Corrections",
  docLink: "https://cor.pa.gov",
  description: `<a href="https://www.cor.pa.gov" target="_blank" rel="noopener noreferrer">The Pennsylvania Department of Corrections (DOC)</a>
    is committed to enhancing public safety.`,
  ctaCopy: `The DOC's mission is to reduce criminal behavior by providing individualized treatment and education to incarcerated individuals, resulting in successful community reintegration through accountability and positive change.`,
  coBrandingCopy:
    'Produced in collaboration with <a href="https://www.cor.pa.gov">the Pennsylvania Department of Corrections</a>.',
  feedbackUrl: "https://forms.gle/7bZMpgGR69uaW1eNA",
  demographicCategories: {
    raceOrEthnicity: [
      "BLACK",
      "HISPANIC",
      "WHITE",
      "ASIAN",
      "AMERICAN_INDIAN_ALASKAN_NATIVE",
      "OTHER",
    ],
  },
  smallDataDisclaimer: `Note that in cases where the counts are especially low,
    rounding may have a significant impact.`,
  systemNarratives: {
    Prison: {
      title: "Prisons",
      previewTitle: "Prison Population over Time",
      introduction: `<p>
        Individuals convicted of a crime may be sentenced to a period of incarceration.
        The length of the sentence determines the place of confinement.  While
        incarcerated, individuals are offered a wide variety of educational, treatment,
        and occupational programming to address rehabilitative needs and prepare for
        reentry to the community.
      </p>
      <aside>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </aside>`,
      preview: "PrisonPopulationHistorical",
      sections: [
        {
          title: "Who is in a State Correctional Institution (SCI)?",
          body: `<p>
            The Department of Corrections operates 23 state correctional institutions
            (SCIs) across the commonwealth as well as one motivational boot camp.
          </p>`,
          metricTypeId: "PrisonPopulationCurrent",
        },
        {
          title: "How has the incarcerated population changed over time?",
          body: `<p>
            Prison populations are impacted by the number of individuals sentenced to
            incarceration and the length of their sentence balanced with population
            reduction factors such as parole and diversionary programs. Factors that
            impact incarceration may include mandatory sentencing, legislation
            creating new crimes or enhanced penalties, and probation and parole revocations.
          </p>`,
          metricTypeId: "PrisonPopulationHistorical",
        },
        {
          title: "How did they get there?",
          body: `<p>
            Among the current population there are several possible pathways that may have
            led to the individual being in prison. Many people currently in prison have
            not been admitted for the first time as part of their sentence, but are
            actually people who are revoked from community supervision due to a
            violation or new crime.
          </p>
          <p>
            Please note that probation revocations are included in the “new admissions”
            in this visualization due to lack of detail in the source data.
          </p>`,
          metricTypeId: "PrisonAdmissionReasonsCurrent",
        },
        {
          title: "What do outcomes look like for those released from prison?",
          body: `<p>
            After release from prison, a significant proportion of formerly incarcerated
            individuals end up back in prison or charged with additional crimes. This
            is typically termed “recidivism.” This data depicts overall recidivism,
            which is the broadest category and is defined by the DOC as the first event
            of either rearrest or return to DOC custody within a given time since prior
            release from DOC custody.
          </p>`,
          metricTypeId: "PrisonRecidivismRateHistorical",
        },
        {
          title: "How has the recidivism rate changed over time?",
          body: `<p>
            We can also observe the recidivism rate over time for a given number of years
            after original release.
          </p>`,
          metricTypeId: "PrisonRecidivismRateSingleFollowupHistorical",
        },
      ],
    },
    Parole: {
      title: "Parole",
      previewTitle: "Returns from Parole, by Reason",
      introduction: `<p>
        Parole is a period of supervised release after prison. Individuals on parole must
        regularly check in with a parole agent, who ensures that they are following
        all the requirements of the release. If these requirements are violated, the
        person’s parole may be revoked and they will be sent back to prison.
      </p>
      <aside>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </aside>`,
      preview: "ParoleRevocationsAggregate",
      sections: [
        {
          title: "Who is on parole?",
          body: `<p>
            People on parole have generally completed certain requirements of their
            sentence (such as a minimum time spent) and have been approved for
            release by a parole board. The corrections system works to ensure
            that the person is set up for success before they are released.
          </p>`,
          metricTypeId: "ParolePopulationCurrent",
        },
        {
          title: "What drives changes in the parole population over time?",
          body: `<p>
            There are many drivers that change the parole population over time, including
            but not limited to:
          </p>
          <ul>
            <li>Number of people sentenced</li>
            <li>Parole grant rate</li>
            <li>Internal procedures of the parole board and DOC</li>
            <li>Legislative activity</li>
          </ul>
          `,
          metricTypeId: "ParolePopulationHistorical",
        },
        {
          title: "What proportion of people succeed on parole?",
          body: `<p>
            A successful end to one’s parole term is a sentence completion, after which
            the individual is no longer supervised by a parole agent. Failure to succeed
            generally means a return to prison. This success rate is improved by
            addressing critical needs of justice-involved individuals, including
            employment, housing, and need-based care.
          </p>`,
          metricTypeId: "ParoleTerminationsHistorical",
        },
        {
          title: "How do returns for parole violations happen?",
          body: `<p>
            Returns for parole violations occur when a person on parole violates a
            condition of their supervision or commits a new crime and is reincarcerated
            as a result. Reasons for returns generally fall into one of three categories:
            technical violation, new offense, or absconsion.
          </p>`,
          metricTypeId: "ParoleRevocationsAggregate",
        },
      ],
    },
  },
  metrics: {
    PrisonPopulationCurrent: {
      name: "Current Prison Population",
      methodology: `<p>
        This data includes all individuals that are currently incarcerated in a DOC
        facility. It does not include individuals incarcerated in county jails. Other
        includes individuals such as those that are currently out of state.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
      totalLabel: "Total people in prison",
    },
    PrisonPopulationHistorical: {
      name: "Historical Prison Population",
      methodology: `<p>
        This data includes the number of people that were incarcerated in a DOC
        facility on the first day of each month over the last 20 years. It does not
        include individuals incarcerated in county jails.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
    },
    PrisonAdmissionReasonsCurrent: {
      name: "Reasons for Admission",
      methodology: `<p>
        This data includes the original reason for admission for all individuals
        currently incarcerated in a DOC facility. When an individual is admitted to a
        state prison, the reason for the admission is documented by prison officials.
        These categories are pulled from that documentation.
      </p>
      <p>
        Please note that the “New admissions" category contains both new prison
        admissions and probation revocations. This is due to limitations in the
        data available from Pennsylvania Department of Corrections and may be
        disaggregated at a later date.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
      fieldMapping: [
        {
          categoryLabel: "New admissions",
          fieldName: "new_admission_count",
        },
        {
          categoryLabel: "Parole violations",
          fieldName: "parole_revocation_count",
        },
        { categoryLabel: "Other", fieldName: "other_count" },
      ],
    },
    PrisonRecidivismRateHistorical: {
      name: "Cumulative Recidivism Rates",
      methodology: `<p>
        The PA DOC uses three different measures of recidivism: rearrest, reincarceration,
        and overall recidivism. Rearrest is measured as the first instance of arrest
        after inmates are released from state prison. Reincarceration is measured as
        the first instance of returning to state prison after inmates are released from
        state prison. Overall recidivism is measured as the first instance of any type
        of rearrest or reincarceration after inmates are released from state prison.
      </p>
      <p>
        The cumulative recidivism rate used here represents PA DOC's “overall recidivism,”
        which is the first instance of either rearrest or return to DOC custody within
        3 years after prior release from DOC custody. This is a broad definition of
        recidivism that includes individuals who are reincarcerated for technical parole
        violations (not new crimes), as well as individuals who are rearrested but not
        necessarily convicted or returned to DOC custody.
      </p>`,
    },
    PrisonRecidivismRateSingleFollowupHistorical: {
      name: "Recidivism Rates Over Time",
      methodology: `<p>
        The PA DOC uses three different measures of recidivism: rearrest, reincarceration,
        and overall recidivism. Rearrest is measured as the first instance of arrest
        after inmates are released from state prison. Reincarceration is measured as
        the first instance of returning to state prison after inmates are released from
        state prison. Overall recidivism is measured as the first instance of any type
        of rearrest or reincarceration after inmates are released from state prison.
      </p>
      <p>
        The cumulative recidivism rate used here represents PA DOC's “overall recidivism,”
        which is the first instance of either rearrest or return to DOC custody within
        3 years after prior release from DOC custody. This is a broad definition of
        recidivism that includes individuals who are reincarcerated for technical parole
        violations (not new crimes), as well as individuals who are rearrested but not
        necessarily convicted or returned to DOC custody.
      </p>`,
    },
    ParolePopulationCurrent: {
      name: "Current Parole Population",
      methodology: `<p>
        This data includes people currently on parole in Pennsylvania. The offices
        associated with this data indicate individuals who are being supervised by a
        parole agent stationed in that office. This does not include interstate or
        special probation.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>
      <p>
        This data may include some individuals on parole in Pennsylvania as part of
        the interstate compact program, in which Pennsylvania agrees to supervise the
        release of individuals who were charged, sentenced, and incarcerated in a
        different state, but have a compelling reason to serve their parole in
        Pennsylvania. Under the same program, individuals paroled from a Pennsylvania
        prison may occasionally serve their parole in a different state.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
      totalLabel: "Total people on parole",
    },
    ParolePopulationHistorical: {
      name: "Historical Parole Population",
      methodology: `<p>
        This data includes the number of people that were on parole in Pennsylvania on
        the first day of each month over the last 20 years. This does not include
        interstate or special probation.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>
      <p>
        This data may include some individuals on parole in Pennsylvania as part of
        the interstate compact program, in which Pennsylvania agrees to supervise the
        release of individuals who were charged, sentenced, and incarcerated in a
        different state, but have a compelling reason to serve their parole in
        Pennsylvania. Under the same program, individuals paroled from a Pennsylvania
        prison may occasionally serve their parole in a different state.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
    },
    ParoleTerminationsHistorical: {
      name: "Historical Parole Successful Termination Rates",
      methodology: `<p>
        This data reports the percentage of people who successfully completed
        parole in a given month out of all people whose parole was terminated that
        month.
      </p>
      <p>
        Parole is considered successfully completed if an individual is
        discharged from parole positively, either due to the parole period
        expiring, a pardon or commutation granted by the Board of Pardons, or an
        early discharge granted by a judge. Unsuccessful completions of parole
        occur when the parole ends due to absconsion, a revocation, or a
        negative termination. Deaths, suspensions, and terminations marked as
        “other” are excluded from these calculations because they are neither
        successful nor unsuccessful.
      </p>
      <p>
        The summary percentages show the percentage of people who successfully
        completed parole in all of the months shown out of all the people whose
        parole was terminated in that time period. Individuals with multiple
        terminations during the period are counted as unsuccessful if any of the
        terminations were unsuccessful.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>
      <p>
        This data may include some individuals on parole in Pennsylvania as part of
        the interstate compact program, in which Pennsylvania agrees to supervise the
        release of individuals who were charged, sentenced, and incarcerated in a
        different state, but have a compelling reason to serve their parole in
        Pennsylvania. Under the same program, individuals paroled from a Pennsylvania
        prison may occasionally serve their parole in a different state.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
    },
    ParoleRevocationsAggregate: {
      name: "Reasons for Parole Revocation",
      methodology: `<p>
        This data includes people who were incarcerated in a DOC facility within the
        last 3 years because their parole was revoked. Revocations are included based
        on the date that the person was admitted to a DOC facility because their
        parole was revoked, not the date of the parole case closure or causal
        violation or offense.
      </p>
      <p>
        Revocation admissions are linked to parole cases closed via revocation within
        90 days of the admission. Each individual is counted once, even if they had
        multiple violation reasons or revocation proceedings from multiple supervision
        cases. If an individual has had their parole revoked multiple times in the
        last 3 years, the most recent revocation is counted. When an individual does
        have multiple violation types leading to revocation, only the most severe
        violation is displayed. New offenses are considered more severe than
        absconsions, which are considered more severe than technical violations.
        Violations of “Unknown Type” indicate individuals who were admitted to prison
        for a supervision revocation where the violation that caused the revocation
        cannot yet be determined. Revocation admissions without a supervision case
        closed via revocation in the 90 day window will always be considered of
        “Unknown Type”.
      </p>
      <p>
        Individuals occasionally serve probation and parole sentences simultaneously.
        For revoked individuals in this situation, their revocation admission is
        categorized as either a probation or a parole revocation, depending on who
        authorized the revocation admission (the parole board for parole revocations
        or the sentencing judge for probation revocations). This data includes only
        individuals with parole revocation admissions.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>
      <p>
        This data may include some individuals on parole in Pennsylvania as part of
        the interstate compact program, in which Pennsylvania agrees to supervise the
        release of individuals who were charged, sentenced, and incarcerated in a
        different state, but have a compelling reason to serve their parole in
        Pennsylvania. Under the same program, individuals paroled from a Pennsylvania
        prison may occasionally serve their parole in a different state.
      </p>
      <p>
        All calculations are updated weekly. Methodologies for these calculations may
        vary slightly from existing public reports produced by the Pennsylvania
        Department of Corrections.
      </p>`,
    },
  },
  racialDisparitiesNarrative: {
    introduction: `<p>
      In Pennsylvania, people of color are overrepresented in prison, on probation,
      and on parole.
    </p>
    <p>
      Black Pennsylvanians are {likelihoodVsWhite.BLACK} times as likely to be under
      DOC control as their white counterparts and Latino Pennsylvanians are
      {likelihoodVsWhite.HISPANIC} times as likely.
    </p>
    <aside>
      All calculations are updated weekly. Methodologies for these calculations may
      vary slightly from existing public reports produced by the Pennsylvania
      Department of Corrections.
    </aside>`,
    introductionMethodology: `<p>
      Distributions by race count individuals with more than one reported race or
      ethnicity towards the racial or ethnic identity that is least represented in
      the general population.
    </p>
    <p>
      This data may include some individuals on probation or parole in Pennsylvania
      as part of the interstate compact program, in which Pennsylvania agrees to
      supervise the release of individuals who were charged and sentenced in a
      different state, but have a compelling reason to serve their supervision in
      Pennsylvania. Under the same program, individuals placed on supervision in
      Pennsylvania may occasionally complete their supervision in a different state.
    </p>
    <p>
      All calculations are updated weekly. Methodologies for these calculations may
      vary slightly from existing public reports produced by the Pennsylvania
      Department of Corrections.
    </p>`,
    chartLabels: {
      totalPopulation: "Proportions of racial/ethnic groups in the state",
      totalSentenced:
        "Proportions of racial/ethnic groups in State Correctional Institutions",
      paroleGrant: "",
      incarceratedPopulation: "",
      otherGroups: "All other racial/ethnic groups",
      programmingParticipants: "",
      supervisionPopulation: "",
      totalPopulationSentences: "",
      revocationProportions: "Proportions of return reasons",
    },
    supervisionTypes: ["parole"],
    sections: {
      beforeCorrections: {
        title: "Disparities are already present before incarceration",
        body: `<p>
          Disparities emerge long before a person is incarcerated. By the time someone
          comes under the DOC’s care, they have been arrested, charged, convicted, and
          sentenced. Even before contact with the criminal justice system, disparities
          in community investment (education, housing, healthcare) may play an important
          role in creating the disparities that we see in sentencing data.
        </p>
        <p>
          {ethnonymCapitalized} make up {beforeCorrections.populationPctCurrent} of
          Pennsylvania’s population; they represent {beforeCorrections.correctionsPctCurrent}
          of the population sentenced to time under DOC control.
        </p>`,
        methodology: `<p>
          Individuals are counted as released to parole if they have been released from
          a period of incarceration where parole is documented as the reason for
          release. This data calculates the percent of the overall incarceration
          population and overall releases to parole over the last 3 years, or 36 months,
          who were of the selected racial or ethnic group.
        </p>
        <p>
          Distributions by race count individuals with more than one reported race or
          ethnicity towards the racial or ethnic identity that is least represented in
          the general population.
        </p>
        <p>
          This data may include some individuals on probation or parole in Pennsylvania
          as part of the interstate compact program, in which Pennsylvania agrees to
          supervise the release of individuals who were charged and sentenced in a
          different state, but have a compelling reason to serve their supervision in
          Pennsylvania. Under the same program, individuals placed on supervision in
          Pennsylvania may occasionally complete their supervision in a different state.
        </p>
        <p>
          All calculations are updated weekly. Methodologies for these calculations may
          vary slightly from existing public reports produced by the Pennsylvania
          Department of Corrections.
        </p>`,
      },
      supervision: {
        title: "How can community supervision impact disparities?",
        body: `<p>
          For individuals on parole, failure can mean revocation: a process that removes
          people from community supervision and places them in prison.
        </p>
        <p>
          {ethnonymCapitalized} represent {supervision.populationProportion36Mo} of the
          parole population; in comparison, they represent {supervision.revocationProportion36Mo}
          of returns to prison in the last 3 years.
        </p>
        <p>
          Reasons for a parole violator return can vary: {ethnonym} are revoked
          {supervision.technicalProportion36Mo} of the time for technical violations (a
          rule of supervision, rather than a crime),
          {supervision.absconsionProportion36Mo} of the time for absconding while on
          parole, and {supervision.newCrimeProportion36Mo} of the time for
          new crimes. In contrast, overall revocations for technical violations are
          {supervision.overall.technicalProportion36Mo}, revocations for absconsion
          {supervision.overall.absconsionProportion36Mo} and revocations for new crime
          {supervision.overall.newCrimeProportion36Mo}.
        </p>`,
        methodology: `<p>
          This data includes the overall supervision population and revocation
          admissions over the last 3 years, or 36 months.
        </p>
        <p>
          Revocation admissions count people who were incarcerated in a DOC facility
          because their supervision was revoked. Revocations are included based on the
          date that the person was admitted to a DOC facility because their supervision
          was revoked, not the date of the supervision case closure or causal violation
          or offense.
        </p>
        <p>
          Revocation admissions are linked to supervision cases closed via revocation
          within 90 days of the admission. Each individual is counted once, even if they
          had multiple violation reasons or revocation proceedings from multiple
          supervision cases. When an individual does have multiple violation types
          leading to revocation, only the most severe violation is displayed. New
          offenses are considered more severe than absconsions, which are considered
          more severe than technical violations. Violations of “Unknown Type” indicate
          individuals who were admitted to prison for a supervision revocation where the
          violation that caused the revocation cannot yet be determined. Revocation
          admissions without a supervision case closed via revocation in the 90 day
          window will always be considered of “Unknown Type”.
        </p>
        <p>
          Individuals occasionally serve probation and parole sentences simultaneously.
          For revoked individuals in this situation, their revocation admission is
          categorized as either a probation or a parole revocation, depending on who
          authorized the revocation admission (the parole board for parole revocations
          or the sentencing judge for probation revocations).
        </p>
        <p>
          Combined supervision counts include the number of unique individuals who have
          been admitted to a DOC facility for a supervision revocation. If an individual
          has had their probation revoked multiple times in the last 3 years, the most
          recent revocation is counted. If an individual has had both probation and
          parole revoked within the last 3 years, they will appear in the counts for
          both supervision types when broken out separately.
        </p>
        <p>
          Distributions by race count individuals with more than one reported race or
          ethnicity towards the racial or ethnic identity that is least represented in
          the general population.
        </p>
        <p>
          This data may include some individuals on probation or parole in Pennsylvania
          as part of the interstate compact program, in which Pennsylvania agrees to
          supervise the release of individuals who were charged and sentenced in a
          different state, but have a compelling reason to serve their supervision in
          Pennsylvania. Under the same program, individuals placed on supervision in
          Pennsylvania may occasionally complete their supervision in a different state.
        </p>
        <p>
          All calculations are updated weekly. Methodologies for these calculations may
          vary slightly from existing public reports produced by the Pennsylvania
          Department of Corrections.
        </p>`,
      },
      conclusion: {
        title:
          "What are we doing to further improve disparities in criminal justice in Pennsylvania?",
        body: `<div>
          The Pennsylvania Department of Corrections has supported a
          series of legislative initiatives that help create a more equitable
          justice system in the commonwealth. Under Governor Wolf’s leadership,
          Pennsylvania has enacted a new Clean Slate law, fought against the
          reinstatement of mandatory minimum sentences, and implemented two
          Justice Reinvestment initiatives (<a
          href="https://www.pccd.pa.gov/Pages/JRI%20Subpages/JRI-in-Pennsylvania-(2011-2012).aspx">2012</a>,
          <a
          href="https://www.pccd.pa.gov/Pages/JRI%20Subpages/Current-JRI-in-Pennsylvania-(2016).aspx">2016</a>).
          The Black proportion of the
          incarcerated population in Pennsylvania is at its lowest point since
          2010 partially due to these efforts.
        </div>
        <div></div>`,
        // empty because there is no chart or data in this section
        methodology: "",
      },
    },
  },
  localities: {
    Prison: {
      label: "Facility",
      entries: [
        { id: "ALL", label: "All Facilities" },
        { id: "ALB", label: "Albion" },
        { id: "BEN", label: "Benner Township" },
        { id: "CBS", label: "Cambridge Springs" },
        { id: "CAM", label: "Camp Hill" },
        { id: "CHS", label: "Chester" },
        { id: "COA", label: "Coal Township" },
        { id: "DAL", label: "Dallas" },
        { id: "FYT", label: "Fayette" },
        { id: "FRS", label: "Forest" },
        { id: "FRA", label: "Frackville" },
        { id: "GRN", label: "Greene" },
        { id: "HOU", label: "Houtzdale" },
        { id: "HUN", label: "Huntingdon" },
        { id: "LAU", label: "Laurel Highlands" },
        { id: "MAH", label: "Mahanoy" },
        { id: "MER", label: "Mercer" },
        { id: "MUN", label: "Muncy" },
        { id: "PHX", label: "Phoenix East & West" },
        { id: "PNG", label: "Pine Grove" },
        { id: "QUE", label: "Quehanna Boot Camp" },
        { id: "ROC", label: "Rockview" },
        { id: "SMI", label: "Smithfield" },
        { id: "SMR", label: "Somerset" },
        { id: "WAM", label: "Waymart" },
        { id: "OTHER", label: "Other" },
      ],
    },
    Parole: {
      label: "Office",
      entries: [
        { id: "ALL", label: "All Offices" },
        { id: "07", label: "Allentown" },
        { id: "09", label: "Altoona" },
        { id: "CO", label: "Central Office" },
        { id: "10", label: "Chester" },
        { id: "06", label: "Erie" },
        { id: "FAST", label: "Fugitive Apprehension Search Teams" },
        { id: "03", label: "Harrisburg" },
        { id: "08", label: "Mercer" },
        { id: "01", label: "Philadelphia" },
        { id: "02", label: "Pittsburgh" },
        { id: "04", label: "Scranton" },
        { id: "05", label: "Williamsport" },
      ],
    },
    CommunityCorrections: {
      label: "Facility",
      entries: [{ id: "ALL", label: "All Facilities" }],
    },
  },
};

export default content;
