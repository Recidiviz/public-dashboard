import { geoAlbers } from "d3-geo";
import { scaleSqrt } from "d3-scale";
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
import ndGeography from "../assets/maps/us_nd.json";
import { THEME } from "../constants";

const MAX_MARKER_RADIUS = 19;

const ND_HEIGHT = 300;
const ND_WIDTH = 500;

// this projection will fit the entire map viewport to ND
const ND_PROJECTION = geoAlbers().fitExtent(
  [
    [0, 0],
    [ND_WIDTH, ND_HEIGHT],
  ],
  mesh(ndGeography)
);

const StateDistrictMapContainer = styled.div`
  height: ${ND_HEIGHT}px;
  margin-bottom: 20px;
  width: ${ND_WIDTH}px;
`;

const DistrictMarker = styled.circle`
  cursor: pointer;

  fill: ${(props) => props.theme.mapMarkers.default.fill};
  fill-opacity: ${(props) => props.theme.mapMarkers.default.fillOpacity};
  stroke: ${(props) => props.theme.mapMarkers.default.stroke};
  stroke-width: ${(props) => props.theme.mapMarkers.default.strokeWidth};

  &:hover,
  &.selected {
    fill: ${(props) => props.theme.mapMarkers.hover.fill};
  }

  &:active {
    fill: ${(props) => props.theme.mapMarkers.pressed.fill};
  }
`;

export default function StateDistrictMap({ data }) {
  const maxValue = Math.max(...data.map(({ value }) => value));

  // using sqrt to linear-scale by circle area, not radius
  const markerRadiusScale = scaleSqrt()
    .domain([0, maxValue])
    .range([0, MAX_MARKER_RADIUS]);

  return (
    <StateDistrictMapContainer>
      <ComposableMap
        projection={ND_PROJECTION}
        width={ND_WIDTH}
        height={ND_HEIGHT}
        style={{
          height: "100%",
          overflow: "visible",
          width: "100%",
        }}
      >
        <Geographies geography={ndGeography}>
          {({ geographies, projection }) => {
            return geographies.map((geography) => (
              <Geography
                key={geography.properties.NAME}
                geography={geography}
                projection={projection}
                {...THEME.maps.default}
              />
            ));
          }}
        </Geographies>
        {data.map((record) => (
          <Marker key={record.district} coordinates={[record.long, record.lat]}>
            <DistrictMarker r={markerRadiusScale(record.value)} />
          </Marker>
        ))}
      </ComposableMap>
    </StateDistrictMapContainer>
  );
}

StateDistrictMap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};
