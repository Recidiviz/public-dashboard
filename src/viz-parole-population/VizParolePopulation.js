import PropTypes from "prop-types";
import React from "react";
import { group, sum } from "d3-array";
import styled from "styled-components";
import {
  AGES,
  DATA_KEY_TRANSLATIONS,
  DIMENSIONS,
  DIMENSION_KEYS,
  GENDERS,
  RACES,
  TOTAL_KEY,
  THEME,
} from "../constants";
import { formatAsNumber } from "../utils";
import ProportionalBar from "../proportional-bar";
import StateDistrictMap from "../state-district-map";
import Statistic from "../statistic";

const DIMENSION_MAPPINGS = [
  { key: DIMENSION_KEYS.gender, values: GENDERS },
  { key: DIMENSION_KEYS.age, values: AGES },
  { key: DIMENSION_KEYS.race, values: RACES },
];

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
  flex: 0 1 auto;
`;

const MapWrapper = styled.figure`
  margin: 0;
`;
const MapCaption = styled.figcaption`
  color: ${(props) => props.theme.colors.body};
  font: ${(props) => props.theme.fonts.body};
`;

const ParoleDemographicsWrapper = styled.figure`
  height: 64px;
  width: 376px;
`;

const ParoleDistrictCountWrapper = styled.div`
  text-align: right;
`;

function VizParaoleDistrictCount({ data, currentDistrict }) {
  if (!currentDistrict) return null;

  const districtData = data[currentDistrict];

  // Each individual district has an "aggregate record" which is defined
  // by each of its demographic entries being set to "ALL".  Unfortunately,
  // when no district is selected, there is no "aggregate record" so to get
  // the population total, we sum the total of the population across a
  // single dimension, in this case GENDER.
  const genderKeys =
    currentDistrict === TOTAL_KEY ? Object.keys(GENDERS) : [TOTAL_KEY];

  const count = sum(
    districtData
      .filter(
        (record) =>
          record.race_or_ethnicity === TOTAL_KEY &&
          genderKeys.includes(record.gender) &&
          record.age_bucket === TOTAL_KEY
      )
      .map((record) => +record.total_supervision_count)
  );

  return (
    <ParoleDistrictCountWrapper>
      <Statistic value={formatAsNumber(count)} label="People on parole" />
    </ParoleDistrictCountWrapper>
  );
}

VizParaoleDistrictCount.propTypes = {
  data: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  currentDistrict: PropTypes.string,
};

VizParaoleDistrictCount.defaultProps = {
  currentDistrict: undefined,
};

function VizParoleDemographicBarChart({ data, currentDistrict, dimension }) {
  if (!currentDistrict) return null;

  const districtData = data[currentDistrict];
  const dimensionKey = dimension.key;
  const dimensionValues = dimension.values;

  const dimensionData = Object.entries(dimensionValues)
    .map(([demographic, label]) => {
      return districtData
        .filter(
          (record) =>
            // i.e. record["race_or_ethnicity"] === "OTHER"
            record[DATA_KEY_TRANSLATIONS[dimensionKey]] === demographic
        )
        .map((record) => ({
          // i.e. BAR_CHART_VISUALIZATION_COLORS["gender"]["FEMALE"]
          color: BAR_CHART_VISUALIZATION_COLORS[dimensionKey][demographic],
          label,
          value: +record.total_supervision_count,
        }))
        .shift();
    })
    .filter((record) => record);

  return (
    <ParoleDemographicsWrapper>
      <ProportionalBar data={dimensionData} title={DIMENSIONS[dimension.key]} />
    </ParoleDemographicsWrapper>
  );
}

VizParoleDemographicBarChart.propTypes = {
  data: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  currentDistrict: PropTypes.string,
  dimension: PropTypes.shape({
    key: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
  }).isRequired,
};

VizParoleDemographicBarChart.defaultProps = {
  currentDistrict: undefined,
};

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
        <VizParaoleDistrictCount
          data={populationDemographicsByDistrict}
          currentDistrict={districtId}
        />
        {DIMENSION_MAPPINGS.map((dimension) => (
          <VizParoleDemographicBarChart
            key={dimension.key}
            data={populationDemographicsByDistrict}
            currentDistrict={districtId}
            dimension={dimension}
          />
        ))}
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
