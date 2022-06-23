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

// localities for both sentencing and probation
const judicialDistricts: { id: string; label: string }[] = [];

const demographicsBoilerplate = `<p>${ageGroup} ${gender} ${raceOrEthnicity}</p>`;

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

const prisonBoilerplate = `<p>This data concerns individuals in prison in Tennessee.
It does not include individuals incarcerated in county jails.</p>`;

const probationBoilerplate = `<p>This data may include some individuals on probation in North
Dakota as part of the interstate compact program, in which Tennessee agrees to supervise
individuals who were charged and sentenced in a different state, but have a compelling reason
to serve their probation in Tennessee. Under the same program, individuals placed on probation
from a Tennessee court may occasionally serve their probation in a different state.</p>`;

const probationDistrictBoilerplate = `<p>The districts associated with this data indicate individuals
whose probation sentence was imposed by a judge from a particular judicial district, determined by the
judicial district that encompasses the county in which the offense took place.</p>`;

const paroleBoilerplate = `<p>This data may include some individuals on parole in North
Dakota as part of the interstate compact program, in which Tennessee agrees to supervise
the release of individuals who were charged, sentenced, and incarcerated in a different state,
but have a compelling reason to serve their parole in Tennessee. Under the same program,
individuals paroled from a Tennessee prison may occasionally serve their parole in a
different state.</p>`;

const paroleOfficerBoilerplate = `<p>The offices associated with this data indicate individuals
who are being supervised by a parole officer stationed in that office.</p>`;

const supervisionBoilerplate = `<p>This data may include some individuals on probation or parole in
Tennessee as part of the interstate compact program, in which Tennessee agrees to supervise
individuals who were charged and sentenced in a different state, but have a compelling reason to
serve their supervision in Tennessee. Under the same program, individuals placed on supervision
in a Tennessee court may occasionally complete their supervision in a different state.</p>`;

