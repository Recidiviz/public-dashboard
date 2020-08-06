import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import judicialDistrictsTopology from "../assets/maps/us_nd_judicial_districts.json";
import { DEFAULT_TENANT, OTHER_LABEL, TENANTS, OTHER } from "../constants";
import StateMap from "../state-map";
import { formatAsNumber } from "../utils";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const StateJudicialDistrictMapWrapper = styled.div`
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
  letter-spacing: -0.09em;
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
  transition: color ${(props) => props.theme.transition.defaultTimeSettings};

  &:hover {
    color: ${(props) => props.theme.colors.highlight};
  }
`;

const OtherLabel = styled.div`
  font-size: 12px;

  ${OtherWrapper}:hover & {
    color: ${(props) => props.theme.colors.highlight};
  }
`;

const findDistrictRecord = (district) => (record) =>
  record.district === district;

export default function StateJudicialDistrictMap({
  currentLocation,
  data,
  onLocationClick,
  width,
}) {
  // eslint-disable-next-line react/prop-types
  const DistrictLabel = ({ hover, locationId, topologyObjectId }) => {
    const districtRecord = data.find(findDistrictRecord(topologyObjectId));
    return districtRecord ? (
      <ParticipantCount
        active={locationId === districtRecord.district}
        hover={hover}
      >
        {formatAsNumber(districtRecord.value)}
      </ParticipantCount>
    ) : null;
  };

  const otherRecord = data.find(findDistrictRecord(OTHER));

  return (
    <StateJudicialDistrictMapWrapper>
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
          <ParticipantCount as="div">
            {formatAsNumber(otherRecord.value)}
          </ParticipantCount>
          <OtherLabel>{OTHER_LABEL}</OtherLabel>
        </OtherWrapper>
      )}
    </StateJudicialDistrictMapWrapper>
  );
}

StateJudicialDistrictMap.propTypes = {
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

StateJudicialDistrictMap.defaultProps = {
  width: 0,
};
