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
import { THEME, TOTAL_KEY } from "../constants";

const MAX_MARKER_RADIUS = 19;

const LocationMarker = styled.circle`
  cursor: pointer;
  fill: ${(props) =>
    props.selected
      ? props.theme.mapMarkers.hover.fill
      : props.theme.mapMarkers.default.fill};
  fill-opacity: ${(props) => props.theme.mapMarkers.default.fillOpacity};
  stroke: ${(props) => props.theme.mapMarkers.default.stroke};
  stroke-width: ${(props) => props.theme.mapMarkers.default.strokeWidth};
  transition: ${(props) => props.theme.mapMarkers.default.transition};

  &:hover {
    fill: ${(props) => props.theme.mapMarkers.hover.fill};
  }

  &:active {
    fill: ${(props) => props.theme.mapMarkers.pressed.fill};
  }
`;

export default function ClickableMarkerMap({
  aspectRatio,
  topology,
  data,
  currentLocation,
  onLocationClick,
  width,
}) {
  const maxValue = Math.max(...data.map(({ value }) => value));

  // using sqrt to linear-scale by circle area, not radius
  const markerRadiusScale = scaleSqrt()
    .domain([0, maxValue])
    .range([0, MAX_MARKER_RADIUS]);

  const handleLocationClick = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    onLocationClick(record.location);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // clear the current location selection
    onLocationClick(TOTAL_KEY);
  };

  const projection = geoAlbers().fitExtent(
    [
      [0, 0],
      [width, width / aspectRatio],
    ],
    mesh(topology)
  );

  return (
    <ComposableMap
      projection={projection}
      width={width}
      height={width / aspectRatio}
      style={{
        height: "auto",
        overflow: "visible",
        width: "100%",
      }}
    >
      <Geographies geography={topology}>
        {({ geographies }) => {
          return geographies.map((geography) => (
            <Geography
              key={geography.properties.NAME}
              geography={geography}
              onClick={handleResetClick}
              {...THEME.maps.default}
            />
          ));
        }}
      </Geographies>
      {data.map((record) => (
        <Marker key={record.location} coordinates={[record.long, record.lat]}>
          <LocationMarker
            onClick={(e) => handleLocationClick(e, record)}
            r={markerRadiusScale(record.value)}
            selected={record.location === currentLocation}
          />
        </Marker>
      ))}
    </ComposableMap>
  );
}

export const baseClickableMarkerMapPropTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  currentLocation: PropTypes.string,
  onLocationClick: PropTypes.func.isRequired,
  width: PropTypes.number,
};

ClickableMarkerMap.propTypes = {
  ...baseClickableMarkerMapPropTypes,
  aspectRatio: PropTypes.number.isRequired,
  topology: PropTypes.objectOf(PropTypes.any).isRequired,
};

ClickableMarkerMap.defaultProps = {
  // Our linter can't quite figure out that the following properties are
  // actually defined in baseClickableMarkerMapPropTypes and then pulled
  // into the component's actual propTypes definition.
  // eslint-disable-next-line react/default-props-match-prop-types
  currentLocation: undefined,
  // eslint-disable-next-line react/default-props-match-prop-types
  width: 0,
};
