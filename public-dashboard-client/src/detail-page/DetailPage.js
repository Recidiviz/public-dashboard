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

import { ErrorBoundary } from "@sentry/react";
import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Measure from "react-measure";
import { StickyContainer, Sticky } from "react-sticky";
import { exact, tail } from "set-order";
import styled from "styled-components";
import ChartError from "../chart-error";
import {
  COLLAPSIBLE_NAV_BREAKPOINT,
  OTHER_LABEL,
  TOTAL_KEY,
} from "../constants";
import { DimensionControl, MonthControl, LocationControl } from "../controls";
import TwoYearRangeControl from "../controls/TwoYearRangeControl";
import { HeadingTitle, HeadingDescription } from "../heading";
import { THEME } from "../theme";

const STICKY_CONTROLS_BREAKPOINT = "mobile-";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.divider};
  margin-top: 88px;
`;

const DetailSectionContainer = styled.section``;

const DetailSectionHeading = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  max-width: 100%;

  ${mediaQuery([STICKY_CONTROLS_BREAKPOINT, `display: block;`])};
`;

const DetailSectionTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  flex: 0 1 auto;
  font: ${(props) => props.theme.fonts.display};
  font-size: 20px;
  margin-bottom: 16px;
  margin-right: 32px;
  max-width: 100%;

  ${mediaQuery([
    STICKY_CONTROLS_BREAKPOINT,
    `
      margin-right: 0;
      width: 100%;
    `,
  ])}
`;

const DetailSectionControls = styled.div`
  background: ${(props) => props.theme.colors.background};
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 100%;
  padding-bottom: 16px;
  z-index: ${(props) => props.theme.zIndex.control};
`;

const DetailSectionDescription = styled.div`
  margin-bottom: 16px;
  max-width: ${(props) => props.theme.sectionTextWidth};

  ${mediaQuery([COLLAPSIBLE_NAV_BREAKPOINT, `max-width: none;`])};
`;

const DetailSectionVizContainer = styled.div`
  margin-bottom: 24px;
  margin-top: 32px;
  width: 100%;
`;

const PageControlsWrapper = styled.div`
  background: ${(props) => props.theme.colors.background};
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
  z-index: ${(props) => props.theme.zIndex.control + 10};

  ${mediaQuery([STICKY_CONTROLS_BREAKPOINT, `justify-content: flex-start;`])};
