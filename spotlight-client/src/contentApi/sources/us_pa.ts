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
  description:
    '<a href="https://www.cor.pa.gov">The Pennsylvania Department of Corrections (DOC)</a> is committed to enhancing public safety. Our mission is to reduce criminal behavior by providing individualized treatment and education to incarcerated individuals, resulting in successful community reintegration through accountability and positive change.',
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
  systemNarratives: {
    Prison: {
      title: "Prison",
      introduction: `<p>
        People convicted of criminal offenses may serve their sentence in a state
        prison or contracted private prison. Prisons run programming to help residents
        work towards rehabilitation and successful reentry.
      </p>`,
      sections: [
        {
          title: "Who is in custody?",
          body: `<p>
            The Department of Corrections runs a number of different facilities
            and contracted facilities across the state.
          </p>`,
          metricTypeId: "PrisonPopulationCurrent",
        },
        {
          title: "How has the incarcerated population changed over time?",
          body: `<p>
          Broadly speaking, increased activity in earlier parts of the criminal justice
          system (such as arrests and sentencing) will result in increases in the prison
          population. Changes in sentence lengths and revocations from community
          supervision may also contribute to the rise and fall of this number.
          </p>`,
          metricTypeId: "PrisonPopulationHistorical",
        },
        {
          title: "Who is in a transitional facility?",
          body: `<p>
            People who are nearing the end of their prison term may be admitted to a
            community correction center in advance of their release from incarceration.
            These residential facilities, operated by the DOC or private contractors,
            offer supportive programming to help prepare people for a successful
            return to the community.
          </p>`,
          metricTypeId: "CommunityCorrectionsPopulationCurrent",
        },
        {
          title: "How did they get there?",
          body: `<p>
            There are many possible paths for someone to be admitted to prison. Many of
            the admissions to prison are not “new admissions” (that is, admitted for the
            first time as part of their sentence), but are actually people who are pulled
            back to prison from community supervision due to a violation or new crime.
          </p>
          <p>
            Please note that probation revocations are included in the “new admissions” in
            this visualization to the right due to lack of detail in the source data. 
          </p>`,
          metricTypeId: "PrisonAdmissionReasonsCurrent",
        },
        {
          title: "How many people end up back in prison?",
          body: `<p>
            After release from prison, a significant proportion of formerly incarcerated
            individuals end up back in prison or charged with additional crimes. This is
            typically termed “recidivism.”
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
      introduction: `<p>
        Parole is a period of supervised release after prison. People on parole must
        regularly check in with a parole officer, who ensures that they are following
        all the requirements of the release. If these requirements are violated, the
        person’s parole may be “revoked” and they will be sent back to prison.
      </p>`,
      sections: [
        {
          title: "Who is on parole?",
          body: `<p>
            People on parole have generally completed certain requirements of their
            sentence (such as a minimum time spent) and have been approved for
            release by a parole board. Ideally, the corrections system will ensure
            that the person is set up for success before they are released.
          </p>`,
          metricTypeId: "ParolePopulationCurrent",
        },
        {
          title: "How has the parole population changed over time?",
          body: `<p>
            Broadly speaking, increased activity in earlier parts of the criminal justice
            system (such as arrests and sentencing) will result in increases in the parole
            population. Changes in parole sentence lengths and earlier releases from
            prison may also contribute to the rise and fall of this number.
          </p>`,
          metricTypeId: "ParolePopulationHistorical",
        },
        {
          title: "What happens after parole?",
          body: `<p>
            A successful end to one’s parole term is a “discharge,” after which they are
            no longer supervised by a parole officer; failure to succeed generally means
            a return to prison, or “revocation.” This success rate is improved by
            addressing critical needs of justice-involved individuals, including employment,
            housing, and need-based care.
          </p>`,
          metricTypeId: "ParoleTerminationsHistorical",
        },
        {
          title: "Why do revocations happen?",
          body: `<p>
            Revocations occur when a person on parole violates a condition of their
            supervision or commits a new crime and is reincarcerated as a result. Reasons
            for revocation generally fall into one of three categories: technical violation, new
            offense, and absconsion.
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
        facility. It does not include individuals incarcerated in county jails.
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
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
        Please note that the “New Admissions and Probation Revocations” category
        contains both new prison and probation commitments from court sentences.
        This is due to limitations in the data available from Pennsylvania
        Department of Corrections and may be disaggregated at a later date.
      </p>`,
      fieldMapping: [
        {
          categoryLabel: "New admissions and probation revocations",
          fieldName: "new_admission_count",
        },
        {
          categoryLabel: "Parole revocations",
          fieldName: "parole_revocation_count",
        },
        { categoryLabel: "Other", fieldName: "other_count" },
      ],
    },
    PrisonRecidivismRateHistorical: {
      name: "Cumulative Recidivism Rates",
      methodology: `<p>
        The DOC uses three different measures of recidivism: rearrest, reincarceration,
        and overall recidivism. This data depicts overall recidivism, which is
        defined by the DOC as the first instance of any type of rearrest or reincarceration
        after the individual is released from the DOC.
      </p>
      <p>
        Rearrest is measured as the first instance of arrest after inmates are
        released from state prison. Reincarceration is measured as the first
        instance of returning to state prison after inmates are released from
        state prison. Overall recidivism is measured as the first instance of any
        type of rearrest or reincarceration after inmates are released from state
        prison.
      </p>`,
    },
    PrisonRecidivismRateSingleFollowupHistorical: {
      name: "Recidivism Rates Over Time",
      methodology: `<p>
        The DOC uses three different measures of recidivism: rearrest, reincarceration,
        and overall recidivism. This data depicts overall recidivism, which is
        defined by the DOC as the first instance of any type of rearrest or reincarceration
        after the individual is released from the DOC.
      </p>
      <p>
        Rearrest is measured as the first instance of arrest after inmates are
        released from state prison. Reincarceration is measured as the first
        instance of returning to state prison after inmates are released from
        state prison. Overall recidivism is measured as the first instance of any
        type of rearrest or reincarceration after inmates are released from state
        prison.
      </p>`,
    },
    CommunityCorrectionsPopulationCurrent: {
      name: "Community Correction Centers",
      methodology: `
      <p>
        This data includes all individuals that are currently incarcerated in a
        specified “community corrections center,” under the supervision of
        Pennsylvania’s Department of Corrections. 
      </p>
      <p>
        In distributions by age, individuals are counted towards the age group they
        fall into as of the reporting date. Gender distributions only include male and
        female due to low numbers of other reported genders. Distributions by race
        count individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in the general population.
      </p>`,
      totalLabel: "Total people in community correction centers",
    },

    ParolePopulationCurrent: {
      name: "Current Parole Population",
      methodology: `<p>
        This data includes people currently on parole in Pennsylvania. The offices
        associated with this data indicate individuals who are being supervised by a
        parole officer stationed in that office.
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
      </p>`,
      totalLabel: "Total people on parole",
    },
    ParolePopulationHistorical: {
      name: "Historical Parole Population",
      methodology: `<p>
        This data includes the number of people that were on parole in Pennsylvania on
        the first day of each month over the last 20 years.
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
    </p>`,
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
    </p>`,
    chartLabels: {
      totalPopulation: "Proportions of racial/ethnic groups in the state",
      totalSentenced:
        "Proportions of racial/ethnic groups sentenced and under DOC control",
      paroleGrant: "People released on parole",
      incarceratedPopulation: "Overall prison population",
      otherGroups: "All other racial/ethnic groups",
      programmingParticipants: "",
      supervisionPopulation: "All people under supervision",
      totalPopulationSentences: "All people sentenced and under DOC control",
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
          Pennsylvania’s population, but {beforeCorrections.correctionsPctCurrent} of
          the population sentenced to time under DOC control.
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
          parole population, but were {supervision.revocationProportion36Mo}
          of revocation admissions to prison in the last 3 years.
        </p>
        <p>
          Reasons for a revocation can vary: {ethnonym} are revoked
          {supervision.technicalProportion36Mo} of the time for technical violations (a
          rule of supervision, rather than a crime),
          {supervision.absconsionProportion36Mo} of the time for absconsion from
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
        </p>`,
      },
      conclusion: {
        title:
          "What are we doing to further improve disparities in criminal justice in Pennsylvania?",
        body: `<p>
          The Pennsylvania Department of Corrections has supported a
          series of legislative initiatives that help create a more equitable
          justice system in the commonwealth. Under Governor Wolf’s leadership,
          Pennsylvania has enacted a new Clean Slate law, fought against the
          reinstatement of mandatory minimum sentences, and implemented two
          Justice Reinvestment initiatives (2012, 2016). The Black proportion of the
          incarcerated population in Pennsylvania is at its lowest point since
          2010 partially due to these efforts.
        </p>`,
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
        { id: "WAM", label: "Waymart" },
        { id: "CCC", label: "Community Correction Centers" },
        { id: "OTHER", label: "Other Facilities" },
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
