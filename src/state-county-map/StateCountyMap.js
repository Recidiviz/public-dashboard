import { descending } from "d3-array";
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
import AspectRatioWrapper from "../aspect-ratio-wrapper";
import ndGeography from "../assets/maps/us_nd.json";
import { DEFAULT_TENANT, TENANTS, TOTAL_KEY } from "../constants";
import { hoverColor } from "../utils";

const MAX_MARKER_RADIUS = 19;

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const StateCountyMapContainer = styled.div`
  margin-bottom: 20px;

  .rsm-geography {
    fill: ${(props) => props.theme.colors.map.fill};
    outline: none;
    stroke: ${(props) => props.theme.colors.map.stroke};
    stroke-width: 1.5px;
  }
`;

const LocationMarker = styled.circle`
  cursor: pointer;
  fill: ${(props) =>
    props.selected
      ? props.theme.colors.highlight
      : props.theme.colors.mapMarkers.fill};
  fill-opacity: 0.8;
  stroke: ${(props) => props.theme.colors.mapMarkers.stroke};
  stroke-width: 1.5px;
  transition: fill ${(props) => props.theme.transition.defaultTimeSettings};

  &:hover {
    fill: ${(props) =>
      hoverColor(
        props.selected
          ? props.theme.colors.highlight
          : props.theme.colors.mapMarkers.fill
      )};
  }

  &:active {
    fill: ${(props) => props.theme.colors.highlight};
  }
`;

export default function StateCountyMap({
  currentLocation,
  data,
  onLocationClick,
  width,
}) {
  const maxValue = Math.max(...data.map(({ value }) => value));
  // By sorting the data in descending order, the markers will appear
  // stacked on the map such that the markers with the largest values
  // are on the "bottom" and the markers with the smallest values are
  // on the "top".  This prevents the smaller markers from getting
  // buried underneathe of the larger markers.  Technically this makes
  // all of the markers clickable, but the experience is still lacking.
  const sortedData = data.sort((a, b) => descending(a.value, b.value));

  // using sqrt to linear-scale by circle area, not radius
  const markerRadiusScale = scaleSqrt()
    .domain([0, maxValue])
    .range([0, MAX_MARKER_RADIUS]);

  const handleLocationClick = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    onLocationClick(record.location);
  };

  const handleCountyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // clear the current location selection
    onLocationClick(TOTAL_KEY);
  };

  const ND_PROJECTION = geoAlbers().fitExtent(
    [
      [0, 0],
      [width, width / ASPECT_RATIO],
    ],
    mesh(ndGeography)
  );

  return (
    <StateCountyMapContainer>
      <AspectRatioWrapper
        // this component wants ratio of height to width; we have the opposite
        aspectRatio={1 / ASPECT_RATIO}
        width={width}
      >
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
              return geographies.map((geography) => (
                <Geography
                  key={geography.properties.NAME}
                  geography={geography}
                  onClick={handleCountyClick}
                  tabIndex={-1}
                />
              ));
            }}
          </Geographies>
          {sortedData.map((record) => (
            <Marker
              key={record.location}
              coordinates={[record.long, record.lat]}
            >
              <LocationMarker
                onClick={(e) => handleLocationClick(e, record)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLocationClick(e, record);
                  }
                }}
                onMouseDown={(e) => {
                  // stop clicks from moving focus to this element
                  e.preventDefault();
                }}
                r={markerRadiusScale(record.value)}
                selected={record.location === currentLocation}
                tabIndex={0}
              />
            </Marker>
          ))}
        </ComposableMap>
      </AspectRatioWrapper>
    </StateCountyMapContainer>
  );
}

StateCountyMap.propTypes = {
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

StateCountyMap.defaultProps = {
  currentLocation: undefined,
  width: 0,
};
