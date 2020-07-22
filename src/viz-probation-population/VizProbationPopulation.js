import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import judicialDistrictsTopology from "../assets/maps/us_nd_judicial_districts.json";
import { DEFAULT_TENANT, TENANTS, TOTAL_KEY } from "../constants";
import PopulationViz from "../population-viz";
import StateMap from "../state-map";
import { recordIsTotal } from "../utils";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const ParticipantCount = styled.text`
  dominant-baseline: middle;
  fill: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.active
      ? props.theme.maps.default.fill
      : props.hover
      ? props.theme.colors.highlight
      : props.theme.colors.programParticipation};
  font: ${(props) => props.theme.fonts.displayMedium};
  font-size: 20px;
  pointer-events: none;
  text-anchor: middle;
`;

function ProbationMap({ currentLocation, data, onLocationClick, width }) {
  // eslint-disable-next-line react/prop-types
  const DistrictLabel = ({ hover, locationId, objectId }) => {
    const districtRecord = data.find((record) => record.district === objectId);
    return districtRecord ? (
      <ParticipantCount
        active={locationId === districtRecord.district}
        hover={hover}
      >
        {districtRecord.value}
      </ParticipantCount>
    ) : null;
  };

  return (
    <StateMap
      aspectRatio={ASPECT_RATIO}
      LabelComponent={DistrictLabel}
      locationId={currentLocation}
      onRegionClick={onLocationClick}
      stateTopology={judicialDistrictsTopology}
      width={width}
    />
  );
}

ProbationMap.propTypes = {
  currentLocation: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  onLocationClick: PropTypes.func.isRequired,
  width: PropTypes.number,
};

ProbationMap.defaultProps = {
  width: 0,
};

export default function VizProbationPopulation(props) {
  const {
    data: { populationDemographics, locations },
    locationId,
    onLocationClick,
  } = props;

  const judicialDistrictTotals = populationDemographics
    .filter(recordIsTotal)
    .map((record) => {
      const judicialDistrictData = [...locations, { id: TOTAL_KEY }].find(
        // these are stored as both strings and numbers;
        // doing an extra typecast here just to be safe
        (loc) => `${loc.id}` === `${record.district}`
      );
      if (judicialDistrictData) {
        return {
          district: `${record.district}`,
          value: Number(record.total_supervision_count),
        };
      }
      return null;
    })
    // drop any nulls from the previous step
    .filter((record) => record);

  return (
    <PopulationViz
      {...props}
      MapComponent={ProbationMap}
      mapComponentProps={{
        data: judicialDistrictTotals,
        currentLocation: locationId,
        onLocationClick,
      }}
      mapLabel="Judicial districts in North Dakota"
      locationAccessorFn={(record) => record.district}
      populationAccessorFn={(record) => Number(record.total_supervision_count)}
      totalPopulationLabel="People on probation"
    />
  );
}

VizProbationPopulation.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  locationId: PropTypes.string,
  onLocationClick: PropTypes.func.isRequired,
};

VizProbationPopulation.defaultProps = {
  locationId: undefined,
};
