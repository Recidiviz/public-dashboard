import { subYears } from "date-fns";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { DimensionControl, TimeControl, DistrictControl } from "../controls";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;
const HeadingTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 16px;
`;
const HeadingDescription = styled.p`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  font-size: 24px;
  margin-top: 0;
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.divider};
`;

const sectionTextWidth = 420;

const DetailSectionContainer = styled.section``;

const DetailSectionHeader = styled.header`
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
  width: ${sectionTextWidth}px;
`;
const DetailSectionControls = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
`;

const DetailSectionDescription = styled.p`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  max-width: ${sectionTextWidth}px;
`;

function DetailSection({
  title,
  description,
  showDimensionControl,
  showDistrictControl,
  showTimeControl,
  VizComponent,
}) {
  const [dimension, setDimension] = useState();
  const [month, setMonth] = useState();

  // these are placeholders; replace them with values derived from data
  const [endDate] = useState(new Date());
  const [startDate] = useState(subYears(endDate, 3));

  // this is also a placeholder;
  // once data is loaded this should be updated with a list of districts
  const [districts] = useState(["ALL", "1", "2", "3"]);
  const [currentDistrict, setCurrentDistrict] = useState();

  return (
    <DetailSectionContainer>
      <DetailSectionHeader>
        <DetailSectionTitle>{title}</DetailSectionTitle>
        <DetailSectionControls>
          {showTimeControl && (
            <TimeControl {...{ startDate, endDate }} onChange={setMonth} />
          )}
          {showDimensionControl && <DimensionControl onChange={setDimension} />}
          {showDistrictControl && (
            <DistrictControl
              districts={districts}
              onChange={setCurrentDistrict}
            />
          )}
        </DetailSectionControls>
      </DetailSectionHeader>
      <DetailSectionDescription>{description}</DetailSectionDescription>
      <div>
        <h3>chart goes here</h3>
        <p>{dimension && `Dimension: ${dimension.label}`}</p>
        <p>{month && `Month: ${month}`}</p>
        <p>{currentDistrict && `District: ${currentDistrict.label}`}</p>
        <VizComponent />
      </div>
    </DetailSectionContainer>
  );
}

DetailSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showDimensionControl: PropTypes.bool,
  showTimeControl: PropTypes.bool,
  showDistrictControl: PropTypes.bool,
  // TODO: should be required
  VizComponent: PropTypes.func,
};

DetailSection.defaultProps = {
  showDimensionControl: false,
  showTimeControl: false,
  showDistrictControl: false,
  VizComponent: () => null,
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
