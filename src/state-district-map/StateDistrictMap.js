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
import { DEFAULT_TENANT, TENANTS, THEME, TOTAL_KEY } from "../constants";

const MAX_MARKER_RADIUS = 19;

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const StateDistrictMapContainer = styled.div`
  margin-bottom: 20px;
`;

const DistrictMarker = styled.circle`
  cursor: pointer;

  fill: ${(props) =>
    props.selected
      ? props.theme.mapMarkers.hover.fill
      : props.theme.mapMarkers.default.fill};
  fill-opacity: ${(props) => props.theme.mapMarkers.default.fillOpacity};
  stroke: ${(props) => props.theme.mapMarkers.default.stroke};
  stroke-width: ${(props) => props.theme.mapMarkers.default.strokeWidth};

  &:hover {
    fill: ${(props) => props.theme.mapMarkers.hover.fill};
  }

  &:active {
    fill: ${(props) => props.theme.mapMarkers.pressed.fill};
  }
`;

export default function StateDistrictMap({
  currentDistrict,
  data,
  onDistrictClick,
  width,
}) {
  const maxValue = Math.max(...data.map(({ value }) => value));

  // using sqrt to linear-scale by circle area, not radius
  const markerRadiusScale = scaleSqrt()
    .domain([0, maxValue])
    .range([0, MAX_MARKER_RADIUS]);

  const handleDistrictClick = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    onDistrictClick(record.district);
  };

  const handleCountyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // clear the current district selection
    onDistrictClick(TOTAL_KEY);
  };

  const ND_PROJECTION = geoAlbers().fitExtent(
    [
      [0, 0],
      [width, width / ASPECT_RATIO],
    ],
    mesh(ndGeography)
  );

  return (
    <StateDistrictMapContainer>
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
                {...THEME.maps.default}
              />
            ));
          }}
        </Geographies>
        {data.map((record) => (
          <Marker key={record.district} coordinates={[record.long, record.lat]}>
            <DistrictMarker
              onClick={(e) => handleDistrictClick(e, record)}
              r={markerRadiusScale(record.value)}
              selected={record.district === currentDistrict}
            />
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
  currentDistrict: PropTypes.string,
  onDistrictClick: PropTypes.func.isRequired,
  width: PropTypes.number,
};

StateDistrictMap.defaultProps = {
  currentDistrict: undefined,
  width: 0,
};
