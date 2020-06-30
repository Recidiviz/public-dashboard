import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;
const HeadingTitle = styled.h1``;
const HeadingDescription = styled.p``;

const SectionDivider = styled.hr``;

const DetailSectionContainer = styled.section``;
const DetailSectionTitle = styled.h1``;
const DetailSectionDescription = styled.p``;

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
          <>
            <SectionDivider />
            <DetailSection {...section} />
          </>
        ))}
      </HeadingContainer>
    </PageContainer>
  );
}

DetailPage.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  sections: PropTypes.arrayOf(DetailSection.propTypes),
};

DetailPage.defaultProps = {
  sections: [],
};
