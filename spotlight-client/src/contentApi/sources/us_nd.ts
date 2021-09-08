// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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
import { ageGroup, gender, raceOrEthnicity } from "./methodologyBoilerplate";
import programRegionsTopology from "./usNdProgramRegions";

// localities for both sentencing and probation
const judicialDistricts = [
  { id: "ALL", label: "All Districts" },
  { id: "EAST_CENTRAL", label: "East Central" },
  { id: "NORTH_CENTRAL", label: "North Central" },
  { id: "NORTHEAST", label: "Northeast" },
  { id: "NORTHEAST_CENTRAL", label: "Northeast Central" },
  { id: "NORTHWEST", label: "Northwest" },
  { id: "SOUTH_CENTRAL", label: "South Central" },
  { id: "SOUTHEAST", label: "Southeast" },
  { id: "SOUTHWEST", label: "Southwest" },
  { id: "OTHER", label: "Other" },
];

const raceOrEthnicityBoilerplate = `${raceOrEthnicity} The “Other” category includes Asian
and Native Hawaiian or other Pacific Islander individuals due to low counts of these
reported racial identities in North Dakota.`;

const demographicsBoilerplate = `<p>${ageGroup} ${gender} ${raceOrEthnicityBoilerplate}</p>`;

const sentencingBoilerplate = `<p>District selection filters the data to only individuals
whose sentence was imposed by a judge from a particular judicial district. Individuals are
linked to the judicial district associated with their charge (for individuals sentenced to
incarceration) or to the judicial district that encompasses the county in which
their offense took place (for individuals sentenced to probation). Some individuals have
multiple sentences resulting from multiple charges. When this occurs, one charge is considered
the “controlling” charge, meaning the sentence associated with this charge is currently the
most restrictive sentence being served. For individuals currently incarcerated, the sentence
associated with the controlling charge determines the judicial district in which the person is
counted. Individuals on supervision are counted in each judicial district for which they
are serving a sentence.</p>`;

const prisonBoilerplate = `<p>This data concerns individuals in prison in North Dakota.
It does not include individuals incarcerated in county jails.</p>`;

const probationBoilerplate = `<p>This data may include some individuals on probation in North
Dakota as part of the interstate compact program, in which North Dakota agrees to supervise
individuals who were charged and sentenced in a different state, but have a compelling reason
to serve their probation in North Dakota. Under the same program, individuals placed on probation
from a North Dakota court may occasionally serve their probation in a different state.</p>`;

const probationDistrictBoilerplate = `<p>The districts associated with this data indicate individuals
whose probation sentence was imposed by a judge from a particular judicial district, determined by the
judicial district that encompasses the county in which the offense took place.</p>`;

const paroleBoilerplate = `<p>This data may include some individuals on parole in North
Dakota as part of the interstate compact program, in which North Dakota agrees to supervise
the release of individuals who were charged, sentenced, and incarcerated in a different state,
but have a compelling reason to serve their parole in North Dakota. Under the same program,
individuals paroled from a North Dakota prison may occasionally serve their parole in a
different state.</p>`;

const paroleOfficerBoilerplate = `<p>The offices associated with this data indicate individuals
who are being supervised by a parole officer stationed in that office.</p>`;

const supervisionBoilerplate = `<p>This data may include some individuals on probation or parole in
North Dakota as part of the interstate compact program, in which North Dakota agrees to supervise
individuals who were charged and sentenced in a different state, but have a compelling reason to
serve their supervision in North Dakota. Under the same program, individuals placed on supervision
in a North Dakota court may occasionally complete their supervision in a different state.</p>`;

