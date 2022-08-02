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

const prisonBoilerplate = `<p>This data concerns individuals in prison in Idaho.</p>`;

const probationBoilerplate = `<p>This data may include some individuals on probation in Idaho
as part of the interstate compact program, in which Idaho agrees to supervise
individuals who were charged and sentenced in a different state, but have a compelling reason
to serve their probation in Idaho. Under the same program, individuals placed on probation
from a Idaho court may occasionally serve their probation in a different state.</p>`;

const probationDistrictBoilerplate = `<p>The districts associated with this data indicate individuals
whose probation sentence was imposed by a judge from a particular judicial district, determined by the
judicial district that encompasses the county in which the offense took place.</p>`;

const paroleBoilerplate = `<p>This data may include some individuals on parole in Idaho
as part of the interstate compact program, in which Idaho agrees to supervise
the release of individuals who were charged, sentenced, and incarcerated in a different state,
but have a compelling reason to serve their parole in Idaho. Under the same program,
individuals paroled from a Idaho prison may occasionally serve their parole in a
different state.</p>`;

const paroleOfficerBoilerplate = `<p>The offices associated with this data indicate individuals
who are being supervised by a parole officer stationed in that office.</p>`;

const supervisionBoilerplate = `<p>This data may include some individuals on probation or parole in
Idaho as part of the interstate compact program, in which Idaho agrees to supervise
individuals who were charged and sentenced in a different state, but have a compelling reason to
serve their supervision in Idaho. Under the same program, individuals placed on supervision
in a Idaho court may occasionally complete their supervision in a different state.</p>`;

