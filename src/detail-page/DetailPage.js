import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import DimensionControl from "../dimension-control";

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

const SectionDivider = styled.hr``;

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
  showTimeSlider,
}) {
  const showControls = showDimensionControl || showTimeSlider;

  const [dimension, setDimension] = useState();

  return (
    <DetailSectionContainer>
      <DetailSectionHeader>
        <DetailSectionTitle>{title}</DetailSectionTitle>
        {showControls && (
          <DetailSectionControls>
            {showDimensionControl && (
              <DimensionControl onChange={setDimension} />
            )}
          </DetailSectionControls>
        )}
      </DetailSectionHeader>
      <DetailSectionDescription>{description}</DetailSectionDescription>
      <div>
        <h3>chart goes here</h3>
        <p>{dimension && `Dimension: ${dimension}`}</p>
      </div>
    </DetailSectionContainer>
  );
}

DetailSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showDimensionControl: PropTypes.bool.isRequired,
  showTimeSlider: PropTypes.bool.isRequired,
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