const content: TenantContent = {
  name: "North Dakota",
  description:
    "Our mission is to transform lives, influence change, and strengthen community. Transparency is a critical element of our mission; sharing information builds greater accountability between the DOCR and the communities we serve.",
  coBrandingCopy:
    'Produced in collaboration with <a href="https://www.docr.nd.gov">the North Dakota Department of Corrections and Rehabilitation</a>.',
  feedbackUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSc3_wV2ltGumMdGTcLehUM41tQri0ZW5RjIKh0JJlhpJGE9Hg/viewform",
  demographicCategories: {
    raceOrEthnicity: [
      "AMERICAN_INDIAN_ALASKAN_NATIVE",
      "BLACK",
      "HISPANIC",
      "WHITE",
      "OTHER",
    ],
  },
  smallDataDisclaimer: `Please always take note of the number of people associated with each
    proportion presented here; in cases where the counts are especially
    low, the proportion may not be statistically significant and therefore
    not indicative of long-term trends.`,
  metrics: {
    SentencePopulationCurrent: {
      name: "Sentenced Population",
      methodology: `This data includes all individuals that are currently incarcerated, on parole, or on probation
        in North Dakota. ${demographicsBoilerplate} ${sentencingBoilerplate}`,
      totalLabel: "Total people sentenced",
    },
    SentenceTypesCurrent: {
      name: "Sentence Types",
      methodology: `Incarceration includes any sentence that begins with a period of incarceration in a ND DOCR facility.
        Probation includes any sentence that begins with a period of probation under the supervision of a
        ND DOCR probation officer. <p>Of note, individuals’ current status (incarcerated or on supervision)
        may differ from their sentence category (incarceration or probation). Individuals now on parole after
        being incarcerated are still counted in the incarceration sentence category. Individuals who have had
        their probation revoked and are now in prison are likewise included in the probation sentence category
        because their sentence was first to probation.</p><p>It is possible for an individual to be serving both
        incarceration and probation sentences simultaneously. These individuals are counted in the “Both” category.</p>
        ${demographicsBoilerplate} ${sentencingBoilerplate}`,
    },
    PrisonPopulationCurrent: {
      name: "Current Prison Population",
      methodology: `This data includes all individuals that are currently incarcerated in a ND DOCR facility.
        It does not include individuals incarcerated in county jails nor individuals currently
        serving their prison sentence in the community through the Community Placement Program.
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
      totalLabel: "Total people in prison",
    },
    PrisonPopulationHistorical: {
      name: "Historical Prison Population",
      methodology: `This data includes the number of people that were incarcerated in a ND DOCR facility on the
        first day of each month over the last 20 years. It does not include individuals incarcerated
        in county jails nor individuals serving their prison sentence in the community through the
        Community Placement Program. ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonAdmissionReasonsCurrent: {
      name: "Reason for Incarceration",
      methodology: `This data includes the original reason for admission for all individuals currently incarcerated
        in a ND DOCR facility. When an individual is admitted to a state prison, the reason for the admission
        is documented by prison officials. These categories are pulled from that documentation.
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonStayLengthAggregate: {
      name: "Length of Prison Stay",
      methodology: `This data reports how long (in years) individuals spent in prison prior to their
        first official release for a specific sentence. It includes individuals released
        in the past 3 years who, prior to release, were serving a new sentence of
        incarceration or were incarcerated due to revocation of probation. It excludes
        individuals incarcerated due to revocation of parole. Individuals released from
        prison for a reason other than completion of sentence, commutation of sentence,
        parole, or death are also excluded. Of note, this data does include time spent
        in the Community Placement Program prior to release as part of time served.
        Individuals serving life sentences will only be included upon their death.
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonReleaseTypeAggregate: {
      name: "Placement After Prison",
      methodology: `This data includes all individuals released in the last 3 years, including releases
        directly from the Community Placement Program. When an individual is released from a
        state prison, the reason for the release is documented by prison officials. These
        categories are pulled from that documentation. Facility release reasons that do not
        typically correlate with an end to the period of incarceration, such as transfers
        between facilities, are not shown here. ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonRecidivismRateHistorical: {
      name: "Cumulative Recidivism Rates",
      methodology: `This data reports reincarceration recidivism rates, which is the proportion of individuals
        released from a ND DOCR facility that return to a ND DOCR facility at some point in the
        future. The releases are grouped by the calendar year in which the release occurred, and
        the rates are calculated as the percentage of the people released that have returned to
        incarceration after each year since the release. Individuals are included in the release
        cohort if they were released for serving their sentence or were conditionally released into
        supervision. Admissions to incarceration for new court commitments or due to revocations of
        supervision are counted as instances of reincarceration recidivism. ${demographicsBoilerplate}
        ${prisonBoilerplate}`,
    },
    PrisonRecidivismRateSingleFollowupHistorical: {
      name: "Recidivism Rates Over Time",
      methodology: `This data reports the reincarceration recidivism rate for a set number of years
        since the release, for the 10 most recent release cohorts. ${demographicsBoilerplate}
        ${prisonBoilerplate}`,
    },
    ProbationPopulationCurrent: {
      name: "Current Probation Population",
      methodology: `This data includes people currently on probation in North Dakota.
        ${demographicsBoilerplate} ${probationBoilerplate} ${probationDistrictBoilerplate}`,
      totalLabel: "Total people on probation",
    },
    ProbationPopulationHistorical: {
      name: "Historical Probation Population",
      methodology: `This data includes the number of people that were on probation in
        North Dakota on the first day of each month over the last 20 years.
        ${demographicsBoilerplate} ${probationBoilerplate}`,
    },
    ProbationSuccessHistorical: {
      name: "Historical Probation Completion Rates",
      methodology: `This data reports the percentage of people projected to complete probation
        in a given month who have successfully completed probation by the end of that month.
        <p>Probation is considered successfully completed if the individual is discharged from
        probation positively or if a probation period expires. Unsuccessful completion of probation
        occurs when probation ends due to absconsion, revocation, or negative termination. Deaths,
        suspensions, and terminations marked as “other” are excluded from these calculations because
        they are neither successful nor unsuccessful.</p><p>Individuals whose probation is terminated
        prior to their projected completion month are counted in the month in which their probation
        is scheduled to complete, while individuals who have not yet completed probation by their
        projected completion date are excluded. For example, if 15 people are projected to
        complete probation in 12 months, 5 are revoked this month, 3 are discharged early in
        8 months, 2 complete parole in 12 months, and 5 do not complete probation, the completion
        rate in 12 months will be 50%, as 10 of the people projected to complete probation will
        have actually completed probation, 5 of them successfully.</p> ${demographicsBoilerplate}
        ${probationBoilerplate} ${probationDistrictBoilerplate}`,
    },
    ProbationRevocationsAggregate: {
      name: "Reasons for Probation Revocation",
      methodology: `This data includes people who were incarcerated in a DOCR facility within the last
        3 years because their probation was revoked. Revocations are included based on the
        date that the person was admitted to a DOCR facility because their probation was
        revoked, not the date of the probation case closure or causal violation or offense.
        <p>Revocation admissions are linked to supervision cases closed via revocation within
        90 days of the admission. Each individual is counted once, even if they had multiple
        violation reasons or revocation proceedings from multiple supervision cases. If an
        individual had their probation revoked multiple times in the last 3 years, the most
        recent revocation is counted. When an individual does have multiple violation types
        leading to revocation, only the most severe violation is displayed. New offenses are
        considered more severe than absconsions, which are considered more severe than technical
        violations. Violations of “Unknown Type” indicate individuals who were admitted to prison
        for a supervision revocation where the violation that caused the revocation cannot yet be
        determined. Revocation admissions without a supervision case closed via revocation in the
        90 day window will always be considered of “Unknown Type”.</p><p>Individuals occasionally
        serve probation and parole sentences simultaneously. For revoked individuals in this situation,
        their revocation admission is categorized as either a probation or a parole revocation,
        depending on who authorized the revocation admission (the parole board for parole
        revocations or the sentencing judge for probation revocations). This data includes
        only individuals with probation revocation admissions. Individuals on both parole
        and probation with a parole revocation admission are included in the parole page.</p>
        ${demographicsBoilerplate} ${probationBoilerplate}`,
    },
    ProbationProgrammingCurrent: {
      name: "Free Through Recovery Program Participation in Probation",
      methodology: `This data includes the total number of people on probation who are actively
        enrolled in Free Through Recovery (FTR). Free Through Recovery is run jointly
        with the Department of Health and Human Services (DHS): as a result, FTR enrollment
        is aggregated into the 8 DHS service regions of the provider locations at which
        individuals are enrolled. ${probationBoilerplate}`,
    },
    ParolePopulationCurrent: {
      name: "Current Parole Population",
      methodology: `This data includes people currently on parole in North Dakota.
        ${demographicsBoilerplate} ${paroleBoilerplate} ${paroleOfficerBoilerplate}`,
      totalLabel: "Total people on parole",
    },
    ParolePopulationHistorical: {
      name: "Historical Parole Population",
      methodology: `This data includes the number of people that were on parole in North Dakota
        on the first day of each month over the last 20 years. ${demographicsBoilerplate}
        ${paroleBoilerplate}`,
    },
    ParoleSuccessHistorical: {
      name: "Historical Parole Completion Rates",
      methodology: `This data reports the percentage of people projected to complete parole
        in a given month who have successfully completed parole by the end of that month.
        <p>Parole is considered successfully completed if an individual is discharged from
        parole positively or if a parole period expires. Unsuccessful completions of parole occur
        when the parole ends due to absconsion, a revocation, or a negative termination. Deaths,
        suspensions, and terminations marked as “other” are excluded from these calculations
        because they are neither successful nor unsuccessful.</p><p>Individuals whose parole
        is terminated prior to their projected completion month are counted in the month in
        which their parole is scheduled to complete, while individuals who have not yet
        completed parole by their projected completion date are excluded. For example, if 15
        people are projected to complete parole in 12 months, 5 are revoked this month, 3
        are discharged early in 8 months, 2 complete parole in 12 months, and 5 do not
        complete parole, the completion rate in 12 months will be 50%, as 10 of the people
        projected to complete parole will have actually completed parole, 5 of them
        successfully.</p> ${demographicsBoilerplate} ${paroleBoilerplate}`,
    },
    ParoleRevocationsAggregate: {
      name: "Reasons for Parole Revocation",
      methodology: `This data includes people who were incarcerated in a DOCR facility within the
        last 3 years because their parole was revoked. Revocations are included based on the date
        that the person was admitted to a DOCR facility because their parole was revoked, not the
        date of the parole case closure or causal violation or offense.<p>Revocation admissions
        are linked to parole cases closed via revocation within 90 days of the admission. Each
        individual is counted once, even if they had multiple violation reasons or revocation
        proceedings from multiple supervision cases. If an individual has had their parole revoked
        multiple times in the last 3 years, the most recent revocation is counted. When an
        individual does have multiple violation types leading to revocation, only the most
        severe violation is displayed. New offenses are considered more severe than absconsions,
        which are considered more severe than technical violations. Violations of “Unknown Type”
        indicate individuals who were admitted to prison for a supervision revocation where the
        violation that caused the revocation cannot yet be determined. Revocation admissions
        without a supervision case closed via revocation in the 90 day window will always be
        considered of “Unknown Type”.</p><p>Individuals occasionally serve probation and parole
        sentences simultaneously. For revoked individuals in this situation, their revocation
        admission is categorized as either a probation or a parole revocation, depending on
        who authorized the revocation admission (the parole board for parole revocations or
        the sentencing judge for probation revocations). This data includes only individuals
        with parole revocation admissions. Individuals on both parole and probation with a
        probation revocation admission are included in the probation page.</p>
        ${demographicsBoilerplate} ${paroleBoilerplate}`,
    },
    ParoleProgrammingCurrent: {
      name: "Free Through Recovery Program Participation in Parole",
      methodology: `This data includes the total number of people on parole who are actively enrolled
        in Free Through Recovery (FTR). Free Through Recovery is run jointly with the Department of
        Health and Human Services (DHS): as a result, FTR enrollment is aggregated into the 8 DHS service
        regions of the provider locations at which individuals are enrolled. ${paroleBoilerplate}`,
    },
  },
  systemNarratives: {
    Sentencing: {
      title: "Sentencing",
      previewTitle: "Demographics of Individuals Sentenced to Prison",
      introduction:
        "When someone is convicted of a crime, they receive a sentence that is meant to correspond with facts, circumstances and the severity of the offense and the offender, to provide retribution to the victim and set a course for rehabilitation. The data below gives an overview of sentences for people who enter the North Dakota corrections system — that is, people who are sentenced to serve time in prison or on supervised probation.",
      sections: [
        {
          title: "Who is being sentenced?",
          body:
            "After being convicted of a Class A misdemeanor or greater offense by a district court, a person may be sentenced to time in prison or probation, at which point they come under the jurisdiction of the Department of Corrections and Rehabilitation (DOCR). These charts show everyone currently involved with the North Dakota DOCR.",
          metricTypeId: "SentencePopulationCurrent",
        },
        {
          title: "What types of sentences do people receive?",
          body:
            "Sentences that lead to individuals coming under DOCR jurisdiction fall broadly into two categories: Probation and Incarceration.",
          metricTypeId: "SentenceTypesCurrent",
        },
      ],
      preview: "SentencePopulationCurrent",
    },
    Prison: {
      title: "Prison",
      previewTitle: "Prison Population over Time",
      introduction:
        "People sentenced for a Class A misdemeanor or greater offense may serve their sentence in a DOCR prison or contract facility. Prisons run programming to help residents work towards rehabilitation and successful reentry.",
      preview: "PrisonPopulationHistorical",
      sections: [
        {
          metricTypeId: "PrisonPopulationCurrent",
          title: "Who is in custody?",
          body:
            "The North Dakota Department of Corrections and Rehabilitation (DOCR) runs a number of different facilities and contracts with facilities across the state.",
        },
        {
          metricTypeId: "PrisonPopulationHistorical",
          title: "How has the incarcerated population changed over time?",
          body:
            "Broadly speaking, increased activity in earlier parts of the criminal justice system (such as arrests and sentencing) will result in increases in the prison population. Changes in sentence lengths, revocations from community supervision, etc. may also contribute to the rise and fall of this number.",
        },
        {
          metricTypeId: "PrisonAdmissionReasonsCurrent",
          title: "How did they get there?",
          body:
            "There are many possible paths for someone to come to prison. “New Admission” represents someone being incarcerated for the first time as part of their sentence. “Revocation” represents when someone on probation or parole is sent to (or back to) prison.",
        },
        {
          metricTypeId: "PrisonStayLengthAggregate",
          title: "How long are they there?",
          body:
            "Each person in prison has a court-decided sentence determining their maximum length of stay. The actual time that someone stays in prison can be reduced through good behavior credits and parole (discretionary decision by Parole Board). While North Dakota requires those convicted of violent offenses to remain in prison for at least 85 percent of their sentence, most people serve less time in prison than their maximum length of stay.",
        },
        {
          metricTypeId: "PrisonReleaseTypeAggregate",
          title: "Where do they go from there?",
          body:
            "Once released, the DOCR’s goal is to help citizens successfully reintegrate into their communities. In most cases, formerly incarcerated people will be placed on community parole or probation supervision.",
        },
        {
          metricTypeId: "PrisonRecidivismRateHistorical",
          title: "How many people end up back in prison?",
          body:
            "After release from prison, a significant proportion of formerly incarcerated individuals end up back in prison. This is typically termed “recidivism.” This chart shows recidivism as reincarceration; that is, the proportion of individuals who are incarcerated again at some point after their release.<p><strong>Note:</strong> Race or Ethnicity, Gender, and Age Group views are disabled unless a single Cohort is selected.</p>",
        },
        {
          metricTypeId: "PrisonRecidivismRateSingleFollowupHistorical",
          title: "How has the recidivism rate changed over time?",
          body:
            "We can also observe the recidivism rate over time for a given number of years after original release.",
        },
      ],
    },
    Probation: {
      title: "Probation",
      previewTitle: "Revocations from Probation, by Type",
      introduction:
        "Probation refers to adults whom the courts place on supervision in the community in lieu of or in addition to incarceration. In North Dakota, probation is managed by the Department of Corrections and Rehabilitation (DOCR).",
      preview: "ProbationRevocationsAggregate",
      sections: [
        {
          title: "Who is on probation?",
          body:
            "Judges may sentence people to a period of probation for a Class A misdemeanor crime or greater. Probation can be either a suspended sentence in which the judge has decided on a carceral sentence but has declined to carry it out unless the defendant does not successfully complete a period of probation supervision, or a deferred sentence, in which the defendant has an opportunity for the crime to be recorded as “dismissed” on the criminal record.",
          metricTypeId: "ProbationPopulationCurrent",
        },
        {
          title: "How has the probation population changed over time?",
          body:
            "Broadly speaking, increased activity in earlier parts of the criminal justice system (such as arrests and sentencing) will result in increases in the probation population. Changes in probation sentence lengths, etc. may also contribute to the rise and fall of this number.",
          metricTypeId: "ProbationPopulationHistorical",
        },
        {
          title: "What happens after probation?",
          body:
            "After probation, a person may be successfully discharged or revoked to prison. Take a look at how the rate of successful probation completion has changed over time, and how the overall rate of successful probation completion varies by demographic.",
          metricTypeId: "ProbationSuccessHistorical",
        },
        {
          title: "Why do revocations happen?",
          body:
            "Revocations happen when a person on probation violates a condition of their supervision or commits a new crime. In North Dakota, probation revocations fall into one of three categories: technical violation, new offense, and absconsion.",
          metricTypeId: "ProbationRevocationsAggregate",
        },
        {
          title: "Free Through Recovery program",
          body:
            '<a href="https://www.behavioralhealth.nd.gov/addiction/FTR-old" >Free Through Recovery (FTR)</a> is a community based behavioral health program designed to increase recovery support services to individuals involved with the criminal justice system who have behavioral health concerns. This map shows the number of people enrolled in the FTR program today.',
          metricTypeId: "ProbationProgrammingCurrent",
        },
      ],
    },
    Parole: {
      title: "Parole",
      previewTitle: "Free Through Recovery' Program, Participants Statewide",
      introduction:
        "Parole is a period of supervised release after prison. Releases from prison to parole are granted by the parole board. People on parole must regularly check in with their parole officer, who ensures that they are following all the requirements of the release. If these expectations are violated, the person’s parole may be revoked.",
      preview: "ParoleProgrammingCurrent",
      sections: [
        {
          title: "Who is on parole?",
          body:
            "Parole is granted to people in prison with a track record of good behavior as a way to complete their sentences in their communities.",
          metricTypeId: "ParolePopulationCurrent",
        },
        {
          title: "How has the parole population changed over time?",
          body:
            "Broadly speaking, increased activity in earlier parts of the criminal justice system (such as arrests and sentencing) will result in increases in the parole population. Changes in parole sentence lengths, earlier releases from prison, etc. may also contribute to the rise and fall of this number.",
          metricTypeId: "ParolePopulationHistorical",
        },
        {
          title: "What happens after parole?",
          body:
            "After parole, a person may be successfully discharged or revoked to prison. Take a look at how the rate of successful parole completion has changed over time, and how the overall rate of successful parole completion varies by demographic.",
          metricTypeId: "ParoleSuccessHistorical",
        },
        {
          title: "Why do revocations happen?",
          body:
            "Revocations happen when a person on parole violates a condition of their supervision or commits a new crime. In North Dakota, parole revocations fall into one of three categories: technical violation, new offense, and absconsion.",
          metricTypeId: "ParoleRevocationsAggregate",
        },
        {
          title: "Free Through Recovery program",
          body:
            '<a href="https://www.behavioralhealth.nd.gov/addiction/FTR-old" >Free Through Recovery (FTR)</a> is a community based behavioral health program designed to increase recovery support services to individuals involved with the criminal justice system who have behavioral health concerns. This map shows the number of people enrolled in the FTR program today.',
          metricTypeId: "ParoleProgrammingCurrent",
        },
      ],
    },
  },
  localities: {
    Sentencing: {
      label: "Judicial District",
      entries: judicialDistricts,
    },
    Prison: {
      label: "Facility",
      entries: [
        { id: "ALL", label: "All Facilities" },
        { id: "BTC", label: "Bismarck Transition Center" },
        { id: "DWCRC", label: "Dakota Women's Correctional" },
        { id: "FTPFAR", label: "Fargo-Female Transition Program" },
        { id: "MTPFAR", label: "Fargo-Male Transition Program" },
        { id: "GFC", label: "Grand Forks County Correctional" },
        { id: "JRCC", label: "James River Correctional Center" },
        { id: "LRRP", label: "Lake Region Residential Reentry Center" },
        { id: "FTPMND", label: "Mandan-Female Transition Program" },
        { id: "MTPMND", label: "Mandan-Male Transition Program" },
        { id: "MRCC", label: "Missouri River Correctional" },
        { id: "NDSP", label: "North Dakota State Penitentiary" },
        { id: "TRC", label: "Tompkins Rehabilitation And Corrections Center" },
      ],
    },
    Probation: {
      label: "Judicial District",
      entries: judicialDistricts,
    },
    Parole: {
      label: "Office",
      entries: [
        { label: "All Offices", id: "ALL" },
        { label: "Beulah", id: "16" },
        { label: "Bismarck", id: "1" },
        { label: "Bottineau", id: "14" },
        { label: "Central Office", id: "17" },
        { label: "Devils Lake", id: "6" },
        { label: "Dickinson", id: "11" },
        { label: "Fargo", id: "4" },
        { label: "Grafton", id: "12" },
        { label: "Grand Forks", id: "5" },
        { label: "Jamestown", id: "2" },
        { label: "Mandan", id: "13" },
        { label: "Minot", id: "3" },
        { label: "Oakes", id: "15" },
        { label: "Rolla", id: "8" },
        { label: "Wahpeton", id: "7" },
        { label: "Washburn", id: "9" },
        { label: "Watford City", id: "18" },
        { label: "Williston", id: "10" },
      ],
    },
    ProgramRegions: {
      label: "Region",
      entries: [
        { id: "1", label: "Region 1" },
        { id: "2", label: "Region 2" },
        { id: "3", label: "Region 3" },
        { id: "4", label: "Region 4" },
        { id: "5", label: "Region 5" },
        { id: "6", label: "Region 6" },
        { id: "7", label: "Region 7" },
        { id: "8", label: "Region 8" },
      ],
    },
  },
  topologies: {
    ProgramRegions: {
      aspectRatio: 5 / 3,
      topology: programRegionsTopology,
    },
  },
  racialDisparitiesNarrative: {
    chartLabels: {
      totalPopulation: "Proportions of races in the state",
      totalSentenced: "Proportions of races sentenced and under DOCR control",
      paroleGrant: "People released on parole",
      incarceratedPopulation: "Overall prison population",
      otherGroups: "All other racial/ethnic groups",
      programmingParticipants: "Free Through Recovery active participants",
      supervisionPopulation: "All people under supervision",
      totalPopulationSentences: "All people sentenced and under DOCR control",
      revocationProportions: "Proportions of revocation reasons",
    },
    introduction: `<p>In North Dakota, people of color are overrepresented in prison,
      on probation, and on parole.</p>
      <p>Black North Dakotans are {likelihoodVsWhite.BLACK} times as likely to be under DOCR control
      as their white counterparts, Latino North Dakotans are {likelihoodVsWhite.HISPANIC} times as
      likely, and Native American North Dakotans {likelihoodVsWhite.AMERICAN_INDIAN_ALASKAN_NATIVE} times.</p>`,
    introductionMethodology: `${raceOrEthnicityBoilerplate} ${supervisionBoilerplate}`,
    sections: {
      beforeCorrections: {
        title: "Disparities are already present before incarceration",
        body: `<p>Disparities emerge long before a person is incarcerated. By the time
          someone comes under the DOCR’s care, they have been arrested, charged, convicted,
          and sentenced.<sup>1</sup> Even before contact with the criminal justice system,
          disparities in community investment (education, housing, healthcare) may
          play an important role in creating the disparities that we see in sentencing data.</p>
          <p>{ethnonymCapitalized} make up {beforeCorrections.populationPctCurrent} of North Dakota’s
          population, but {beforeCorrections.correctionsPctCurrent} of the population sentenced
          to time under DOCR control.</p>
          <aside>1. This dashboard only focuses on data from DOCR at the moment, which is why
          disparities in arrests and charging aren’t shown. We’re working with colleagues across
          the state to show the entire criminal justice system end-to-end as this page evolves.</aside>`,
        methodology: `The source of data for racial and ethnic proportions overall in
          North Dakota is the US Census Bureau. The proportion under DOCR control is the percent of
          individuals currently incarcerated or under community supervision of a given racial or
          ethnic group.<p>${raceOrEthnicityBoilerplate}</p>${supervisionBoilerplate}`,
      },
      sentencing: {
        title: "How can sentencing impact disparities?",
        body: `<p>Many parts of the criminal justice system involve human judgment, creating the potential
          for disparities to develop over time. Sentences are imposed based on the type and severity of crime.
          In many cases, courts have some discretion over what sentence to impose on a person convicted of an
          offense. In the aggregate, these variations in sentencing add up to significant trends.</p>
          <p>Currently, {sentencing.incarcerationPctCurrent} of {ethnonym} under DOCR jurisdiction are
          serving incarceration sentences and {sentencing.probationPctCurrent} are serving probation sentences,
          a {sentencing.comparison} percentage serving incarceration sentences compared to the overall distribution of
          {sentencing.overall.incarcerationPctCurrent} serving incarceration sentences versus
          {sentencing.overall.probationPctCurrent} serving probation sentences.<p>`,
        methodology: `Incarceration includes any sentence that begins with a period of incarceration in a
          ND DOCR facility. Probation includes any sentence that begins with a period of probation under the
          supervision of a ND DOCR probation officer.
          <p>Of note, individuals’ current status (incarcerated or on supervision) may differ from their sentence
          category (incarceration or probation). Individuals now on parole after being incarcerated are still counted
          in the incarceration sentence category. Individuals who have had their probation revoked and are now in
          prison are likewise included in the probation sentence category because their sentence was first to probation.</p>
          <p>It is possible for an individual to be serving both an incarceration and probation sentence simultaneously.
          For this reason, the sum of the percentage of individuals serving each type of sentence may be greater than 100%.</p>
          <p>${raceOrEthnicityBoilerplate}</p>${supervisionBoilerplate}`,
      },
      releasesToParole: {
        title: "How can parole grant rates impact disparities?",
        body: `<p>People sentenced to a prison term can serve the end-portion of their term while supervised
          in the community, through the parole process.</p>
          <p>The parole process is governed by the Parole Board, an independent commission that works closely
          with the DOCR. In 2019, under guidance from Governor Burgum and then-Director of Corrections Leann
          Bertsch, the DOCR and the Parole Board began tracking and reporting racial data for the parole process
          in order to monitor and reduce disparities in the population granted parole.</p>
          <p>In the last 3 years, {ethnonym} comprised {releasesToParole.paroleReleaseProportion36Mo} of
          the individuals released on parole. They made up {releasesToParole.prisonPopulationProportion36Mo}
          of the overall prison population during that time.</p>`,
        methodology: `Individuals are counted as released to parole if they have been released from a period
          of incarceration where parole is documented as the reason for release. This data calculates the percent
          of the overall incarceration population and overall releases to parole over the last 3 years, or
          36 months, who were of the selected racial or ethnic group.
          <p>${raceOrEthnicityBoilerplate}</p>${supervisionBoilerplate}`,
      },
      supervision: {
        title: "How can community supervision impact disparities?",
        body: `<p>For individuals on probation (community supervision in lieu of a prison sentence) or on parole,
          failure can mean revocation: a process that removes people from community supervision and places them
          in prison.</p>
          <p>{ethnonymCapitalized} represent {supervision.populationProportion36Mo} of the {supervisionType}
          population, but were {supervision.revocationProportion36Mo} of revocation admissions to prison in
          the last 3 years.</p>
          <p>Reasons for a revocation can vary: {ethnonym} are revoked {supervision.technicalProportion36Mo}
          of the time for technical violations (a rule of supervision, rather than a crime),
          {supervision.absconsionProportion36Mo} of the time for absconsion from {supervisionType}, and
          {supervision.newCrimeProportion36Mo}  of the time for new crimes. In contrast, overall revocations
          for technical violations are {supervision.overall.technicalProportion36Mo}, revocations for absconsion
          {supervision.overall.absconsionProportion36Mo} and revocations for new crime
          {supervision.overall.newCrimeProportion36Mo}.</p>`,
        methodology: `This data includes the overall supervision population and revocation admissions
          over the last 3 years, or 36 months.
          <p>Revocation admissions count people who were incarcerated in a DOCR facility because their supervision
          was revoked. Revocations are included based on the date that the person was admitted to a DOCR facility
          because their supervision was revoked, not the date of the supervision case closure or causal violation
          or offense.</p>
          <p>Revocation admissions are linked to supervision cases closed via revocation within 90 days of the
          admission. Each individual is counted once, even if they had multiple violation reasons or revocation
          proceedings from multiple supervision cases. When an individual does have multiple violation types leading
          to revocation, only the most severe violation is displayed. New offenses are considered more severe than
          absconsions, which are considered more severe than technical violations. Violations of “Unknown Type”
          indicate individuals who were admitted to prison for a supervision revocation where the violation that
          caused the revocation cannot yet be determined. Revocation admissions without a supervision case closed
          via revocation in the 90 day window will always be considered of “Unknown Type”.</p>
          <p>Individuals occasionally serve probation and parole sentences simultaneously. For revoked individuals in
          this situation, their revocation admission is categorized as either a probation or a parole revocation,
          depending on who authorized the revocation admission (the parole board for parole revocations or the
          sentencing judge for probation revocations).</p>
          <p>Combined supervision counts include the number of unique individuals who have been admitted to a DOCR
          facility for a supervision revocation. If an individual has had their probation revoked multiple times
          in the last 3 years, the most recent revocation is counted. If an individual has had both probation and
          parole revoked within the last 3 years, they will appear in the counts for both supervision types when
          broken out separately.</p>
          <p>${raceOrEthnicityBoilerplate}</p>${supervisionBoilerplate}`,
      },
      programming: {
        title: "Can programming help reduce disparities?",
        body: `<p>Programming is designed to improve outcomes for justice-involved individuals. If programming is
          utilized more by groups overrepresented in the justice system, it could help close the gap.</p>
          <p>In 2018, North Dakota launched Free Through Recovery, a wrap-around behavioral health program that
          helps those with behavioral health challenges to succeed on community supervision. {ethnonymCapitalized}
          are {programming.participantProportionCurrent} of active participants in FTR, a {programming.comparison}
          representation compared to their overall {programming.supervisionProportionCurrent} of the current
          supervision population.</p>`,
        methodology: `<p>${raceOrEthnicityBoilerplate}</p>${supervisionBoilerplate}`,
      },
      conclusion: {
        title:
          "What are we doing to further improve disparities in criminal justice in North Dakota?",
        body: `<div>In 2019, the DOCR announced participation in the Restoring Promise initiative with the Vera
          Institute of Justice and MILPA. This initiative will focus on strategies to improve outcomes for
          incarcerated individuals age 18-25 with a strong emphasis on addressing racial inequities.</div>
          <div>We all have a part to play in reducing racial disparities.
          <p>The good news is that many approaches have been shown to reduce disparities in criminal justice:</p>
          <ul>
            <li>Investing in community-based education, housing, and healthcare</li>
            <li>Re-evaluation of community policing practices</li>
            <li>Looking for and reducing bias in charging, and sentencing practices</li>
          </ul>
          <p>Finally, progress starts with transparency; this page helps North Dakota and those of us at the
          DOCR to continue work to reduce the disparities in our system and create an equitable justice system.</p></div>`,
        // empty because there is no chart or data in this section
        methodology: "",
      },
    },
  },
};

export default content;
