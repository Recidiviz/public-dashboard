import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components/macro";
import ndGeography from "../assets/maps/us_nd_program_regions.json";
import { DEFAULT_TENANT, TENANTS } from "../constants";
import StateMap from "../state-map";
import { formatAsNumber } from "../utils";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const ProgramParticipants = styled.text`
  fill: ${(props) => props.theme.colors.programParticipation};
  font: ${(props) => props.theme.fonts.displayMedium};
  font-size: ${(props) => props.scale * 32}px;
  letter-spacing: -0.09em;
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
        {formatAsNumber(programRegion.participation_count)}
      </ProgramParticipants>
    );
  };

  return (
    <StateMap
      aspectRatio={ASPECT_RATIO}
      LabelComponent={RegionLabel}
      stateTopology={ndGeography}
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
