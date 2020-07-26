import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import ndGeography from "../assets/maps/us_nd_program_regions.json";
import { DEFAULT_TENANT, TENANTS } from "../constants";
import ClickableRegionMap from "../clickable-region-map";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const ProgramParticipants = styled.text`
  fill: ${(props) => props.theme.colors.programParticipation};
  font: ${(props) => props.theme.fonts.displayMedium};
  font-size: ${(props) => props.scale * 32}px;
  text-anchor: middle;
`;

export default function StateProgramMap({ data, width, scale }) {
  // eslint-disable-next-line react/prop-types
  const RegionLabel = ({ topologyObjectId }) => {
    const programRegion = data.find(
      (record) => record.region_id === topologyObjectId
    );
    return (
      <ProgramParticipants scale={scale}>
        {programRegion.participation_count}
      </ProgramParticipants>
    );
  };

  return (
    <ClickableRegionMap
      aspectRatio={ASPECT_RATIO}
      LabelComponent={RegionLabel}
      topology={ndGeography}
      width={width}
    />
  );
}

StateProgramMap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      region_id: PropTypes.string.isRequired,
      participation_count: PropTypes.string.isRequired,
    })
  ).isRequired,
  scale: PropTypes.number.isRequired,
  width: PropTypes.number,
};

StateProgramMap.defaultProps = {
  width: 0,
};
