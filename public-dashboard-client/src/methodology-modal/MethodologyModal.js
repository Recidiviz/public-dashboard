import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { PATHS, SECTION_TITLES, ALL_PAGES } from "../constants";
import { HeadingDescription, HeadingTitle } from "../heading";
import Modal from "../modal";
import useCurrentPage from "../hooks/useCurrentPage";

const MethodologyWrapper = styled.div``;
const MethodologyHeader = styled.div`
  margin-bottom: 48px;
`;
const MethodologyHeading = styled(HeadingTitle)``;

const MethodologyDescription = styled(HeadingDescription)`
  font-size: 16px;
  min-height: 0;
`;

const MethodologyBody = styled.div``;

const SectionTitle = styled(HeadingTitle)`
  font-size: 20px;
`;

const CONTENTS_BY_PAGE = {
  [PATHS.overview]: null,
  [PATHS.sentencing]: (
    <>
      <SectionTitle>{ALL_PAGES.get(PATHS.sentencing)}</SectionTitle>
      <MethodologyDescription>
        This page includes information about everyone currently involved with
        the ND DOCR.
      </MethodologyDescription>
      <MethodologyDescription>
        District selection allows you to filter data in a section to only
        individuals whose sentence was imposed by a judge from a particular
        judicial district. Individuals are linked to the judicial district
        associated with their charge (for individuals sentenced to
        incarceration) or to the judicial district that encompasses the county
        in which their offense took place (for individuals sentenced to
        probation).
      </MethodologyDescription>
      <MethodologyDescription>
        Some individuals have multiple sentences resulting from multiple
        charges. When this occurs, one charge is considered the “controlling”
        charge, meaning the sentence associated with this charge is currently
        the most restrictive sentence being served. For individuals currently
        incarcerated, the sentence associated with the controlling charge
        determines the judicial district in which the person is counted.
        Individuals on supervision are counted in each judicial district for
        which they are serving a sentence.
      </MethodologyDescription>
      <MethodologyDescription>
        When distribution of sentences by age are shown, individuals are counted
        towards the age group they fall into as of today. Gender distributions
        only include male and female due to low numbers of other reported
        genders. Individuals may have more than one reported race or ethnicity.
        For the purpose of this dashboard, distributions by race count
        individuals with more than one reported race or ethnicity towards the
        racial or ethnic identity that is least represented in North Dakota’s
        population. The “Other” category includes Asian and Native Hawaiian or
        other Pacific Islander individuals due to low counts of these reported
        racial identities.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.sentencing].population}</SectionTitle>
      <MethodologyDescription>
        This includes all individuals that are currently incarcerated, on
        parole, or on probation in North Dakota.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.sentencing].types}</SectionTitle>
      <MethodologyDescription>
        Incarceration includes any sentence that begins with a period of
        incarceration in a ND DOCR facility. Probation includes any sentence
        that begins with a period of probation under the supervision of a ND
        DOCR probation officer.
      </MethodologyDescription>
      <MethodologyDescription>
        Of note, individuals’ current status (incarcerated or on supervision)
        may differ from their sentence category (incarceration or probation).
        Individuals now on parole after being incarcerated are still counted in
        the incarceration sentence category. Individuals who have had their
        probation revoked and are now in prison are likewise included in the
        probation sentence category because their sentence was first to
        probation.
      </MethodologyDescription>
      <MethodologyDescription>
        It is possible for an individual to be serving both incarceration and
        probation sentences simultaneously. These individuals are counted in the
        “Both” category.
      </MethodologyDescription>
    </>
  ),
  [PATHS.prison]: (
    <>
      <SectionTitle>{ALL_PAGES.get(PATHS.prison)}</SectionTitle>
      <MethodologyDescription>
        This page includes information about individuals currently or recently
        in prison in North Dakota. It does not include individuals incarcerated
        in county jails.
      </MethodologyDescription>
      <MethodologyDescription>
        When distributions by age are shown, individuals are counted towards the
        age group they fall into as of today. Gender distributions only include
        male and female due to low numbers of other reported genders.
        Individuals may have more than one reported race or ethnicity. For the
        purpose of this dashboard, distributions by race count individuals with
        more than one reported race or ethnicity towards the racial or ethnic
        identity that is least represented in North Dakota’s population. The
        “Other” category includes Asian and Native Hawaiian or Other Pacific
        Islander individuals due to low counts of these reported racial
        identities.
      </MethodologyDescription>
      <MethodologyDescription>
        Facility selection allows you to filter data in a section to only
        individuals who are or were incarcerated in the selected facility.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.prison].population}</SectionTitle>
      <MethodologyDescription>
        This includes all individuals that are currently incarcerated in a ND
        DOCR facility. It does not include individuals incarcerated in county
        jails nor individuals currently serving their prison sentence in the
        community through the Community Placement Program.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.prison].overTime}</SectionTitle>
      <MethodologyDescription>
        This chart shows the number of people that were incarcerated in a ND
        DOCR facility on the first day of each month over the last 20 years. It
        does not include individuals incarcerated in county jails nor
        individuals serving their prison sentence in the community through the
        Community Placement Program.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.prison].reasons}</SectionTitle>
      <MethodologyDescription>
        This shows the original reason for admission for all individuals
        currently incarcerated in a ND DOCR facility. When an individual is
        admitted to a state prison, the reason for the admission is documented
        by prison officials. These categories are pulled from that
        documentation.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.prison].terms}</SectionTitle>
      <MethodologyDescription>
        This graph shows how long (in years) individuals spent in prison prior
        to their first official release for a specific sentence. It includes
        individuals released in the past 3 years who, prior to release, were
        serving a new sentence of incarceration or were incarcerated due to
        revocation of probation. It excludes individuals incarcerated due to
        revocation of parole. Individuals released from prison for a reason
        other than completion of sentence, commutation of sentence, parole, or
        death are also excluded. Of note, this graph does include time spent in
        the Community Placement Program prior to release as part of time served.
        Individuals serving life sentences will only be included upon their
        death.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.prison].releases}</SectionTitle>
      <MethodologyDescription>
        This includes all individuals released in the last 3 years, including
        releases directly from the Community Placement Program. When an
        individual is released from a state prison, the reason for the release
        is documented by prison officials. These categories are pulled from that
        documentation. Facility release reasons that do not typically correlate
        with an end to the period of incarceration, such as transfers between
        facilities, are not shown here.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.prison].recidivism}</SectionTitle>
      <MethodologyDescription>
        This chart shows reincarceration recidivism rates, which is the
        proportion of individuals released from a ND DOCR facility that return
        to a ND DOCR facility at some point in the future. The releases are
        grouped by the calendar year in which the release occurred, and the
        rates are calculated as the percentage of the people released that have
        returned to incarceration after each year since the release. Individuals
        are included in the release cohort if they were released for serving
        their sentence or were conditionally released onto supervision.
        Admissions to incarceration for new court commitments or due to
        revocations of supervision are counted as instances of reincarceration
        recidivism.
      </MethodologyDescription>
      <SectionTitle>
        {SECTION_TITLES[PATHS.prison].recidivismSingleFollowup}
      </SectionTitle>
      <MethodologyDescription>
        This chart shows the reincarceration recidivism rate for a set number
        years since the release, for the 10 most recent release cohorts.
      </MethodologyDescription>
    </>
  ),
  [PATHS.parole]: (
    <>
      <SectionTitle>{ALL_PAGES.get(PATHS.parole)}</SectionTitle>
      <MethodologyDescription>
        This page includes information about individuals currently or recently
        on parole in North Dakota. This may include some individuals on parole
        in North Dakota as part of the interstate compact program, in which
        North Dakota agrees to supervise the release of individuals who were
        charged, sentenced, and incarcerated in a different state, but have a
        compelling reason to serve their parole in North Dakota. Under the same
        program, individuals paroled from a North Dakota prison may occasionally
        serve their parole in a different state.
      </MethodologyDescription>
      <MethodologyDescription>
        When distributions by age are shown, individuals are counted towards the
        age group they fall into as of today. Gender distributions only include
        male and female due to low numbers of other reported genders.
        Individuals may have more than one reported race or ethnicity. For the
        purpose of this dashboard, distributions by race count individuals with
        more than one reported race or ethnicity towards the racial or ethnic
        identity that is least represented in North Dakota’s population. The
        “Other” category includes Asian and Native Hawaiian or other Pacific
        Islander individuals due to low counts of these reported racial
        identities.
      </MethodologyDescription>
      <MethodologyDescription>
        Office selection allows you to filter data in a section to only
        individuals who are being supervised by a parole officer stationed in
        the selected office.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.parole].population}</SectionTitle>
      <MethodologyDescription>
        This visualization counts people currently on parole in North Dakota.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.parole].overTime}</SectionTitle>
      <MethodologyDescription>
        This chart shows the number of people that were on parole in North
        Dakota on the first day of each month over the last 20 years.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.parole].completion}</SectionTitle>
      <MethodologyDescription>
        This chart looks at the percent of people projected to complete parole
        in a given month who have successfully completed parole by the end of
        that month.
      </MethodologyDescription>
      <MethodologyDescription>
        Parole is considered successfully completed if an individual is
        discharged from parole positively or if a parole period expires.
        Unsuccessful completions of parole occur when the parole ends due to
        absconsion, a revocation, or a negative termination. Deaths,
        suspensions, and terminations marked as “other” are excluded from these
        calculations because they are neither successful nor unsuccessful.
      </MethodologyDescription>
      <MethodologyDescription>
        Individuals whose parole is terminated prior to their projected
        completion month are counted in the month in which their parole is
        scheduled to complete, while individuals who have not yet completed
        parole by their projected completion date are excluded. For example, if
        15 people are projected to complete parole in 12 months, 5 are revoked
        this month, 3 are discharged early in 8 months, 2 complete parole in 12
        months, and 5 do not complete parole, the completion rate in 12 months
        will be 50%, as 10 of the people projected to complete parole will have
        actually completed parole, 5 of them successfully.
      </MethodologyDescription>
      <MethodologyDescription>
        The summary completion rates are calculated by taking the total number
        of people originally projected to complete parole in the past 3 years
        who have completed parole for a positive or negative reason, then
        determining the percent of these people for whom the reason was
        positive. Viewing by a demographic category does the same, but groups by
        race, age, or gender. Filtering to a given office looks only at success
        rates of individuals who were supervised in that office.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.parole].revocations}</SectionTitle>
      <MethodologyDescription>
        This chart counts people who were incarcerated in a DOCR facility within
        the last 3 years because their parole was revoked. Revocations are
        included based on the date that the person was admitted to a DOCR
        facility because their parole was revoked, not the date of the parole
        case closure or causal violation or offense.
      </MethodologyDescription>
      <MethodologyDescription>
        Revocation admissions are linked to parole cases closed via revocation
        within 90 days of the admission. Each individual is counted once, even
        if they had multiple violation reasons or revocation proceedings from
        multiple supervision cases. If an individual has had their parole
        revoked multiple times in the last 3 years, the most recent revocation
        is counted. When an individual does have multiple violation types
        leading to revocation, only the most severe violation is displayed. New
        offenses are considered more severe than absconsions, which are
        considered more severe than technical violations. Violations of “Unknown
        Type” indicate individuals who were admitted to prison for a supervision
        revocation where the violation that caused the revocation cannot yet be
        determined. Revocation admissions without a supervision case closed via
        revocation in the 90 day window will always be considered of “Unknown
        Type”.
      </MethodologyDescription>
      <MethodologyDescription>
        Individuals occasionally serve probation and parole sentences
        simultaneously. For revoked individuals in this situation, their
        revocation admission is categorized as either a probation or a parole
        revocation, depending on who authorized the revocation admission (the
        parole board for parole revocations or the sentencing judge for
        probation revocations). This chart counts only individuals with parole
        revocation admissions. Individuals on both parole and probation with a
        probation revocation admission are included in the probation page.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.parole].ftr}</SectionTitle>
      <MethodologyDescription>
        This chart counts the total number of people on parole who are actively
        enrolled in Free Through Recovery (FTR). Free Through Recovery is run
        jointly with the Department of Health and Human Services (DHS): as a
        result, FTR enrollment is aggregated into the 8 DHS service regions of
        the provider locations at which individuals are enrolled.
      </MethodologyDescription>
    </>
  ),
  [PATHS.probation]: (
    <>
      <SectionTitle>{ALL_PAGES.get(PATHS.probation)}</SectionTitle>
      <MethodologyDescription>
        This page includes information about individuals currently or recently
        on probation in North Dakota. This may include some individuals on
        probation in North Dakota as part of the interstate compact program, in
        which North Dakota agrees to supervise individuals who were charged and
        sentenced in a different state, but have a compelling reason to serve
        their probation in North Dakota. Under the same program, individuals
        placed on probation from a North Dakota court may occasionally serve
        their probation in a different state.
      </MethodologyDescription>
      <MethodologyDescription>
        Gender distributions only include male and female due to low numbers of
        other reported genders. Individuals may have more than one reported race
        or ethnicity. For the purpose of this dashboard, distributions by race
        count individuals with more than one reported race or ethnicity towards
        the racial or ethnic identity that is least represented in North
        Dakota’s population. The “Other” category includes Asian and Native
        Hawaiian or other Pacific Islander individuals due to low counts of
        these reported racial identities.
      </MethodologyDescription>
      <MethodologyDescription>
        District selection allows you to filter data in a section to only
        individuals whose probation sentence was imposed by a judge from a
        particular judicial district, determined by the judicial district that
        encompasses the county in which the offense took place.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.probation].population}</SectionTitle>
      <MethodologyDescription>
        This visualization counts people currently on probation in North Dakota.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.probation].overTime}</SectionTitle>
      <MethodologyDescription>
        This chart shows the number of people that were on probation in North
        Dakota on the first day of each month over the last 20 years.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.probation].completion}</SectionTitle>
      <MethodologyDescription>
        This chart looks at the percent of people projected to complete
        probation in a given month who have successfully completed probation by
        the end of that month.
      </MethodologyDescription>
      <MethodologyDescription>
        Probation is considered successfully completed if the individual is
        discharged from probation positively or if a probation period expires.
        Unsuccessful completion of probation occurs when probation ends due to
        absconsion, revocation, or negative termination. Deaths, suspensions,
        and terminations marked as “other” are excluded from these calculations
        because they are neither successful nor unsuccessful.
      </MethodologyDescription>
      <MethodologyDescription>
        Individuals whose probation is terminated prior to their projected
        completion month are counted in the month in which their probation is
        scheduled to complete, while individuals who have not yet completed
        probation by their projected completion date are excluded. For example,
        if 15 people are projected to complete probation in 12 months, 5 are
        revoked this month, 3 are discharged early in 8 months, 2 complete
        parole in 12 months, and 5 do not complete probation, the completion
        rate in 12 months will be 50%, as 10 of the people projected to complete
        probation will have actually completed probation, 5 of them
        successfully.
      </MethodologyDescription>
      <MethodologyDescription>
        The summary completion rates are calculated by taking the total number
        of people originally projected to complete probation in the past 3 years
        who have completed probation for a positive or negative reason, then
        determining the percent of these people for whom the reason was
        positive. Viewing by a demographic category does the same, but groups by
        race, age, or gender. Filtering to a given district looks only at
        success rates of individuals under the jurisdiction of that judicial
        district.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.probation].revocations}</SectionTitle>
      <MethodologyDescription>
        This chart counts people who were incarcerated in a DOCR facility within
        the last 3 years because their probation was revoked. Revocations are
        included based on the date that the person was admitted to a DOCR
        facility because their probation was revoked, not the date of the
        probation case closure or causal violation or offense.
      </MethodologyDescription>
      <MethodologyDescription>
        Revocation admissions are linked to supervision cases closed via
        revocation within 90 days of the admission. Each individual is counted
        once, even if they had multiple violation reasons or revocation
        proceedings from multiple supervision cases. If an individual had their
        probation revoked multiple times in the last 3 years, the most recent
        revocation is counted. When an individual does have multiple violation
        types leading to revocation, only the most severe violation is
        displayed. New offenses are considered more severe than absconsions,
        which are considered more severe than technical violations. Violations
        of “Unknown Type” indicate individuals who were admitted to prison for a
        supervision revocation where the violation that caused the revocation
        cannot yet be determined. Revocation admissions without a supervision
        case closed via revocation in the 90 day window will always be
        considered of “Unknown Type”.
      </MethodologyDescription>
      <MethodologyDescription>
        Individuals occasionally serve probation and parole sentences
        simultaneously. For revoked individuals in this situation, their
        revocation admission is categorized as either a probation or a parole
        revocation, depending on who authorized the revocation admission (the
        parole board for parole revocations or the sentencing judge for
        probation revocations). This chart counts only individuals with
        probation revocation admissions. Individuals on both parole and
        probation with a parole revocation admission are included in the parole
        page.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.probation].ftr}</SectionTitle>
      <MethodologyDescription>
        This chart counts the total number of people on probation who are
        actively enrolled in Free Through Recovery (FTR). Free Through Recovery
        is run jointly with the Department of Health and Human Services (DHS):
        as a result, FTR enrollment is aggregated into the 8 DHS service regions
        of the provider locations at which individuals are enrolled.
      </MethodologyDescription>
    </>
  ),
  [PATHS.race]: (
    <>
      <SectionTitle>{ALL_PAGES.get(PATHS.race)}</SectionTitle>
      <MethodologyDescription>
        This page contains information about how people of different races and
        ethnicities experience corrections in North Dakota. Individuals may have
        more than one reported race or ethnicity. For the purpose of this
        dashboard, individuals with more than one reported race or ethnicity are
        counted towards the racial or ethnic identity that is least represented
        in North Dakota’s population. The “Other” category includes Asian and
        Native Hawaiian or Other Pacific Islander individuals due to low counts
        of these reported racial identities.
      </MethodologyDescription>
      <MethodologyDescription>
        This page includes individuals currently or recently on probation,
        parole, or incarcerated in North Dakota. This may include some
        individuals on probation or parole in North Dakota as part of the
        interstate compact program, in which North Dakota agrees to supervise
        individuals who were charged and sentenced in a different state, but
        have a compelling reason to serve their supervision in North Dakota.
        Under the same program, individuals placed on supervision in a North
        Dakota court may occasionally complete their supervision in a different
        state.
      </MethodologyDescription>
      <SectionTitle>
        {SECTION_TITLES[PATHS.race].beforeIncarceration}
      </SectionTitle>
      <MethodologyDescription>
        This section looks at the representation of a racial or ethnic group
        overall in North Dakota and under the jurisdiction of the North Dakota
        Department of Corrections and Rehabilitation (ND DOCR). The source of
        data for racial and ethnic proportions overall in North Dakota is the US
        Census Bureau. The proportion under DOCR control is the percent of
        individuals currently incarcerated or under community supervision of a
        given racial or ethnic group.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.race].sentencing}</SectionTitle>
      <MethodologyDescription>
        This section examines how individuals are interacting with the ND DOCR.
        Incarceration includes any sentence that begins with a period of
        incarceration in a ND DOCR facility. Probation includes any sentence
        that begins with a period of probation under the supervision of a ND
        DOCR probation officer.
      </MethodologyDescription>
      <MethodologyDescription>
        Of note, individuals’ current status (incarcerated or on supervision)
        may differ from their sentence category (incarceration or probation).
        Individuals now on parole after being incarcerated are still counted in
        the incarceration sentence category. Individuals who have had their
        probation revoked and are now in prison are likewise included in the
        probation sentence category because their sentence was first to
        probation.
      </MethodologyDescription>
      <MethodologyDescription>
        It is possible for an individual to be serving both an incarceration and
        probation sentence simultaneously. For this reason, the sum of the
        percentage of individuals serving each type of sentence may be greater
        than 100%.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.race].parole}</SectionTitle>
      <MethodologyDescription>
        Individuals are counted as released to parole if they have been released
        from a period of incarceration where parole is documented as the reason
        for release. This calculates the percent of the overall incarceration
        population and overall releases to parole over the last 3 years, or 36
        months, who were of the selected racial or ethnic group.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.race].supervision}</SectionTitle>
      <MethodologyDescription>
        This calculates the percent of the overall supervision population and
        revocation admissions over the last 3 years, or 36 months, who were of
        the selected racial or ethnic group.
      </MethodologyDescription>
      <MethodologyDescription>
        Revocation admissions count people who were incarcerated in a DOCR
        facility because their supervision was revoked. Revocations are included
        based on the date that the person was admitted to a DOCR facility
        because their supervision was revoked, not the date of the supervision
        case closure or causal violation or offense.
      </MethodologyDescription>
      <MethodologyDescription>
        Revocation admissions are linked to supervision cases closed via
        revocation within 90 days of the admission. Each individual is counted
        once, even if they had multiple violation reasons or revocation
        proceedings from multiple supervision cases. When an individual does
        have multiple violation types leading to revocation, only the most
        severe violation is displayed. New offenses are considered more severe
        than absconsions, which are considered more severe than technical
        violations. Violations of “Unknown Type” indicate individuals who were
        admitted to prison for a supervision revocation where the violation that
        caused the revocation cannot yet be determined. Revocation admissions
        without a supervision case closed via revocation in the 90 day window
        will always be considered of “Unknown Type”.
      </MethodologyDescription>
      <MethodologyDescription>
        Individuals occasionally serve probation and parole sentences
        simultaneously. For revoked individuals in this situation, their
        revocation admission is categorized as either a probation or a parole
        revocation, depending on who authorized the revocation admission (the
        parole board for parole revocations or the sentencing judge for
        probation revocations).
      </MethodologyDescription>
      <MethodologyDescription>
        When the supervision type dropdown is set to show “Everyone”, the chart
        counts the number of unique individuals who have been admitted to a DOCR
        facility for a supervision revocation. If an individual has had their
        probation revoked multiple times in the last 3 years, the most recent
        revocation is counted. When the supervision type dropdown specifies
        either “Probation” or “Parole”, the counts are limited to just the
        selected type of supervision revocations. If an individual has had both
        probation and parole revoked within the last 3 years, they will appear
        in both counts.
      </MethodologyDescription>
      <SectionTitle>{SECTION_TITLES[PATHS.race].programming}</SectionTitle>
      <MethodologyDescription>
        This calculates the percent of the current Free Through Recovery
        participants and the current supervision population that are of the
        selected racial or ethnic group.
      </MethodologyDescription>
    </>
  ),
};

export default function MethodologyModal({ trigger }) {
  const [modalOpen, setModalOpen] = useState(false);
  const currentPage = useCurrentPage();

  return (
    <Modal trigger={trigger} open={modalOpen} setOpen={setModalOpen}>
      <MethodologyWrapper>
        <MethodologyHeader>
          <MethodologyHeading>Methodology</MethodologyHeading>
          <MethodologyDescription>
            Data in this dashboard is updated daily from North Dakota Department
            of Corrections and Rehabilitation (ND DOCR) databases.
          </MethodologyDescription>
        </MethodologyHeader>
        <MethodologyBody>{CONTENTS_BY_PAGE[currentPage]}</MethodologyBody>
      </MethodologyWrapper>
    </Modal>
  );
}

MethodologyModal.propTypes = {
  trigger: PropTypes.node.isRequired,
};
