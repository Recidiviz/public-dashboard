import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import judicialDistrictsTopology from "../assets/maps/us_nd_judicial_districts.json";
import {
  DEFAULT_TENANT,
  OTHER_LABEL,
  TENANTS,
  TOTAL_KEY,
  OTHER,
} from "../constants";
import PopulationViz from "../population-viz";
import StateMap from "../state-map";
import { recordIsTotal } from "../utils";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const SentenceMapWrapper = styled.div`
  align-items: center;
  display: flex;
`;

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

const OtherWrapper = styled.button`
  background: none;
  border: 0;
  color: ${(props) =>
    props.active ? props.theme.colors.highlight : props.theme.colors.heading};
  cursor: pointer;
  padding: 16px;
  margin-left: -16px;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.colors.highlight};
  }
`;

const OtherLabel = styled.div`
  font: ${(props) => props.theme.fonts.body};
`;

const findDistrictRecord = (district) => (record) =>
  record.district === district;

function SentenceMap({ currentLocation, data, onLocationClick, width }) {
  // eslint-disable-next-line react/prop-types
  const DistrictLabel = ({ hover, locationId, topologyObjectId }) => {
    const districtRecord = data.find(findDistrictRecord(topologyObjectId));
    return districtRecord ? (
      <ParticipantCount
        active={locationId === districtRecord.district}
        hover={hover}
      >
        {districtRecord.value}
      </ParticipantCount>
    ) : null;
  };

  const otherRecord = data.find(findDistrictRecord(OTHER));

  return (
    <SentenceMapWrapper>
      <StateMap
        aspectRatio={ASPECT_RATIO}
        LabelComponent={DistrictLabel}
        locationId={currentLocation}
        onRegionClick={onLocationClick}
        stateTopology={judicialDistrictsTopology}
        width={width}
      />
      {otherRecord && (
        <OtherWrapper
          active={currentLocation === OTHER}
          onClick={(e) => {
            e.preventDefault();
            onLocationClick(OTHER);
          }}
        >
          <ParticipantCount as="div">{otherRecord.value}</ParticipantCount>
          <OtherLabel>{OTHER_LABEL}</OtherLabel>
        </OtherWrapper>
      )}
    </SentenceMapWrapper>
  );
}

SentenceMap.propTypes = {
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

SentenceMap.defaultProps = {
  width: 0,
};

export default function VizSentencePopulation(props) {
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
          value:
            Number(record.incarceration_count) + Number(record.probation_count),
        };
      }
      return null;
    })
    // drop any nulls from the previous step
    .filter((record) => record);

  return (
    <PopulationViz
      {...props}
      MapComponent={SentenceMap}
      mapComponentProps={{
        data: judicialDistrictTotals,
        currentLocation: locationId,
        onLocationClick,
      }}
      mapLabel="Judicial districts in North Dakota"
      locationAccessorFn={(record) => record.district}
      populationAccessorFn={(record) =>
        Number(record.incarceration_count) + Number(record.probation_count)
      }
      totalPopulationLabel="People sentenced"
    />
  );
}

VizSentencePopulation.propTypes = {
  data: PropTypes.shape({
    populationDemographics: PropTypes.arrayOf(PropTypes.object).isRequired,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  locationId: PropTypes.string,
  onLocationClick: PropTypes.func.isRequired,
};

VizSentencePopulation.defaultProps = {
  locationId: undefined,
};
