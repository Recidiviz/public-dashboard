import { geoAlbers, geoCentroid } from "d3-geo";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import styled from "styled-components";
import { mesh } from "topojson";
import { THEME } from "../theme";

const GeoRegion = styled(Geography)`
  ${(props) =>
    props.highlighted
      ? // !important to override the inline styles from map library
        `fill: ${props.theme.maps.pressed.fill} !important;`
      : ""}
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: fill ${(props) => props.theme.transition.defaultTimeSettings};
`;

const RegionMarker = styled(Marker)`
  text {
    transition: fill ${(props) => props.theme.transition.defaultTimeSettings};
  }
`;

export default function StateMap({
  aspectRatio,
  LabelComponent,
  locationId,
  onRegionClick,
  stateTopology,
  width,
}) {
  const stateProjection = geoAlbers().fitExtent(
    [
      [0, 0],
      [width, width / aspectRatio],
    ],
    mesh(stateTopology)
  );

  const [hoveredLocationId, setHoveredLocationId] = useState();

  const clickable = !!onRegionClick;
  const hoverable = clickable;

  // don't change style on hover and click if there aren't actually
  // any interactions that are possible
  const mapStyles = {
    default: THEME.maps.default,
    hover: THEME.maps.default,
    pressed: THEME.maps.default,
  };
  if (clickable) mapStyles.pressed = THEME.maps.pressed;
  if (hoverable) mapStyles.hover = THEME.maps.hover;

  return (
    <ComposableMap
      projection={stateProjection}
      width={width}
      height={width / aspectRatio}
      style={{
        height: "auto",
        overflow: "visible",
        width: "100%",
      }}
    >
      <Geographies geography={stateTopology}>
        {({ geographies }) => {
          return geographies.map((geography) => {
            const centroid = geoCentroid(geography);

            return (
              <React.Fragment key={geography.id}>
                <GeoRegion
                  // this 1:0 business is a workaround because React objects to arbitrary
                  // boolean attributes (these get passed all the way down to the DOM
                  // by styled-components and react-simple-maps)
                  clickable={clickable ? 1 : 0}
                  highlighted={locationId === geography.id ? 1 : 0}
                  key={`region_{geography.id}`}
                  geography={geography}
                  onBlur={() => setHoveredLocationId()}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onRegionClick) onRegionClick(geography.id);
                  }}
                  onFocus={() => setHoveredLocationId(geography.id)}
                  onMouseOut={() => setHoveredLocationId()}
                  onMouseOver={() => setHoveredLocationId(geography.id)}
                  style={mapStyles}
                />
                {LabelComponent && (
                  <RegionMarker
                    key={`marker_{geography.id}`}
                    coordinates={centroid}
                  >
                    <LabelComponent
                      hover={hoveredLocationId === geography.id}
                      locationId={locationId}
                      topologyObjectId={geography.id}
                    />
                  </RegionMarker>
                )}
              </React.Fragment>
            );
          });
        }}
      </Geographies>
    </ComposableMap>
  );
}

StateMap.propTypes = {
  aspectRatio: PropTypes.number.isRequired,
  LabelComponent: PropTypes.func,
  locationId: PropTypes.string,
  onRegionClick: PropTypes.func,
  stateTopology: PropTypes.objectOf(PropTypes.any).isRequired,
  width: PropTypes.number,
};

StateMap.defaultProps = {
  LabelComponent: undefined,
  locationId: undefined,
  onRegionClick: undefined,
  width: 0,
};
