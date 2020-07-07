import { geoAlbers } from "d3-geo";
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import styled from "styled-components";
import { mesh } from "topojson";
import ndGeography from "../assets/maps/us_nd.json";
import { THEME } from "../constants";

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

const StateMapContainer = styled.div`
  height: ${ND_HEIGHT}px;
  margin-bottom: 20px;
  width: ${ND_WIDTH}px;
`;

export default function StateMap() {
  return (
    <StateMapContainer>
      <ComposableMap
        projection={ND_PROJECTION}
        width={ND_WIDTH}
        height={ND_HEIGHT}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={ndGeography}>
          {({ geographies, projection }) => {
            return geographies.map((geography) => (
              <Geography
                key={geography.properties.NAME}
                geography={geography}
                projection={projection}
                style={THEME.maps}
              />
            ));
          }}
        </Geographies>
      </ComposableMap>
    </StateMapContainer>
  );
}
