import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { TOTAL_KEY } from "../constants";
import { DimensionControl, MonthControl, DistrictControl } from "../controls";

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

const DetailSectionVizContainer = styled.div`
  margin-bottom: 50px;
  margin-top: 30px;
`;

function DetailSection({
  title,
  description,
  showDimensionControl,
  showDistrictControl,
  showMonthControl,
  VizComponent,
  vizData,
}) {
  const [dimension, setDimension] = useState();
  const [month, setMonth] = useState();

  // a viz component that wants to use months will be responsible
  // for parsing its data and updating this value
  const [monthList, setMonthList] = useState();

  let initialDistrictList;
  if (showDistrictControl && vizData.districtOffices) {
    initialDistrictList = vizData.districtOffices.map(
      ({ district }) => `${district}`
    );
    initialDistrictList.unshift(TOTAL_KEY);
  }
  const [districtList] = useState(initialDistrictList);
  const [districtId, setDistrictId] = useState();

  return (
    <DetailSectionContainer>
      <DetailSectionHeader>
        <DetailSectionTitle>{title}</DetailSectionTitle>
        <DetailSectionControls>
          {showMonthControl && monthList && (
            <MonthControl months={monthList} onChange={setMonth} />
          )}
          {
            // we need both a flag and data to enable district control
            showDistrictControl && districtList && (
              <DistrictControl
                districts={districtList}
                onChange={setDistrictId}
                value={districtId}
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
          {...{ dimension, month, districtId, setMonthList }}
          onDistrictClick={setDistrictId}
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
  showDistrictControl: PropTypes.bool,
  VizComponent: PropTypes.func.isRequired,
  vizData: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};

DetailSection.defaultProps = {
  showDimensionControl: false,
  showMonthControl: false,
  showDistrictControl: false,
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
