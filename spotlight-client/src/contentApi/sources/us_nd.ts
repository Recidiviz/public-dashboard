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

const demographicsBoilerplate = `<p>${ageGroup} ${gender} ${raceOrEthnicity}
The “Other” category includes Asian and Native Hawaiian or other Pacific Islander
individuals due to low counts of these reported racial identities in North Dakota.</p>`;

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

const content: TenantContent = {
  name: "North Dakota",
  description:
    '<a href="https://www.docr.nd.gov">The North Dakota Department of Corrections and Rehabilitation (DOCR)</a> provides correctional services for the state of North Dakota. Our mission is to transform lives, influence change, and strengthen community. Transparency is a critical element of our mission; sharing information builds greater accountability between the DOCR and the communities we serve.',
  collections: {
    Sentencing: {
      name: "Sentencing",
      description: "description TK",
    },
    Prison: {
      name: "Prison",
      description: "description TK",
    },
    Probation: {
      name: "Probation",
      description: "description TK",
    },
    Parole: {
      name: "Parole",
      description: "description TK",
    },
  },
  metrics: {
    SentencePopulationCurrent: {
      name: "Sentenced Population",
      description: "description TK",
      methodology: `This data includes all individuals that are currently incarcerated, on parole, or on probation
        in North Dakota. ${demographicsBoilerplate} ${sentencingBoilerplate}`,
      totalLabel: "Total people sentenced",
    },
    SentenceTypesCurrent: {
      name: "Sentence Types",
      description: "description TK",
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
      description: "description TK",
      methodology: `This data includes all individuals that are currently incarcerated in a ND DOCR facility.
        It does not include individuals incarcerated in county jails nor individuals currently
        serving their prison sentence in the community through the Community Placement Program.
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
      totalLabel: "Total people in prison",
    },
    PrisonPopulationHistorical: {
      name: "Historical Prison Population",
      description: "description TK",
      methodology: `This data includes the number of people that were incarcerated in a ND DOCR facility on the
        first day of each month over the last 20 years. It does not include individuals incarcerated
        in county jails nor individuals serving their prison sentence in the community through the
        Community Placement Program. ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonAdmissionReasonsCurrent: {
      name: "Reason for Incarceration",
      description: "description TK",
      methodology: `This data includes the original reason for admission for all individuals currently incarcerated
        in a ND DOCR facility. When an individual is admitted to a state prison, the reason for the admission
        is documented by prison officials. These categories are pulled from that documentation.
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonStayLengthAggregate: {
      name: "Length of Prison Stay",
      description: "description TK",
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
      description: "description TK",
      methodology: `This data includes all individuals released in the last 3 years, including releases
        directly from the Community Placement Program. When an individual is released from a
        state prison, the reason for the release is documented by prison officials. These
        categories are pulled from that documentation. Facility release reasons that do not
        typically correlate with an end to the period of incarceration, such as transfers
        between facilities, are not shown here. ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonRecidivismRateHistorical: {
      name: "Cumulative Recidivism Rates",
      description: "description TK",
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
      description: "description TK",
      methodology: `This data reports the reincarceration recidivism rate for a set number of years
        since the release, for the 10 most recent release cohorts. ${demographicsBoilerplate}
        ${prisonBoilerplate}`,
    },
    ProbationPopulationCurrent: {
      name: "Current Probation Population",
      description: "description TK",
      methodology: `This data includes people currently on probation in North Dakota.
        ${demographicsBoilerplate} ${probationBoilerplate} ${probationDistrictBoilerplate}`,
      totalLabel: "Total people on probation",
    },
    ProbationPopulationHistorical: {
      name: "Historical Probation Population",
      description: "description TK",
      methodology: `This data includes the number of people that were on probation in
        North Dakota on the first day of each month over the last 20 years.
        ${demographicsBoilerplate} ${probationBoilerplate}`,
    },
    ProbationSuccessHistorical: {
      name: "Historical Probation Completion Rates",
      description: "description TK",
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
      description: "description TK",
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
      description: "description TK",
      methodology: `This data includes the total number of people on probation who are actively
        enrolled in Free Through Recovery (FTR). Free Through Recovery is run jointly
        with the Department of Health and Human Services (DHS): as a result, FTR enrollment
        is aggregated into the 8 DHS service regions of the provider locations at which
        individuals are enrolled. ${probationBoilerplate}`,
    },
    ParolePopulationCurrent: {
      name: "Current Parole Population",
      description: "description TK",
      methodology: `This data includes people currently on parole in North Dakota.
        ${demographicsBoilerplate} ${paroleBoilerplate} ${paroleOfficerBoilerplate}`,
      totalLabel: "Total people on parole",
    },
    ParolePopulationHistorical: {
      name: "Historical Parole Population",
      description: "description TK",
      methodology: `This data includes the number of people that were on parole in North Dakota
        on the first day of each month over the last 20 years. ${demographicsBoilerplate}
        ${paroleBoilerplate}`,
    },
    ParoleSuccessHistorical: {
      name: "Historical Parole Completion Rates",
      description: "description TK",
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
      description: "description TK",
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
      description: "description TK",
      methodology: `This data includes the total number of people on parole who are actively enrolled
        in Free Through Recovery (FTR). Free Through Recovery is run jointly with the Department of
        Health and Human Services (DHS): as a result, FTR enrollment is aggregated into the 8 DHS service
        regions of the provider locations at which individuals are enrolled. ${paroleBoilerplate}`,
    },
  },
  systemNarratives: {
    Sentencing: {
      title: "Sentencing",
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
    },
    Prison: {
      title: "Prison",
      introduction:
        "People sentenced for a Class A misdemeanor or greater offense may serve their sentence in a DOCR prison or contract facility. Prisons run programming to help residents work towards rehabilitation and successful reentry.",
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
            "After release from prison, a significant proportion of formerly incarcerated folks end up back in prison. This is typically termed “recidivism.” This chart shows recidivism as reincarceration; that is, the proportion of individuals who are incarcerated again at some point after their release.<p><strong>Note:</strong> Race or Ethnicity, Gender, and Age Group views are disabled unless a single Cohort is selected.</p>",
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
      introduction:
        "Probation refers to adults whom the courts place on supervision in the community in lieu of or in addition to incarceration. In North Dakota, probation is managed by the Department of Corrections and Rehabilitation (DOCR).",
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
      introduction:
        "Parole is a period of supervised release after prison. Releases from prison to parole are granted by the parole board. People on parole must regularly check in with their parole officer, who ensures that they are following all the requirements of the release. If these expectations are violated, the person’s parole may be revoked.",
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
};

export default content;