`;

const sortLocations = exact([tail(OTHER_LABEL)], ascending);

const adjustStickyStyles = ({ stickyStyles, topOffset }) => ({
  ...stickyStyles,
  // need to compensate for the height of other fixed or sticky elements,
  // because we stack multiple under each other
  top: (stickyStyles.top || 0) + topOffset,
});

function DetailSection({
  title,
  description,
  showDimensionControl,
  showLocationControl,
  locationControlLabel,
  showMonthControl,
  showTimeRangeControl,
  otherControls,
  stickyOffset,
  VizComponent,
  vizData,
}) {
  const [dimension, setDimension] = useState();
  const [month, setMonth] = useState();

  // a viz component that wants to use months will be responsible
  // for parsing its data and updating this value
  const [monthList, setMonthList] = useState();

  const [timeRangeId, setTimeRangeId] = useState();

  let initialLocationList;
  if (showLocationControl && vizData.locations) {
    initialLocationList = vizData.locations
      // there may be other fields on these objects, filter them out for cleanliness
      .map(({ id, label }) => ({ id, label }))
      .sort((a, b) => sortLocations(a.label, b.label));

    initialLocationList.unshift({ id: TOTAL_KEY, label: "All" });
  }
  const [locationList] = useState(initialLocationList);
  const [locationId, setLocationId] = useState();

  const enableStickyControls = useBreakpoint(false, ["mobile-", true]);

  return (
    <StickyContainer>
      <DetailSectionContainer>
        <DetailSectionHeading>
          <DetailSectionTitle>{title}</DetailSectionTitle>
          <Sticky disableCompensation={!enableStickyControls} bottomOffset={32}>
            {({ style: stickyStyles }) => (
              <DetailSectionControls
                style={
                  enableStickyControls
                    ? adjustStickyStyles({
                        stickyStyles,
                        topOffset: stickyOffset,
                      })
                    : undefined
                }
              >
                {otherControls}
                {showMonthControl && monthList && (
                  <MonthControl months={monthList} onChange={setMonth} />
                )}
                {showTimeRangeControl && (
                  <TwoYearRangeControl
                    onChange={setTimeRangeId}
                    value={timeRangeId}
                  />
                )}
                {
                  // we need both a flag and data to enable location control
                  showLocationControl && locationList && (
                    <LocationControl
                      label={locationControlLabel}
                      locations={locationList}
                      onChange={setLocationId}
                      value={locationId}
                    />
                  )
                }
                {showDimensionControl && (
                  <DimensionControl onChange={setDimension} />
                )}
              </DetailSectionControls>
            )}
          </Sticky>
        </DetailSectionHeading>

        <DetailSectionDescription>{description}</DetailSectionDescription>
        <DetailSectionVizContainer>
          <ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("boundary", "chart");
            }}
            fallback={ChartError}
          >
            <VizComponent
              data={vizData}
              {...{
                dimension,
                locationId,
                month,
                setMonthList,
                setTimeRangeId,
                timeRangeId,
              }}
              onLocationClick={setLocationId}
            />
          </ErrorBoundary>
        </DetailSectionVizContainer>
      </DetailSectionContainer>
    </StickyContainer>
  );
}

DetailSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  showDimensionControl: PropTypes.bool,
  showMonthControl: PropTypes.bool,
  showLocationControl: PropTypes.bool,
  showTimeRangeControl: PropTypes.bool,
  locationControlLabel: PropTypes.string,
  otherControls: PropTypes.node,
  stickyOffset: PropTypes.number,
  VizComponent: PropTypes.func,
  // this will be passed through to a component that can validate for itself
  vizData: PropTypes.objectOf(PropTypes.any),
};

DetailSection.defaultProps = {
  showDimensionControl: false,
  showMonthControl: false,
  showLocationControl: false,
  showTimeRangeControl: false,
  locationControlLabel: "Location",
  otherControls: null,
  stickyOffset: 0,
  VizComponent: () => null,
  vizData: {},
};

export default function DetailPage({
  className,
  title,
  description,
  sections,
  pageControls,
}) {
  const stickyControlOffset = useBreakpoint(THEME.headerHeight, [
    COLLAPSIBLE_NAV_BREAKPOINT,
    THEME.headerHeightSmall,
  ]);
  const [stickyControlHeight, setStickyControlHeight] = useState(0);

  return (
    <PageContainer className={className}>
      <HeadingContainer>
        <HeadingTitle>{title}</HeadingTitle>
        <HeadingDescription>{description}</HeadingDescription>
      </HeadingContainer>
      <StickyContainer>
        {pageControls && (
          <Sticky topOffset={-stickyControlOffset}>
            {({ style: stickyStyles }) => (
              <Measure
                bounds
                onResize={({ bounds: { height } }) =>
                  setStickyControlHeight(height)
                }
              >
                {({ measureRef }) => (
                  <PageControlsWrapper
                    ref={measureRef}
                    style={adjustStickyStyles({
                      stickyStyles,
                      topOffset: stickyControlOffset,
                    })}
                  >
                    {pageControls}
                  </PageControlsWrapper>
                )}
              </Measure>
            )}
          </Sticky>
        )}
        {sections.map((section) => (
          <React.Fragment key={section.title}>
            <SectionDivider />
            <DetailSection
              {...section}
              stickyOffset={stickyControlHeight + stickyControlOffset}
            />
          </React.Fragment>
        ))}
      </StickyContainer>
    </PageContainer>
  );
}

DetailPage.propTypes = {
  className: PropTypes.string,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape(DetailSection.propTypes)),
  pageControls: PropTypes.node,
};

DetailPage.defaultProps = {
  className: undefined,
  sections: [],
  pageControls: null,
};
