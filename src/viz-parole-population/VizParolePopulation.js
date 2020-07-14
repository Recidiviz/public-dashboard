import PropTypes from "prop-types";
import React from "react";
import Measure from "react-measure";
import styled from "styled-components";
import StateDistrictMap from "../state-district-map";
import { recordIsTotal } from "../utils";

const VizParolePopulationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;
const VizWrapper = styled.div`
  flex: 1 1 auto;
  margin-bottom: 24px;
`;

const MAP_WIDTH = 500;

const MapWrapper = styled.figure`
  margin: 0;
  max-width: ${MAP_WIDTH}px;
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
    .filter(recordIsTotal)
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
        <Measure bounds>
          {({
            measureRef,
            contentRect: {
              bounds: { width },
            },
          }) => (
            <MapWrapper ref={measureRef}>
              <StateDistrictMap
                data={districtTotals}
                currentDistrict={districtId}
                onDistrictClick={onDistrictClick}
                width={width}
              />
              <MapCaption>Parole districts in North Dakota</MapCaption>
            </MapWrapper>
          )}
        </Measure>
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
