import { geoAlbers, geoCentroid } from "d3-geo";
import PropTypes from "prop-types";
import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import styled from "styled-components";
import { mesh } from "topojson";
import ndGeography from "../assets/maps/us_nd_program_regions.json";
import { DEFAULT_TENANT, TENANTS, THEME } from "../constants";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const ProgramParticipants = styled.text`
  fill: ${(props) => props.theme.colors.programParticipation};
  font: ${(props) => props.theme.fonts.displayMedium};
  font-size: ${(props) => props.scale * 32}px;
  text-anchor: middle;
`;

export default function StateProgramMap({ data, width, scale }) {
  const ND_PROJECTION = geoAlbers().fitExtent(
    [
      [0, 0],
      [width, width / ASPECT_RATIO],
    ],
    mesh(ndGeography)
  );

  return (
    <ComposableMap
      projection={ND_PROJECTION}
      width={width}
      height={width / ASPECT_RATIO}
      style={{
        height: "auto",
        overflow: "visible",
        width: "100%",
      }}
    >
      <Geographies geography={ndGeography}>
        {({ geographies }) => {
          return geographies.map((geography) => {
            const centroid = geoCentroid(geography);
            const programRegion = data.find(
              (record) => record.region_id === geography.id
            );

            return (
              <React.Fragment key={geography.id}>
                <Geography
                  key={`region_{geography.id}`}
                  geography={geography}
                  {...THEME.maps.default}
                />
                <Marker key={`marker_{geography.id}`} coordinates={centroid}>
                  <ProgramParticipants scale={scale}>
                    {programRegion.participation_count}
                  </ProgramParticipants>
                </Marker>
              </React.Fragment>
            );
          });
        }}
      </Geographies>
    </ComposableMap>
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
