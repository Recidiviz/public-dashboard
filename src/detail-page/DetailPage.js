import useBreakpoint, { mediaQuery } from "@w11r/use-breakpoint";
import classNames from "classnames";
import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { StickyContainer, Sticky } from "react-sticky";
import { exact, tail } from "set-order";
import styled from "styled-components";
import { OTHER_LABEL, TOTAL_KEY, THEME } from "../constants";
import { DimensionControl, MonthControl, LocationControl } from "../controls";
import { HeadingTitle, HeadingDescription } from "../heading";

const STICKY_CONTROLS_BREAKPOINT = "mobile-";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.divider};
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
  width: ${(props) => props.theme.sectionTextWidthNormal}px;

  .wide-text & {
    width: ${(props) => props.theme.sectionTextWidthWide}px;
  }
`;

const DetailSectionControls = styled.div`
  background: ${(props) => props.theme.colors.background};
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 100%;
  padding-bottom: 16px;

  &.is-sticky {
    z-index: ${(props) => props.theme.zIndex.control};
  }
`;

const DetailSectionDescription = styled.div`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  margin-bottom: 16px;
  padding-right: calc(
    100% - ${(props) => props.theme.sectionTextWidthNormal}px
  );
  width: 100%;

  .wide-text & {
    padding-right: calc(
      100% - ${(props) => props.theme.sectionTextWidthWide}px
    );
  }
`;

const DetailSectionVizContainer = styled.div`
  margin-bottom: 24px;
  margin-top: 32px;
  width: 100%;
`;

const PageControlsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const sortLocations = exact([tail(OTHER_LABEL)], ascending);

function DetailSection({
  title,
  description,
  showDimensionControl,
  showLocationControl,
  locationControlLabel,
  showMonthControl,
  otherControls,
  VizComponent,
  vizData,
}) {
  const [dimension, setDimension] = useState();
  const [month, setMonth] = useState();

  // a viz component that wants to use months will be responsible
  // for parsing its data and updating this value
  const [monthList, setMonthList] = useState();

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

  // TODO: this may change when we stack multiple sticky things
  const stickyControlOffset = THEME.headerHeightSmall;

  return (
    <StickyContainer>
      <DetailSectionContainer>
        <DetailSectionHeading>
          <DetailSectionTitle>{title}</DetailSectionTitle>
          <Sticky disableCompensation={!enableStickyControls} bottomOffset={32}>
            {({ style: stickyStyles, isSticky }) => (
              <DetailSectionControls
                className={classNames({
                  "is-sticky": enableStickyControls && isSticky,
                })}
                style={
                  enableStickyControls
                    ? {
                        ...stickyStyles,
                        top: (stickyStyles.top || 0) + stickyControlOffset,
                      }
                    : undefined
                }
              >
                {showMonthControl && monthList && (
                  <MonthControl months={monthList} onChange={setMonth} />
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
                {otherControls}
              </DetailSectionControls>
            )}
          </Sticky>
        </DetailSectionHeading>

        <DetailSectionDescription>{description}</DetailSectionDescription>
        <DetailSectionVizContainer>
          <VizComponent
            data={vizData}
            {...{ dimension, month, locationId, setMonthList }}
            onLocationClick={setLocationId}
          />
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
  locationControlLabel: PropTypes.string,
  otherControls: PropTypes.node,
  VizComponent: PropTypes.func,
  vizData: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string])
  ),
};

DetailSection.defaultProps = {
  showDimensionControl: false,
  showMonthControl: false,
  showLocationControl: false,
  locationControlLabel: "Location",
  otherControls: null,
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
  return (
    <PageContainer className={className}>
      <HeadingContainer>
        <HeadingTitle>{title}</HeadingTitle>
        <HeadingDescription>{description}</HeadingDescription>
        {pageControls && (
          <PageControlsWrapper>{pageControls}</PageControlsWrapper>
        )}
      </HeadingContainer>
      {sections.map((section) => (
        <React.Fragment key={section.title}>
          <SectionDivider />
          <DetailSection {...section} />
        </React.Fragment>
      ))}
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
