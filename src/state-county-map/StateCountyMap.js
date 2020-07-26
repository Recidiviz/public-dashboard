import React from "react";
import styled from "styled-components";
import ndGeography from "../assets/maps/us_nd.json";
import { DEFAULT_TENANT, TENANTS } from "../constants";
import ClickableMarkerMap, {
  baseClickableMarkerMapPropTypes,
} from "../clickable-marker-map";

const ASPECT_RATIO = TENANTS[DEFAULT_TENANT].aspectRatio;

const StateCountyMapWrapper = styled.div`
  margin-bottom: 20px;
`;

export default function StateCountyMap({
  currentLocation,
  data,
  onLocationClick,
  width,
}) {
  return (
    <StateCountyMapWrapper>
      <ClickableMarkerMap
        aspectRatio={ASPECT_RATIO}
        topology={ndGeography}
        data={data}
        currentLocation={currentLocation}
        onLocationClick={onLocationClick}
        width={width}
      />
    </StateCountyMapWrapper>
  );
}

StateCountyMap.propTypes = baseClickableMarkerMapPropTypes;
