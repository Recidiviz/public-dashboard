import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import styled from "styled-components";
import ndGeography from "../assets/maps/us_nd.json";

const ND_CENTER_LAT = 47.3;
const ND_CENTER_LONG = -100.5;

const StateMapContainer = styled.div`
  height: 300px;
  width: 500px;
`;

export default function StateMap() {
  return (
    <StateMapContainer>
      <ComposableMap
        projection="geoAlbers"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup center={[ND_CENTER_LONG, ND_CENTER_LAT]} zoom={8.2}>
          <Geographies geography={ndGeography}>
            {({ geographies, projection }) => {
              return geographies.map((geography) => (
                <Geography
                  key={geography.properties.NAME}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: "#D6E3E2",
                      stroke: "#FFF",
                      strokeWidth: 0.2,
                      outline: "none",
                    },
                    hover: {
                      fill: "#D6E3E2",
                      stroke: "#FFF",
                      strokeWidth: 0.2,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#D6E3E2",
                      stroke: "#FFF",
                      strokeWidth: 0.2,
                      outline: "none",
                    },
                  }}
                />
              ));
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </StateMapContainer>
  );
}