const content: TenantContent = {
  name: "Idaho",
  docName: "Idaho Department of Corrections",
  docLink: "https://www.idoc.idaho.gov/",
  description: "Explore data from Idaho’s corrections system.",
  ctaCopy: `<a href="https://www.idoc.idaho.gov/" target="_blank" rel="noopener noreferrer">The Idaho Department of Corrections</a> aims to protect the public, our staff, 
  and those within our custody and supervision through safety, accountability, partnerships and providing opportunities for change.`,
  coBrandingCopy:
    'Produced in collaboration with <a href="https://www.idoc.idaho.gov">the Idaho Department of Correction</a>.',
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
        in Idaho.</p> ${demographicsBoilerplate} ${sentencingBoilerplate}`,
      totalLabel: "Total people sentenced",
    },
    SentenceTypesCurrent: {
      name: "Sentence Types",
      methodology: `<p>Incarceration includes any sentence that begins with a period of incarceration in a IDOC facility.
        Probation includes any sentence that begins with a period of probation under the supervision of a
        IDOC probation officer.</p> <p>Of note, individuals’ current status (incarcerated or on supervision)
        may differ from their sentence category (incarceration or probation). Individuals now on parole after
        being incarcerated are still counted in the incarceration sentence category. Individuals who have had
        their probation revoked and are now in prison are likewise included in the probation sentence category
        because their sentence was first to probation.</p><p>It is possible for an individual to be serving both
        incarceration and probation sentences simultaneously. These individuals are counted in the “Both” category.</p>
        ${demographicsBoilerplate} ${sentencingBoilerplate}`,
    },
    PrisonPopulationCurrent: {
      name: "Current Prison Population",
      methodology: `<p>This data includes all individuals that are currently incarcerated in a IDOC facility.</p>
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
      totalLabel: "Total people in prison",
    },
    PrisonPopulationHistorical: {
      name: "Historical Prison Population",
      methodology: `<p>This data includes the number of people that were incarcerated in a IDOC facility on the
        first day of each month over the last 20 years.</p> ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonAdmissionReasonsCurrent: {
      name: "Reason for Incarceration",
      methodology: `<p>This data includes the original reason for admission for all individuals currently incarcerated
        in a IDOC facility. When an individual is admitted to a state prison, the reason for the admission
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
        parole, or death are also excluded. Individuals serving life sentences will only be included upon their death.</p>
        ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonReleaseTypeAggregate: {
      name: "Placement After Prison",
      methodology: `<p>This data includes all individuals released in the last 3 years. When an individual is released from a
        state prison, the reason for the release is documented by prison officials. These
        categories are pulled from that documentation. Facility release reasons that do not
        typically correlate with an end to the period of incarceration, such as transfers
        between facilities, are not shown here.</p> ${demographicsBoilerplate} ${prisonBoilerplate}`,
    },
    PrisonRecidivismRateHistorical: {
      name: "Cumulative Recidivism Rates",
      methodology: `<p>This data reports reincarceration recidivism rates, which is the proportion of individuals
        released from a IDOC facility that return to a IDOC facility at some point in the
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
      methodology: `<p>This data includes people currently on probation in Idaho.</p>
        ${demographicsBoilerplate} ${probationBoilerplate} ${probationDistrictBoilerplate}`,
      totalLabel: "Total people on probation",
    },
    ProbationPopulationHistorical: {
      name: "Historical Probation Population",
      methodology: `<p>This data includes the number of people that were on probation in
        Idaho on the first day of each month over the last 20 years.</p>
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
      methodology: `<p>This data includes people currently on parole in Idaho.</p>
        ${demographicsBoilerplate} ${paroleBoilerplate} ${paroleOfficerBoilerplate}`,
      totalLabel: "Total people on parole",
    },
    ParolePopulationHistorical: {
      name: "Historical Parole Population",
      methodology: `<p>This data includes the number of people that were on parole in Idaho
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
    RidersPopulationHistorical: {
      name: "Population Over Time",
      methodology: `<p>This data includes the total number of people on Parole Board Hold, or General Term or Rider sentences that were incarcerated in a IDOC facility in a given month over the last 20 years (as of 6/19/22).</p>
      <p>The population is further broken down into those on a Parole Board Hold, or General Term or Rider sentences. The total population is a sum of these three subgroups and is not the total incarcerated population at that time.</p>
      <p>This data concerns individuals in prison in Idaho.</p>
      `,
    },
    RidersPopulationCurrent: {
      name: "Current population of Rider",
      methodology: `<p>This data includes all individuals on a Rider sentence that were incarcerated in a IDOC facility as of 6/15/22.</p>
      <p>In distributions by age, individuals are counted towards the age group they fall into as of the start of their Rider term. Gender distributions only include male and female due to low numbers of other reported genders. Distributions by race count individuals with more than one reported race or ethnicity towards the racial or ethnic identity that is least represented in the general population.</p>
      <p>This data concerns individuals in prison in Idaho.</p>
      `,
    },
    RidersOriginalCharge: {
      name: "Original Charge",
      methodology: `<p>This data reports the percentage breakdown of most serious offense types for individuals sentenced to a Rider directly from the community over the last three years (June 2019 - June 2022). It does not include individuals going from term incarceration to a Rider, parole to a Rider, or probation to a Rider.</p>
      <p>For individuals with more than one charge associated with the Rider sentence, the most severe charge is reported. Charges are ranked in the following order, from most severe to least: Murder_Homicide, Assault, Sex, Alcohol_Drug, Property, Fraud, Other, Unknown, Missing.</p>
      <p>In distributions by age, individuals are counted towards the age group they fall into as of the start of their Rider term. Gender distributions only include male and female due to low numbers of other reported genders. Distributions by race count individuals with more than one reported race or ethnicity towards the racial or ethnic identity that is least represented in the general population.</p>
      <p>This data concerns individuals in prison in Idaho.</p>
      `,
    },
    RidersReincarcerationRate: {
      name: "Reincarceration Rate",
      methodology: `<p>This data reports the three year incarceration rate for individuals that started supervision in 2019 from the community, or a General Term or Rider sentence. This rate is calculated as the proportion of individuals on supervision that are incarcerated for a General Term or Rider sentence within three years of starting supervision.</p>
      <p>The cohorts are grouped by the type of original sentence (General Term, Rider, Probation). Admissions to incarceration for new court commitments or due to revocations of supervision are counted as instances of reincarceration recidivism.</p>
      <p>In distributions by age, individuals are counted towards the age group they fall into at the time of supervision start. Gender distributions only include male and female due to low numbers of other reported genders. Distributions by race count individuals with more than one reported race or ethnicity towards the racial or ethnic identity that is least represented in the general population.</p>
      <p>This data concerns individuals in prison in Idaho.</p>
      `,
    },
  },
  systemNarratives: {
    Sentencing: {
      title: "Sentencing",
      previewTitle:
        "Demographics of Individuals Sentenced to Prison or Probation",
      introduction:
        "When someone is convicted of a crime, they receive a sentence that is meant to correspond with facts, circumstances and the severity of the offense and the offender, to provide retribution to the victim and set a course for rehabilitation. The data below gives an overview of sentences for people who enter the Idaho corrections system — that is, people who are sentenced to serve time in prison or on supervised probation.",
      sections: [
        {
          title: "Who is being sentenced?",
          body:
            "After being convicted of a felony by a district court, a person may be sentenced to time in prison or probation, at which point they come under the jurisdiction of the Department of Correction (DOC). These charts show everyone currently involved with the Idaho DOC.",
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
        "People sentenced for a felony may serve their sentence in a DOC prison or contract facility. Prisons run programming to help residents work towards rehabilitation and successful reentry. All of the below data includes Riders, or those on Retained Jurisdiction under the courts for intensive programming; more information about this program is available <a href='/us-id/narratives/riders'>here</a>.",
      preview: "PrisonPopulationHistorical",
      sections: [
        {
          metricTypeId: "PrisonPopulationCurrent",
          title: "Who is in custody?",
          body:
            "Residents are housed in a number of different facilities across the state.",
        },
        {
          metricTypeId: "PrisonPopulationHistorical",
          title: "How has the incarcerated population changed over time?",
          body:
            "Changes in the prison population are closely tied to admissions (from new sentences and revocations from supervision) and releases (associated with sentence lengths, release timing, etc). The sharp rise in the prison population since 2016 can be traced back to stricter sentences and policies (e.g., mandatory minimums) around drug possession.",
        },
        {
          metricTypeId: "PrisonAdmissionReasonsCurrent",
          title: "How did they get there?",
          body:
            "There are many possible paths for someone to come to prison. “New Admission” represents someone being incarcerated for the first time as part of their sentence. “Revocation” represents when someone on probation or parole is sent to (or back to) prison. This chart shows the admission reasons for all residents in the past three years.",
        },
        {
          metricTypeId: "PrisonStayLengthAggregate",
          title: "How long are they there?",
          body:
            "Every person serves at least the fixed portion of their sentence. The actual time that someone stays in prison can be reduced through release to parole (discretionary decision by Parole Board). While Idaho requires all incarcerated people to serve 100% of their fixed sentence, most people serve less time in prison than their maximum length of stay. This chart shows the length of stay for all residents in the past three years.",
        },
        {
          metricTypeId: "PrisonReleaseTypeAggregate",
          title: "Where do they go from there?",
          body:
            "Once released, the DOC’s goal is to help citizens successfully reintegrate into their communities. In most cases, formerly incarcerated people will be placed on community parole or probation supervision.  This chart shows the post-release destinations for all residents in the past three years.",
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
        "Probation refers to adults whom the courts place on supervision in the community in lieu of or in addition to incarceration. In Idaho, only felony probation is managed by the Department of Correction (DOC).",
      preview: "ProbationRevocationsAggregate",
      sections: [
        {
          title: "Who is on probation?",
          body:
            "Judges may sentence people to a period of probation for a felony. Probation can be either a suspended sentence in which the judge has decided on a carceral sentence but has declined to carry it out unless the defendant does not successfully complete a period of probation supervision, or a deferred sentence, in which the defendant has an opportunity for the crime to be recorded as “dismissed” on the criminal record. This population may also include those who have completed a Rider.",
          metricTypeId: "ProbationPopulationCurrent",
        },
        {
          title: "How has the probation population changed over time?",
          body:
            "Changes in probation sentence lengths, conditions, and other factors may contribute to the rise and fall of this number over time.",
          metricTypeId: "ProbationPopulationHistorical",
        },
        {
          title: "Why do revocations happen?",
          body:
            "Revocations happen when a person on probation violates a condition of their supervision or commits a new crime. In Idaho, probation revocations fall into one of three categories: technical violation, new offense, and absconsion. This chart shows the revocation reasons for all individuals who have been on probation in the past three years.",
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
            "Parole is granted to people in prison with a track record of good behavior as a way to complete their sentences in their communities. Some individuals are also on interstate compact, and are therefore under the official jurisdiction of another state’s system.",
          metricTypeId: "ParolePopulationCurrent",
        },
        {
          title: "How has the parole population changed over time?",
          body:
            "Earlier releases from parole, more sentences to prison terms, and other factors may also contribute to the rise and fall of this number over time.",
          metricTypeId: "ParolePopulationHistorical",
        },
        {
          title: "Why do revocations happen?",
          body:
            "Revocations happen when a person on parole violates a condition of their supervision or commits a new crime. In Idaho, parole revocations fall into one of three categories: technical violation, new offense, and absconsion. This chart shows the revocation reasons for all individuals who have been on parole in the past three years.",
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
        {
          id: "ADA COUNTY SHERIFF DEPARTMENT",
          label: "ADA COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "ADAMS COUNTY SHERIFF DEPARTMENT",
          label: "ADAMS COUNTY SHERIFF DEPARTMENT",
        },
        { id: "ALL", label: "ALL" },
        { id: "ARIZONA", label: "ARIZONA" },
        {
          id: "BANNOCK COUNTY SHERIFF DEPARTMENT",
          label: "BANNOCK COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "BENEWAH COUNTY SHERIFF DEPARTMENT",
          label: "BENEWAH COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "BINGHAM COUNTY SHERIFF DEPARTMENT",
          label: "BINGHAM COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "BLAINE COUNTY SHERIFF DEPARTMENT",
          label: "BLAINE COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "BONNER COUNTY SHERIFF DEPARTMENT",
          label: "BONNER COUNTY SHERIFF DEPARTMENT",
        },
        { id: "BONNEVILLE", label: "BONNEVILLE" },
        {
          id: "BUTTE COUNTY SHERIFF DEPARTMENT",
          label: "BUTTE COUNTY SHERIFF DEPARTMENT",
        },
        { id: "CALIFORNIA", label: "CALIFORNIA" },
        {
          id: "CANYON COUNTY SHERIFF DEPARTMENT",
          label: "CANYON COUNTY SHERIFF DEPARTMENT",
        },
        { id: "CAPP", label: "CAPP" },
        {
          id: "CARIBOU COUNTY SHERIFF DEPARTMENT",
          label: "CARIBOU COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "CASSIA COUNTY SHERIFF DEPARTMENT",
          label: "CASSIA COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "CLEARWATER COUNTY SHERIFF DEPARTMENT",
          label: "CLEARWATER COUNTY SHERIFF DEPARTMENT",
        },
        { id: "COLORADO", label: "COLORADO" },
        { id: "COUNTY JAIL", label: "COUNTY JAIL" },
        {
          id: "COURT ORDERED RELEASE / BOND APPEAL",
          label: "COURT ORDERED RELEASE / BOND APPEAL",
        },
        { id: "CRC EAST BOISE", label: "CRC EAST BOISE" },
        { id: "CRC IDAHO FALLS", label: "CRC IDAHO FALLS" },
        { id: "CRC NAMPA", label: "CRC NAMPA" },
        { id: "CRC TREASURE VALLEY", label: "CRC TREASURE VALLEY" },
        {
          id: "CUSTER COUNTY SHERIFF DEPARTMENT",
          label: "CUSTER COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "ELMORE COUNTY SHERIFF DEPARTMENT",
          label: "ELMORE COUNTY SHERIFF DEPARTMENT",
        },
        { id: "FEDERAL BUREAU OF PRISONS", label: "FEDERAL BUREAU OF PRISONS" },
        { id: "FEDERAL CUSTODY", label: "FEDERAL CUSTODY" },
        { id: "FEDERAL DETAINER", label: "FEDERAL DETAINER" },
        { id: "FLORIDA", label: "FLORIDA" },
        {
          id: "FRANKLIN COUNTY SHERIFF DEPARTMENT",
          label: "FRANKLIN COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "FREMONT COUNTY SHERIFF DEPARTMENT",
          label: "FREMONT COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "GEM COUNTY SHERIFF DEPARTMENT",
          label: "GEM COUNTY SHERIFF DEPARTMENT",
        },
        { id: "GEORGIA", label: "GEORGIA" },
        {
          id: "GOODING COUNTY SHERIFF DEPARTMENT",
          label: "GOODING COUNTY SHERIFF DEPARTMENT",
        },
        { id: "HAWAII", label: "HAWAII" },
        { id: "ICIO", label: "ICIO" },
        { id: "ILLINOIS", label: "ILLINOIS" },
        { id: "IMSI", label: "IMSI" },
        { id: "ISCC", label: "ISCC" },
        { id: "ISCI", label: "ISCI" },
        { id: "JEFFERSON", label: "JEFFERSON" },
        {
          id: "JEROME COUNTY SHERIFF DEPARTMENT",
          label: "JEROME COUNTY SHERIFF DEPARTMENT",
        },
        { id: "JUDICIAL DISTRICT", label: "JUDICIAL DISTRICT" },
        { id: "KANSAS", label: "KANSAS" },
        { id: "KENTUCKY", label: "KENTUCKY" },
        {
          id: "KOOTENAI COUNTY SHERIFF DEPARTMENT",
          label: "KOOTENAI COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "LATAH COUNTY SHERIFF DEPARTMENT",
          label: "LATAH COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "LEMHI COUNTY SHERIFF DEPARTMENT",
          label: "LEMHI COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "MADISON COUNTY SHERIFF DEPARTMENT",
          label: "MADISON COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "MINIDOKA COUNTY SHERIFF DEPARTMENT",
          label: "MINIDOKA COUNTY SHERIFF DEPARTMENT",
        },
        { id: "MINNESOTA", label: "MINNESOTA" },
        { id: "MONTANA", label: "MONTANA" },
        { id: "NEVADA", label: "NEVADA" },
        { id: "NEW HAMPSHIRE", label: "NEW HAMPSHIRE" },
        {
          id: "NEZ PERCE COUNTY SHERIFF DEPARTMENT",
          label: "NEZ PERCE COUNTY SHERIFF DEPARTMENT",
        },
        { id: "NICI", label: "NICI" },
        { id: "OHIO", label: "OHIO" },
        { id: "OREGON", label: "OREGON" },
        { id: "OUT ON OWN RECOGNANCE", label: "OUT ON OWN RECOGNANCE" },
        {
          id: "OWYHEE COUNTY SHERIFF DEPARTMENT",
          label: "OWYHEE COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "PAYETTE COUNTY SHERIFF DEPARTMENT",
          label: "PAYETTE COUNTY SHERIFF DEPARTMENT",
        },
        { id: "PENNSYLVANIA", label: "PENNSYLVANIA" },
        {
          id: "POWER COUNTY SHERIFF DEPARTMENT",
          label: "POWER COUNTY SHERIFF DEPARTMENT",
        },
        { id: "PWCC", label: "PWCC" },
        { id: "RECORDS BUREAU TRACKING", label: "RECORDS BUREAU TRACKING" },
        {
          id: "SAGUARO CORRECTIONAL CENTER, ARIZONA",
          label: "SAGUARO CORRECTIONAL CENTER, ARIZONA",
        },
        { id: "SAWC", label: "SAWC" },
        { id: "SBWCC", label: "SBWCC" },
        { id: "SECURITY PLACEMENT", label: "SECURITY PLACEMENT" },
        {
          id: "SHOSHONE COUNTY SHERIFF DEPARTMENT",
          label: "SHOSHONE COUNTY SHERIFF DEPARTMENT",
        },
        { id: "SICI", label: "SICI" },
        { id: "TENNESSEE", label: "TENNESSEE" },
        { id: "TEXAS", label: "TEXAS" },
        {
          id: "TWIN FALLS COMMUNITY WORK CENTER, TWIN FALLS",
          label: "TWIN FALLS COMMUNITY WORK CENTER, TWIN FALLS",
        },
        {
          id: "TWIN FALLS COUNTY SHERIFF DEPARTMENT",
          label: "TWIN FALLS COUNTY SHERIFF DEPARTMENT",
        },
        {
          id: "U.S. IMMIGRATION NATURALIZATION DETAINER",
          label: "U.S. IMMIGRATION NATURALIZATION DETAINER",
        },
        { id: "U.S. MARSHAL DETAINER", label: "U.S. MARSHAL DETAINER" },
        { id: "U.S. MARSHALL CUSTODY", label: "U.S. MARSHALL CUSTODY" },
        { id: "UTAH", label: "UTAH" },
        {
          id: "VALLEY COUNTY SHERIFF DEPARTMENT",
          label: "VALLEY COUNTY SHERIFF DEPARTMENT",
        },
        { id: "VIRGINIA", label: "VIRGINIA" },
        { id: "WASHINGTON", label: "WASHINGTON" },
        {
          id: "WASHINGTON COUNTY SHERIFF DEPARTMENT",
          label: "WASHINGTON COUNTY SHERIFF DEPARTMENT",
        },
        { id: "WYOMING", label: "WYOMING" },
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
        { id: "DISTRICT 0", label: "DISTRICT 0" },
        {
          id: "DISTRICT OFFICE 1, COEUR D'ALENE",
          label: "DISTRICT OFFICE 1, COEUR D'ALENE",
        },
        {
          id: "DISTRICT OFFICE 2, LEWISTON",
          label: "DISTRICT OFFICE 2, LEWISTON",
        },
        {
          id: "DISTRICT OFFICE 3, CALDWELL",
          label: "DISTRICT OFFICE 3, CALDWELL",
        },
        { id: "DISTRICT OFFICE 4, BOISE", label: "DISTRICT OFFICE 4, BOISE" },
        {
          id: "DISTRICT OFFICE 5, TWIN FALLS",
          label: "DISTRICT OFFICE 5, TWIN FALLS",
        },
        {
          id: "DISTRICT OFFICE 6, POCATELLO",
          label: "DISTRICT OFFICE 6, POCATELLO",
        },
        {
          id: "DISTRICT OFFICE 7, IDAHO FALLS",
          label: "DISTRICT OFFICE 7, IDAHO FALLS",
        },
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
    introduction: `<p>In Idaho, people of color are overrepresented in prison,
      on probation, and on parole.</p>
      <p>Black Idahoans are {likelihoodVsWhite.BLACK} times as likely to be under DOC control
      as their white counterparts, Latino Idahoans are {likelihoodVsWhite.HISPANIC} times as
      likely, and Native American Idahoans {likelihoodVsWhite.AMERICAN_INDIAN_ALASKAN_NATIVE} times.</p>`,
    introductionMethodology: `${raceOrEthnicity} ${supervisionBoilerplate}`,
    sections: {
      beforeCorrections: {
        title: "Disparities are already present before incarceration",
        body: `<p>Disparities emerge long before a person is incarcerated. By the time
          someone comes under the DOC’s care, they have been arrested, charged, convicted,
          and sentenced.<sup>1</sup> Even before contact with the criminal justice system,
          disparities in community investment (education, housing, healthcare) may
          play an important role in creating the disparities that we see in sentencing data.</p>
          <p>{ethnonymCapitalized} make up {beforeCorrections.populationPctCurrent} of Idaho’s
          population, but {beforeCorrections.correctionsPctCurrent} of the population sentenced
          to time under DOC control.</p>
          <aside>1. This dashboard only focuses on data from DOC at the moment, which is why
          disparities in arrests and charging aren’t shown. We’re working with colleagues across
          the state to show the entire criminal justice system end-to-end as this page evolves.</aside>`,
        methodology: `<p>The source of data for racial and ethnic proportions overall in
          Idaho is the US Census Bureau. The proportion under DOC control is the percent of
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
          IDOC facility. Probation includes any sentence that begins with a period of probation under the
          supervision of a IDOC probation officer.</p>
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
          with the DOC.</p>
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
      conclusion: {
        title:
          "What are we doing to further improve disparities in criminal justice in Idaho?",
        body: `<div><p>Content TBD</p></div>`,
        // empty because there is no chart or data in this section
        methodology: "",
      },
    },
  },
  ridersNarrative: {
    title: "Rider Program",
    introduction: `A Rider is someone committed to Retained Jurisdiction under the courts for up to 365 days. Upon completion, the courts will determine whether to place the person on probation or incarcerate them for their fixed term.
    The IDOC assesses Riders to determine their needs and places them in the appropriate facilities to receive intensive programming and education.`,
    sections: [
      {
        title: "How prevalent are “Riders” in the IDOC population?",
        body: `The Rider program was first introduced in 2005 as an alternative to a longer prison sentence. Since then, the Rider population has risen to the point that <strong>16%</strong> of IDOC’s institutional population is comprised of people on retained jurisdiction.`,
        metricTypeId: "RidersPopulationHistorical",
      },
      {
        title: "Who is on a Rider in Idaho?",
        body: `The Rider population is generally younger and more female than the general incarceration population.`,
        metricTypeId: "RidersPopulationCurrent",
      },
      {
        title: "Why are people placed on Riders?",
        body: `In general, Riders are considered a last resort” before full incarceration. Still, most people placed on riders have not committed a serious or violent offense; for <strong>60%</strong> of Riders in the past three years, their most serious offense was related to drug use/possession or property crime.`,
        metricTypeId: "RidersOriginalCharge",
      },
      {
        title: "What is the reincarceration rate for Riders?",
        body: `Despite high programming completion rates during Rider sentences, those individuals tend to return to prison at higher rates compared to similar individuals who were sent to probation. <strong>45%</strong> of Riders return to prison within three years as compared to <strong>27%</strong> of those sentenced initially to probation in a similar time period. `,
        metricTypeId: "RidersReincarcerationRate",
      },
      {
        title: "Where do we go from here? ",
        body: `<div><p>Instead of sending low-level offenders to Riders, IDOC believes that sending the same people to treatment programs outside of prison (as conditions of probation or otherwise) would result in better social outcomes and more money saved that would otherwise be spent on incarceration. Money saved can be reinvested into community-based treatment programs to prevent people from entering the system in the first place.</p></div>`,
        type: "text",
      },
    ],
  },
};

export default content;
