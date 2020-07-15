import PropTypes from "prop-types";
import React from "react";
import { group, sum } from "d3-array";
import styled from "styled-components";
import {
  DIMENSION_DATA_KEYS,
  DIMENSION_KEYS,
  DIMENSION_LABELS,
  DIMENSION_MAPPINGS,
  THEME,
} from "../constants";
import {
  formatAsNumber,
  formatDemographicValue,
  recordIsTotal,
} from "../utils";
import ProportionalBar from "../proportional-bar";
import StateDistrictMap from "../state-district-map";
import Statistic from "../statistic";

const BAR_CHART_VISUALIZATION_COLORS = {
  [DIMENSION_KEYS.gender]: THEME.colors.gender,
  [DIMENSION_KEYS.age]: THEME.colors.age,
  [DIMENSION_KEYS.race]: THEME.colors.race,
};

const VizParolePopulationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const VizWrapper = styled.div`
  flex: 0 1 49%;
`;

const MapWrapper = styled.figure`
  margin: 0;
`;

const MapCaption = styled.figcaption`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

const ParoleDemographicsWrapper = styled.div`
  height: 100%;
  margin: 0;
  padding-left: 56px;
  width: 100%;
`;

const ParoleDemographicsDistrictCountWrapper = styled.div`
  margin-bottom: 16px;
  text-align: right;
`;

const ParoleDemographicsBarChartWrapper = styled.div`
  height: 64px;
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.base + props.stackOrder};
`;

function ParoleDemographicsDistrictCount({ data }) {
  if (!data) return null;

  const count = sum(
    data.filter(recordIsTotal).map((record) => +record.total_supervision_count)
  );

  return (
    <ParoleDemographicsDistrictCountWrapper>
      <Statistic value={formatAsNumber(count)} label="People on parole" />
    </ParoleDemographicsDistrictCountWrapper>
  );
}

ParoleDemographicsDistrictCount.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

ParoleDemographicsDistrictCount.defaultProps = {
  data: undefined,
};

function ParoleDemographicBarChart({ data, dimension, stackOrder }) {
  if (!data) return null;

  const dimensionData = Array.from(DIMENSION_MAPPINGS.get(dimension))
    .map(([demographic]) => {
      return data
        .filter(
          (record) => record[DIMENSION_DATA_KEYS[dimension]] === demographic
        )
        .map((record) => ({
          color: BAR_CHART_VISUALIZATION_COLORS[dimension][demographic],
          label: formatDemographicValue(demographic, dimension),
          value: +record.total_supervision_count,
        }))
        .shift();
    })
    .filter((record) => record);

  return (
    <ParoleDemographicsBarChartWrapper stackOrder={stackOrder}>
      <ProportionalBar
        data={dimensionData}
        title={DIMENSION_LABELS[dimension]}
      />
    </ParoleDemographicsBarChartWrapper>
  );
}

ParoleDemographicBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  dimension: PropTypes.string.isRequired,
  stackOrder: PropTypes.number.isRequired,
};

ParoleDemographicBarChart.defaultProps = {
  data: undefined,
};

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

  const populationDemographicsByDistrict = Object.fromEntries(
    group(populationDemographics, (record) => record.district)
  );

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
      <VizWrapper>
        <ParoleDemographicsWrapper>
          <ParoleDemographicsDistrictCount
            data={populationDemographicsByDistrict[districtId]}
          />
          {Array.from(DIMENSION_MAPPINGS, ([dimension], index) => (
            <ParoleDemographicBarChart
              key={dimension}
              data={populationDemographicsByDistrict[districtId]}
              dimension={dimension}
              stackOrder={DIMENSION_MAPPINGS.size - index}
            />
          ))}
        </ParoleDemographicsWrapper>
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
