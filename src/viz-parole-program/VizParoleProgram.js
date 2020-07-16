import React from "react";
import PropTypes from "prop-types";
import Measure from "react-measure";
import styled from "styled-components";

import StateProgramMap from "../state-program-map";

const MAX_WIDTH = 784;

const MapWrapper = styled.figure`
  margin: 0 auto;
  max-width: ${MAX_WIDTH}px;
`;

export default function VizParoleProgram({
  data: { paroleProgramParticipationByRegion },
}) {
  return (
    <Measure bounds>
      {({
        measureRef,
        contentRect: {
          bounds: { width },
        },
      }) => (
        <MapWrapper ref={measureRef}>
          <StateProgramMap
            data={paroleProgramParticipationByRegion}
            scale={(width || 0) / MAX_WIDTH}
            width={width}
          />
        </MapWrapper>
      )}
    </Measure>
  );
}

VizParoleProgram.propTypes = {
  data: PropTypes.shape({
    paroleProgramParticipationByRegion: PropTypes.arrayOf(
      PropTypes.shape({
        region_id: PropTypes.string.isRequired,
        participation_count: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
