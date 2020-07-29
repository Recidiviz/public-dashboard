import useBreakpoint from "@w11r/use-breakpoint";
import classNames from "classnames";
import { ascending } from "d3-array";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { exact, tail } from "set-order";
import styled from "styled-components";
import { FIXED_HEADER_HEIGHT, OTHER_LABEL, TOTAL_KEY } from "../constants";
import { DimensionControl, MonthControl, LocationControl } from "../controls";
import { HeadingTitle, HeadingDescription } from "../heading";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.divider};
`;

const sectionTextWidth = 420;

const DetailSectionContainer = styled.section`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const DetailSectionTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  flex: 0 1 auto;
  font: ${(props) => props.theme.fonts.display};
  font-size: 20px;
  margin-bottom: 16px;
  margin-right: 32px;
  width: ${sectionTextWidth}px;
`;

const DetailSectionControls = styled.div`
  background: ${(props) => props.theme.colors.background};
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 100%;
  padding-bottom: 16px;

  &.sticky {
    position: sticky;
    top: ${FIXED_HEADER_HEIGHT}px;
    width: 100%;
    z-index: ${(props) => props.theme.zIndex.control};
  }
`;

const DetailSectionDescription = styled.p`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  padding-right: calc(100% - ${sectionTextWidth}px);
  width: 100%;
`;

const DetailSectionVizContainer = styled.div`
  margin-bottom: 24px;
  margin-top: 32px;
  width: 100%;
`;

const sortLocations = exact([tail(OTHER_LABEL)], ascending);

function DetailSection({
  title,
  description,
  showDimensionControl,
  showLocationControl,
  locationControlLabel,
  showMonthControl,
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

  const sticky = useBreakpoint(false, ["mobile-", true]);

  return (
    <DetailSectionContainer>
      <DetailSectionTitle>{title}</DetailSectionTitle>
      <DetailSectionControls className={classNames({ sticky })}>
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
        {showDimensionControl && <DimensionControl onChange={setDimension} />}
      </DetailSectionControls>

      <DetailSectionDescription>{description}</DetailSectionDescription>
      <DetailSectionVizContainer>
        <VizComponent
          data={vizData}
          {...{ dimension, month, locationId, setMonthList }}
          onLocationClick={setLocationId}
        />
      </DetailSectionVizContainer>
    </DetailSectionContainer>
  );
}

DetailSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showDimensionControl: PropTypes.bool,
  showMonthControl: PropTypes.bool,
  showLocationControl: PropTypes.bool,
  locationControlLabel: PropTypes.string,
  VizComponent: PropTypes.func.isRequired,
  vizData: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};

DetailSection.defaultProps = {
  showDimensionControl: false,
  showMonthControl: false,
  showLocationControl: false,
  locationControlLabel: "Location",
};

export default function DetailPage({ title, description, sections }) {
  return (
    <PageContainer>
      <HeadingContainer>
        <HeadingTitle>{title}</HeadingTitle>
        <HeadingDescription>{description}</HeadingDescription>
        {sections.map((section) => (
          <React.Fragment key={section.title}>
            <SectionDivider />
            <DetailSection {...section} />
          </React.Fragment>
        ))}
      </HeadingContainer>
    </PageContainer>
  );
}

DetailPage.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape(DetailSection.propTypes)),
};

DetailPage.defaultProps = {
  sections: [],
};
