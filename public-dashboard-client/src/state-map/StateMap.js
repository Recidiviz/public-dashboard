import classNames from "classnames";
import { geoAlbers, geoCentroid } from "d3-geo";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import styled from "styled-components/macro";
import { mesh } from "topojson";
import AspectRatioWrapper from "../aspect-ratio-wrapper";
import { hoverColor } from "../utils";

const GeoRegion = styled(Geography)`
  fill: ${(props) => props.theme.colors.map.fill};
  stroke: ${(props) => props.theme.colors.map.stroke};
  stroke-width: 1.5px;
  transition: fill ${(props) => props.theme.transition.defaultTimeSettings};

  &.clickable {
    cursor: pointer;
  }

  &.hoverable {
    &:hover,
    &:focus {
      fill: ${(props) => props.theme.colors.map.fillHover};
    }
  }

  &.highlighted {
    fill: ${(props) => props.theme.colors.map.fillActive};

    &:hover,
    &:focus {
      fill: ${(props) => hoverColor(props.theme.colors.map.fillActive)};
    }
  }
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

  return (
    <AspectRatioWrapper
      // this component wants ratio of height to width; we have the opposite
      aspectRatio={1 / aspectRatio}
      width={width}
    >
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
                    className={classNames({
                      clickable,
                      hoverable,
                      highlighted: locationId === geography.id,
                    })}
                    key="region_{geography.id}"
                    geography={geography}
                    onBlur={() => setHoveredLocationId()}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onRegionClick) onRegionClick(geography.id);
                    }}
                    onFocus={() => setHoveredLocationId(geography.id)}
                    onKeyPress={(e) => {
                      if (onRegionClick) {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRegionClick(geography.id);
                        }
                      }
                    }}
                    onMouseDown={(e) => {
                      // stop clicks from moving focus to this element
                      e.preventDefault();
                    }}
                    onMouseOut={() => setHoveredLocationId()}
                    onMouseOver={() => setHoveredLocationId(geography.id)}
                    tabIndex={clickable ? 0 : -1}
                  />
                  {LabelComponent && (
                    <RegionMarker
                      key="marker_{geography.id}"
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
    </AspectRatioWrapper>
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