const content: TenantContent = {
  name: "Tennessee",
  docName: "Tennessee Department of Corrections",
  docLink: "https://www.tn.gov/correction.html",
  description: "Explore data from Tennessee’s corrections system.",
  ctaCopy: `<a href="https://www.cor.pa.gov" target="_blank" rel="noopener noreferrer">The Tennessee Department of Correction</a> has an inherent responsibility to provide those 
  within our custody with opportunities to grow. Sharing information builds greater accountability between our department and the communities we serve.`,
  coBrandingCopy:
    'Produced in collaboration with <a href="https://www.TDOC.Tennessee.gov">the Tennessee Department of Correction</a>.',
  feedbackUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSc3_wV2ltGumMdGTcLehUM41tQri0ZW5RjIKh0JJlhpJGE9Hg/viewform",
  demographicCategories: {
    raceOrEthnicity: [
      "ASIAN",
      "AMERICAN_INDIAN_ALASKAN_NATIVE",
      "BLACK",
      "HISPANIC",
      "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
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
      methodology: `<p>This data includes all individuals that are currently incarcerated, on parole, or on probation
        in Tennessee.</p> ${demographicsBoilerplate} ${sentencingBoilerplate}`,
      totalLabel: "Total people sentenced",
    },
    SentenceTypesCurrent: {
      name: "Sentence Types",
      methodology: `<p>Incarceration includes any sentence that begins with a period of incarceration in a TDOC facility.
        Probation includes any sentence that begins with a period of probation under the supervision of a
        TDOC probation officer.</p> <p>Of note, individuals’ current status (incarcerated or on supervision)
        may differ from their sentence category (incarceration or probation). Individuals now on parole after
        being incarcerated are still counted in the incarceration sentence category. Individuals who have had
        their probation revoked and are now in prison are likewise included in the probation sentence category
        because their sentence was first to probation.</p><p>It is possible for an individual to be serving both
        incarceration and probation sentences simultaneously. These individuals are counted in the “Both” category.</p>
        ${demographicsBoilerplate} ${sentencingBoilerplate}`,
    },
    PrisonPopulationCurrent: {
      name: "Current Prison Population",
      methodology: `<p>This data includes all individuals that are currently incarcerated in a TDOC facility.
        It does not include individuals incarcerated in county jails nor individuals currently
        serving their prison sentence in the community through the Community Placement Program.</p>
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
      totalLabel: "Total people in prison",
    },
    PrisonPopulationHistorical: {
      name: "Historical Prison Population",
      methodology: `<p>This data includes the number of people that were incarcerated in a TDOC facility on the
        first day of each month over the last 20 years. It does not include individuals incarcerated
        in county jails nor individuals serving their prison sentence in the community through the
        Community Placement Program.</p> ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonAdmissionReasonsCurrent: {
      name: "Reason for Incarceration",
      methodology: `<p>This data includes the original reason for admission for all individuals currently incarcerated
        in a TDOC facility. When an individual is admitted to a state prison, the reason for the admission
        is documented by prison officials. These categories are pulled from that documentation.</p>
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonStayLengthAggregate: {
      name: "Length of Prison Stay",
      methodology: `<p>This data reports how long (in years) individuals spent in prison prior to their
        first official release for a specific sentence. It includes individuals released
        in the past 3 years who, prior to release, were serving a new sentence of
        incarceration or were incarcerated due to revocation of probation. It excludes
        individuals incarcerated due to revocation of parole. Individuals released from
        prison for a reason other than completion of sentence, commutation of sentence,
        parole, or death are also excluded. Of note, this data does include time spent
        in the Community Placement Program prior to release as part of time served.
        Individuals serving life sentences will only be included upon their death.</p>
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonReleaseTypeAggregate: {
      name: "Placement After Prison",
      methodology: `<p>This data includes all individuals released in the last 3 years, including releases
        directly from the Community Placement Program. When an individual is released from a
        state prison, the reason for the release is documented by prison officials. These
        categories are pulled from that documentation. Facility release reasons that do not
        typically correlate with an end to the period of incarceration, such as transfers
        between facilities, are not shown here.</p> ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonRecidivismRateHistorical: {
      name: "Cumulative Recidivism Rates",
      methodology: `<p>This data reports reincarceration recidivism rates, which is the proportion of individuals
        released from a TDOC facility that return to a TDOC facility at some point in the
        future. The releases are grouped by the calendar year in which the release occurred, and
        the rates are calculated as the percentage of the people released that have returned to
        incarceration after each year since the release. Individuals are included in the release
        cohort if they were released for serving their sentence or were conditionally released into
        supervision. Admissions to incarceration for new court commitments or due to revocations of
        supervision are counted as instances of reincarceration recidivism.</p> ${demographicsBoilerplate}
        ${prisonBoilerplate}`,
    },
    PrisonRecidivismRateSingleFollowupHistorical: {
      name: "Recidivism Rates Over Time",
      methodology: `<p>This data reports the reincarceration recidivism rate for a set number of years
        since the release, for the 10 most recent release cohorts.</p> ${demographicsBoilerplate}
        ${prisonBoilerplate}`,
    },
    ProbationPopulationCurrent: {
      name: "Current Probation Population",
      methodology: `<p>This data includes people currently on probation in Tennessee.</p>
        ${demographicsBoilerplate} ${probationBoilerplate} ${probationDistrictBoilerplate}`,
      totalLabel: "Total people on probation",
    },
    ProbationPopulationHistorical: {
      name: "Historical Probation Population",
      methodology: `<p>This data includes the number of people that were on probation in
        Tennessee on the first day of each month over the last 20 years.</p>
        ${demographicsBoilerplate} ${probationBoilerplate}`,
    },
    ProbationSuccessHistorical: {
      name: "Historical Probation Completion Rates",
      methodology: `<p>This data reports the percentage of people projected to complete probation
        in a given month who have successfully completed probation by the end of that month.</p>
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
      methodology: `<p>This data includes people who were incarcerated in a DOC facility within the last
        3 years because their probation was revoked. Revocations are included based on the
        date that the person was admitted to a DOC facility because their probation was
        revoked, not the date of the probation case closure or causal violation or offense.</p>
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
    ParolePopulationCurrent: {
      name: "Current Parole Population",
      methodology: `<p>This data includes people currently on parole in Tennessee.</p>
        ${demographicsBoilerplate} ${paroleBoilerplate} ${paroleOfficerBoilerplate}`,
      totalLabel: "Total people on parole",
    },
    ParolePopulationHistorical: {
      name: "Historical Parole Population",
      methodology: `<p>This data includes the number of people that were on parole in Tennessee
        on the first day of each month over the last 20 years.</p> ${demographicsBoilerplate}
        ${paroleBoilerplate}`,
    },
    ParoleSuccessHistorical: {
      name: "Historical Parole Completion Rates",
      methodology: `<p>This data reports the percentage of people projected to complete parole
        in a given month who have successfully completed parole by the end of that month.</p>
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
      methodology: `<p>This data includes people who were incarcerated in a DOC facility within the
        last 3 years because their parole was revoked. Revocations are included based on the date
        that the person was admitted to a DOC facility because their parole was revoked, not the
        date of the parole case closure or causal violation or offense.</p><p>Revocation admissions
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
  },
  systemNarratives: {
    Sentencing: {
      title: "Sentencing",
      previewTitle:
        "Demographics of Individuals Sentenced to Prison or Probation",
      introduction:
        "When someone is convicted of a crime, they receive a sentence that is meant to correspond with facts, circumstances and the severity of the offense and the offender, to provide retribution to the victim and set a course for rehabilitation. The data below gives an overview of sentences for people who enter the Tennessee corrections system — that is, people who are sentenced to serve time in prison or on supervised probation.",
      sections: [
        {
          title: "Who is being sentenced?",
          body:
            "After being convicted of a Class A misdemeanor or greater offense by a district court, a person may be sentenced to time in prison or probation, at which point they come under the jurisdiction of the Department of Correction (DOC). These charts show everyone currently involved with the Tennessee DOC.",
          metricTypeId: "SentencePopulationCurrent",
        },
        {
          title: "What types of sentences do people receive?",
          body:
            "Sentences that lead to individuals coming under DOC jurisdiction fall broadly into two categories: Probation and Incarceration.",
          metricTypeId: "SentenceTypesCurrent",
        },
      ],
      preview: "SentencePopulationCurrent",
    },
    Prison: {
      title: "Prison",
      previewTitle: "Prison Population over Time",
      introduction:
        "People sentenced for a Class A misdemeanor or greater offense may serve their sentence in a DOC prison or contract facility. Prisons run programming to help residents work towards rehabilitation and successful reentry.",
      preview: "PrisonPopulationHistorical",
      sections: [
        {
          metricTypeId: "PrisonPopulationCurrent",
          title: "Who is in custody?",
          body:
            "The Tennessee Department of Correction (DOC) runs a number of different facilities and contracts with facilities across the state.",
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
            "Each person in prison has a court-decided sentence determining their maximum length of stay. The actual time that someone stays in prison can be reduced through good behavior credits and parole (discretionary decision by Parole Board). While Tennessee requires those convicted of violent offenses to remain in prison for at least 85 percent of their sentence, most people serve less time in prison than their maximum length of stay.",
        },
        {
          metricTypeId: "PrisonReleaseTypeAggregate",
          title: "Where do they go from there?",
          body:
            "Once released, the DOC’s goal is to help citizens successfully reintegrate into their communities. In most cases, formerly incarcerated people will be placed on community parole or probation supervision.",
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
        "Probation refers to adults whom the courts place on supervision in the community in lieu of or in addition to incarceration. In Tennessee, probation is managed by the Department of Correction (DOC).",
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
            "Revocations happen when a person on probation violates a condition of their supervision or commits a new crime. In Tennessee, probation revocations fall into one of three categories: technical violation, new offense, and absconsion.",
          metricTypeId: "ProbationRevocationsAggregate",
        },
      ],
    },
    Parole: {
      title: "Parole",
      previewTitle: "Who is on parole?",
      introduction:
        "Parole is a period of supervised release after prison. Releases from prison to parole are granted by the parole board. People on parole must regularly check in with their parole officer, who ensures that they are following all the requirements of the release. If these expectations are violated, the person’s parole may be revoked.",
      preview: "ParolePopulationCurrent",
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
            "Revocations happen when a person on parole violates a condition of their supervision or commits a new crime. In Tennessee, parole revocations fall into one of three categories: technical violation, new offense, and absconsion.",
          metricTypeId: "ParoleRevocationsAggregate",
        },
      ],
    },
  },
  // TODO(#540): Update localities
  localities: {
    Sentencing: {
      label: "Judicial District",
      entries: judicialDistricts,
    },
    Prison: {
      label: "Facility",
      entries: [
        { id: "ABSENT WITHOUT LEAVE", label: "ABSENT WITHOUT LEAVE" },
        { id: "001", label: "001" },
        { id: "002", label: "002" },
        { id: "003", label: "003" },
        { id: "004", label: "004" },
        { id: "005", label: "005" },
        { id: "006", label: "006" },
        { id: "007", label: "007" },
        { id: "008", label: "008" },
        { id: "009", label: "009" },
        { id: "010", label: "010" },
        { id: "011", label: "011" },
        { id: "012", label: "012" },
        { id: "013", label: "013" },
        { id: "014", label: "014" },
        { id: "015", label: "015" },
        { id: "016", label: "016" },
        { id: "017", label: "017" },
        { id: "018", label: "018" },
        { id: "019", label: "019" },
        { id: "020", label: "020" },
        { id: "021", label: "021" },
        { id: "022", label: "022" },
        { id: "023", label: "023" },
        { id: "024", label: "024" },
        { id: "025", label: "025" },
        { id: "026", label: "026" },
        { id: "027", label: "027" },
        { id: "028", label: "028" },
        { id: "029", label: "029" },
        { id: "030", label: "030" },
        { id: "031", label: "031" },
        { id: "032", label: "032" },
        { id: "033", label: "033" },
        { id: "034", label: "034" },
        { id: "035", label: "035" },
        { id: "036", label: "036" },
        { id: "037", label: "037" },
        { id: "038", label: "038" },
        { id: "039", label: "039" },
        { id: "040", label: "040" },
        { id: "041", label: "041" },
        { id: "042", label: "042" },
        { id: "043", label: "043" },
        { id: "044", label: "044" },
        { id: "045", label: "045" },
        { id: "046", label: "046" },
        { id: "047", label: "047" },
        { id: "048", label: "048" },
        { id: "049", label: "049" },
        { id: "050", label: "050" },
        { id: "051", label: "051" },
        { id: "052", label: "052" },
        { id: "053", label: "053" },
        { id: "054", label: "054" },
        { id: "055", label: "055" },
        { id: "056", label: "056" },
        { id: "057", label: "057" },
        { id: "058", label: "058" },
        { id: "059", label: "059" },
        { id: "060", label: "060" },
        { id: "061", label: "061" },
        { id: "062", label: "062" },
        { id: "063", label: "063" },
        { id: "064", label: "064" },
        { id: "065", label: "065" },
        { id: "066", label: "066" },
        { id: "067", label: "067" },
        { id: "068", label: "068" },
        { id: "06A", label: "06A" },
        { id: "070", label: "070" },
        { id: "071", label: "071" },
        { id: "072", label: "072" },
        { id: "073", label: "073" },
        { id: "074", label: "074" },
        { id: "075", label: "075" },
        { id: "076", label: "076" },
        { id: "077", label: "077" },
        { id: "078", label: "078" },
        { id: "079", label: "079" },
        { id: "080", label: "080" },
        { id: "081", label: "081" },
        { id: "082", label: "082" },
        { id: "083", label: "083" },
        { id: "084", label: "084" },
        { id: "085", label: "085" },
        { id: "086", label: "086" },
        { id: "087", label: "087" },
        { id: "088", label: "088" },
        { id: "089", label: "089" },
        { id: "090", label: "090" },
        { id: "091", label: "091" },
        { id: "092", label: "092" },
        { id: "093", label: "093" },
        { id: "094", label: "094" },
        { id: "095", label: "095" },
        { id: "19A", label: "19A" },
        { id: "19C", label: "19C" },
        { id: "19D", label: "19D" },
        { id: "33A", label: "33A" },
        { id: "33B", label: "33B" },
        { id: "46A", label: "46A" },
        { id: "47A", label: "47A" },
        { id: "47C", label: "47C" },
        { id: "54A", label: "54A" },
        { id: "57A", label: "57A" },
        { id: "57B", label: "57B" },
        { id: "63B", label: "63B" },
        { id: "75A", label: "75A" },
        { id: "75B", label: "75B" },
        { id: "79A", label: "79A" },
        { id: "79B", label: "79B" },
        { id: "82B", label: "82B" },
        { id: "ALL", label: "ALL" },
        { id: "BCCX", label: "BCCX" },
        { id: "BMSP", label: "BMSP" },
        { id: "DBCI", label: "DBCI" },
        { id: "DJRC", label: "DJRC" },
        { id: "FPAF", label: "FPAF" },
        { id: "HCCF", label: "HCCF" },
        { id: "JCCJ", label: "JCCJ" },
        { id: "KCSC", label: "KCSC" },
        { id: "LCRC", label: "LCRC" },
        { id: "MCCX", label: "MCCX" },
        { id: "MCRC", label: "MCRC" },
        { id: "MLRC", label: "MLRC" },
        { id: "MTRC", label: "MTRC" },
        { id: "NCSC", label: "NCSC" },
        { id: "NECX", label: "NECX" },
        { id: "NWCX", label: "NWCX" },
        { id: "RMSI", label: "RMSI" },
        { id: "SCCC", label: "SCCC" },
        { id: "SCCF", label: "SCCF" },
        { id: "SPND", label: "SPND" },
        { id: "STSR", label: "STSR" },
        { id: "TCIP", label: "TCIP" },
        { id: "TCIX", label: "TCIX" },
        { id: "TPFW", label: "TPFW" },
        { id: "TSPR", label: "TSPR" },
        { id: "TTCC", label: "TTCC" },
        { id: "WCFA", label: "WCFA" },
        { id: "WTSP", label: "WTSP" },
      ],
    },
    Probation: {
      label: "Judicial District",
      entries: judicialDistricts,
    },
    Parole: {
      label: "Office",
      entries: [
        { id: "ALL", label: "ALL" },
        { id: "DRC57", label: "DRC57" },
        { id: "DRC75", label: "DRC75" },
        { id: "DRC79", label: "DRC79" },
        { id: "DRC90", label: "DRC90" },
        { id: "EXTERNAL_UNKNOWN", label: "EXTERNAL_UNKNOWN" },
        { id: "OIC", label: "OIC" },
        { id: "P01F2", label: "P01F2" },
        { id: "P05F", label: "P05F" },
        { id: "P06F", label: "P06F" },
        { id: "P07F", label: "P07F" },
        { id: "P10F", label: "P10F" },
        { id: "P13F", label: "P13F" },
        { id: "P16F", label: "P16F" },
        { id: "P18F", label: "P18F" },
        { id: "P19R", label: "P19R" },
        { id: "P19R2", label: "P19R2" },
        { id: "P22F", label: "P22F" },
        { id: "P23F", label: "P23F" },
        { id: "P24F", label: "P24F" },
        { id: "P30F", label: "P30F" },
        { id: "P32F", label: "P32F" },
        { id: "P33D1", label: "P33D1" },
        { id: "P33D2", label: "P33D2" },
        { id: "P39F", label: "P39F" },
        { id: "P40F", label: "P40F" },
        { id: "P45F", label: "P45F" },
        { id: "P47R", label: "P47R" },
        { id: "P50F", label: "P50F" },
        { id: "P54F", label: "P54F" },
        { id: "P57R", label: "P57R" },
        { id: "P60D", label: "P60D" },
        { id: "P62F", label: "P62F" },
        { id: "P63F", label: "P63F" },
        { id: "P66F", label: "P66F" },
        { id: "P71F", label: "P71F" },
        { id: "P74F", label: "P74F" },
        { id: "P75F", label: "P75F" },
        { id: "P78F", label: "P78F" },
        { id: "P79F1", label: "P79F1" },
        { id: "P79R", label: "P79R" },
        { id: "P82F", label: "P82F" },
        { id: "P83F", label: "P83F" },
        { id: "P89F", label: "P89F" },
        { id: "P90D", label: "P90D" },
        { id: "P92F", label: "P92F" },
        { id: "P94F", label: "P94F" },
        { id: "P95F", label: "P95F" },
        { id: "ALL", label: "ALL" },
      ],
    },
  },
  racialDisparitiesNarrative: {
    chartLabels: {
      totalPopulation: "Proportions of races in the state",
      totalSentenced: "Proportions of races sentenced and under DOC control",
      paroleGrant: "People released on parole",
      incarceratedPopulation: "Overall prison population",
      otherGroups: "All other racial/ethnic groups",
      programmingParticipants: "",
      supervisionPopulation: "All people under supervision",
      totalPopulationSentences: "All people sentenced and under DOC control",
      revocationProportions: "Proportions of revocation reasons",
    },
    introduction: `<p>In Tennessee, people of color are overrepresented in prison,
      on probation, and on parole.</p>
      <p>Black Tennesseeans are {likelihoodVsWhite.BLACK} times as likely to be under DOC control
      as their white counterparts, Latino Tennesseeans are {likelihoodVsWhite.HISPANIC} times as
      likely, and Native American Tennesseeans {likelihoodVsWhite.AMERICAN_INDIAN_ALASKAN_NATIVE} times.</p>`,
    introductionMethodology: `<p>${raceOrEthnicity}</p> ${supervisionBoilerplate}`,
    sections: {
      beforeCorrections: {
        title: "Disparities are already present before incarceration",
        body: `<p>Disparities emerge long before a person is incarcerated. By the time
          someone comes under the DOC’s care, they have been arrested, charged, convicted,
          and sentenced.<sup>1</sup> Even before contact with the criminal justice system,
          disparities in community investment (education, housing, healthcare) may
          play an important role in creating the disparities that we see in sentencing data.</p>
          <p>{ethnonymCapitalized} make up {beforeCorrections.populationPctCurrent} of Tennessee’s
          population, but {beforeCorrections.correctionsPctCurrent} of the population sentenced
          to time under DOC control.</p>
          <aside>1. This dashboard only focuses on data from DOC at the moment, which is why
          disparities in arrests and charging aren’t shown. We’re working with colleagues across
          the state to show the entire criminal justice system end-to-end as this page evolves.</aside>`,
        methodology: `<p>The source of data for racial and ethnic proportions overall in
          Tennessee is the US Census Bureau. The proportion under DOC control is the percent of
          individuals currently incarcerated or under community supervision of a given racial or
          ethnic group.</p><p>${raceOrEthnicity}</p>${supervisionBoilerplate}`,
      },
      sentencing: {
        title: "How can sentencing impact disparities?",
        body: `<p>Many parts of the criminal justice system involve human judgment, creating the potential
          for disparities to develop over time. Sentences are imposed based on the type and severity of crime.
          In many cases, courts have some discretion over what sentence to impose on a person convicted of an
          offense. In the aggregate, these variations in sentencing add up to significant trends.</p>
          <p>Currently, {sentencing.incarcerationPctCurrent} of {ethnonym} under DOC jurisdiction are
          serving incarceration sentences and {sentencing.probationPctCurrent} are serving probation sentences,
          a {sentencing.comparison} percentage serving incarceration sentences compared to the overall distribution of
          {sentencing.overall.incarcerationPctCurrent} serving incarceration sentences versus
          {sentencing.overall.probationPctCurrent} serving probation sentences.<p>`,
        methodology: `<p>Incarceration includes any sentence that begins with a period of incarceration in a
          TDOC facility. Probation includes any sentence that begins with a period of probation under the
          supervision of a TDOC probation officer.</p>
          <p>Of note, individuals’ current status (incarcerated or on supervision) may differ from their sentence
          category (incarceration or probation). Individuals now on parole after being incarcerated are still counted
          in the incarceration sentence category. Individuals who have had their probation revoked and are now in
          prison are likewise included in the probation sentence category because their sentence was first to probation.</p>
          <p>It is possible for an individual to be serving both an incarceration and probation sentence simultaneously.
          For this reason, the sum of the percentage of individuals serving each type of sentence may be greater than 100%.</p>
          <p>${raceOrEthnicity}</p>${supervisionBoilerplate}`,
      },
      releasesToParole: {
        title: "How can parole grant rates impact disparities?",
        body: `<p>People sentenced to a prison term can serve the end-portion of their term while supervised
          in the community, through the parole process.</p>
          <p>The parole process is governed by the Parole Board, an independent commission that works closely
          with the DOC. In 2019, under guidance from Governor Burgum and then-Director of Corrections Leann
          Bertsch, the DOC and the Parole Board began tracking and reporting racial data for the parole process
          in order to monitor and reduce disparities in the population granted parole.</p>
          <p>In the last 3 years, {ethnonym} comprised {releasesToParole.paroleReleaseProportion36Mo} of
          the individuals released on parole. They made up {releasesToParole.prisonPopulationProportion36Mo}
          of the overall prison population during that time.</p>`,
        methodology: `<p>Individuals are counted as released to parole if they have been released from a period
          of incarceration where parole is documented as the reason for release. This data calculates the percent
          of the overall incarceration population and overall releases to parole over the last 3 years, or
          36 months, who were of the selected racial or ethnic group.</p>
          <p>${raceOrEthnicity}</p>${supervisionBoilerplate}`,
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
        methodology: `<p>This data includes the overall supervision population and revocation admissions
          over the last 3 years, or 36 months.</p>
          <p>Revocation admissions count people who were incarcerated in a DOC facility because their supervision
          was revoked. Revocations are included based on the date that the person was admitted to a DOC facility
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
          <p>Combined supervision counts include the number of unique individuals who have been admitted to a DOC
          facility for a supervision revocation. If an individual has had their probation revoked multiple times
          in the last 3 years, the most recent revocation is counted. If an individual has had both probation and
          parole revoked within the last 3 years, they will appear in the counts for both supervision types when
          broken out separately.</p>
          <p>${raceOrEthnicity}</p>${supervisionBoilerplate}`,
      },
      programming: {
        title: "Can programming help reduce disparities?",
        body: `<p>More programming.</p>`,
        methodology: `<p>${raceOrEthnicity}</p>${supervisionBoilerplate}`,
      },
      conclusion: {
        title:
          "What are we doing to further improve disparities in criminal justice in Tennessee?",
        body: `<div><p>Lorem Ipsum</p></div>`,
        // empty because there is no chart or data in this section
        methodology: "",
      },
    },
  },
};

export default content;
