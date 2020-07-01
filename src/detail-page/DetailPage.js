import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;
const HeadingTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.displayFont};
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 16px;
`;
const HeadingDescription = styled.p`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.bodyFont};
  font-size: 24px;
  margin-top: 0;
`;

const SectionDivider = styled.hr``;

const sectionTextWidth = 420;

const DetailSectionContainer = styled.section``;
const DetailSectionTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.displayFont};
  font-size: 20px;
  margin-bottom: 16px;
  width: ${sectionTextWidth}px;
`;
const DetailSectionDescription = styled.p`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.bodyFont};
  width: ${sectionTextWidth}px;
`;

function DetailSection({ title, description }) {
  return (
    <DetailSectionContainer>
      <DetailSectionTitle>{title}</DetailSectionTitle>
      <DetailSectionDescription>{description}</DetailSectionDescription>
    </DetailSectionContainer>
  );
}

DetailSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
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
