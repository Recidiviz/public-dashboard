import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { ascending } from "d3-array";
import { TOTAL_KEY } from "../constants";
import { DimensionControl, MonthControl, OfficeControl } from "../controls";
import { HeadingTitle, HeadingDescription } from "../heading";

const PageContainer = styled.article``;
const HeadingContainer = styled.header``;

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
  margin-right: 32px;
  width: ${sectionTextWidth}px;
`;
const DetailSectionControls = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 100%;
`;

const DetailSectionDescription = styled.p`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
  max-width: ${sectionTextWidth}px;
`;

const DetailSectionVizContainer = styled.div`
  margin-bottom: 24px;
  margin-top: 32px;
`;

function DetailSection({
  title,
  description,
  showDimensionControl,
  showOfficeControl,
  showMonthControl,
  VizComponent,
  vizData,
}) {
  const [dimension, setDimension] = useState();
  const [month, setMonth] = useState();

  // a viz component that wants to use months will be responsible
  // for parsing its data and updating this value
  const [monthList, setMonthList] = useState();

  let initialOfficeList;
  if (showOfficeControl && vizData.paroleOffices) {
    initialOfficeList = vizData.paroleOffices
      .map((record) => {
        return {
          id: `${record.district}`,
          label: record.site_name,
        };
      })
      .sort((a, b) => ascending(a.label, b.label));

    initialOfficeList.unshift({ id: TOTAL_KEY, label: "All" });
  }
  const [officeList] = useState(initialOfficeList);
  const [officeId, setOfficeId] = useState();

  return (
    <DetailSectionContainer>
      <DetailSectionHeader>
        <DetailSectionTitle>{title}</DetailSectionTitle>
        <DetailSectionControls>
          {showMonthControl && monthList && (
            <MonthControl months={monthList} onChange={setMonth} />
          )}
          {
            // we need both a flag and data to enable office control
            showOfficeControl && officeList && (
              <OfficeControl
                offices={officeList}
                onChange={setOfficeId}
                value={officeId}
              />
            )
          }
          {showDimensionControl && <DimensionControl onChange={setDimension} />}
        </DetailSectionControls>
      </DetailSectionHeader>
      <DetailSectionDescription>{description}</DetailSectionDescription>
      <DetailSectionVizContainer>
        <VizComponent
          data={vizData}
          {...{ dimension, month, officeId, setMonthList }}
          onOfficeClick={setOfficeId}
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
  showOfficeControl: PropTypes.bool,
  VizComponent: PropTypes.func.isRequired,
  vizData: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};

DetailSection.defaultProps = {
  showDimensionControl: false,
  showMonthControl: false,
  showOfficeControl: false,
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
