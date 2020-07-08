import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { TOTAL_KEY } from "../constants";
import StateDistrictMap from "../state-district-map";

const VizParolePopulationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const VizWrapper = styled.div`
  flex: 0 1 auto;
`;

const MapWrapper = styled.figure`
  margin: 0;
`;
const MapCaption = styled.figcaption`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

export default function VizParolePopulation({
  data: { populationDemographics, districtOffices },
  districtId,
  onDistrictClick,
}) {
  const districtTotals = populationDemographics
    .filter(
      (record) =>
        record.race_or_ethnicity === TOTAL_KEY &&
        record.gender === TOTAL_KEY &&
        record.age_bucket === TOTAL_KEY
    )
    .map((record) => {
      const districtData = districtOffices.find(
        // these are stored as both strings and numbers;
        // doing an extra typecast here just to be safe
        (office) => `${office.district}` === `${record.district}`
      );
      if (districtData) {
        return {
          district: `${record.district}`,
          lat: districtData.lat,
          long: districtData.long,
          value: +record.total_supervision_count,
        };
      }
      return null;
    })
    // drop any nulls from the previous step
    .filter((record) => record);
  return (
    <VizParolePopulationContainer>
      <VizWrapper>
        <MapWrapper>
          <StateDistrictMap
            data={districtTotals}
            currentDistrict={districtId}
            onDistrictClick={onDistrictClick}
          />
          <MapCaption>Parole districts in North Dakota</MapCaption>
        </MapWrapper>
      </VizWrapper>
    </VizParolePopulationContainer>
  );
}

VizParolePopulation.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    districtOffices: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  districtId: PropTypes.string,
  onDistrictClick: PropTypes.func.isRequired,
};

VizParolePopulation.defaultProps = {
  districtId: undefined,
};
