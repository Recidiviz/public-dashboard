// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { geoAlbers, geoCentroid } from "d3-geo";
import { rem } from "polished";
import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  GeographyProps,
} from "react-simple-maps";
import { Spring } from "react-spring/renderprops.cjs";
import styled from "styled-components/macro";
import { mesh } from "topojson";
import type { Topology } from "topojson-specification";
import { ValuesType } from "utility-types";
import { LocalityDataMapping } from "../contentModels/types";
import MeasureWidth from "../MeasureWidth";
import { colors } from "../UiLibrary";

const RatioContainerOuter = styled.div`
  position: relative;
  height: 0;
`;

const RatioContainerInner = styled.div({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

/**
 * Implements a version of the Aspect Ratio Box technique described here:
 * https://github.com/zcreativelabs/react-simple-maps/issues/37#issuecomment-349435145
 * but with explicit width (our flex layout prefers it or elements may collapse).
 * This is needed to size the map SVG properly in IE 11 and some mobile devices.
 */
const RatioContainer: React.FC<{ width: number; aspectRatio: number }> = ({
  aspectRatio,
  children,
  width,
}) => {
  return (
    <RatioContainerOuter
      // this calculation requires the inverse aspect ratio; the ratio of height to width
      style={{ paddingBottom: `calc(${1 / aspectRatio} * 100%)`, width }}
    >
      <RatioContainerInner>{children}</RatioContainerInner>
    </RatioContainerOuter>
  );
};

const Wrapper = styled.div``;

type MapProps = {
  aspectRatio: number;
  localityData: LocalityDataMapping;
  topology: Topology;
};

/**
 * Given a topojson topology and a mapping of topological object IDs to values,
 * draws a map and labels the topological objects accordingly.
 */
export default function TopologicalMap({
  aspectRatio,
  localityData,
  topology,
}: MapProps): React.ReactElement {
  return (
    <MeasureWidth>
      {({ measureRef, width }) => {
        const stateProjection = geoAlbers().fitExtent(
          [
            [0, 0],
            [width, width / aspectRatio],
          ],
          mesh(topology)
        );

        return (
          <Wrapper ref={measureRef}>
            <RatioContainer {...{ aspectRatio, width }}>
              <ComposableMap
                // @ts-expect-error seems to be an error in the type definitions
                // https://github.com/zcreativelabs/react-simple-maps/issues/98#issuecomment-686525887
                projection={stateProjection}
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
                    return geographies.map((geography) => {
                      return (
                        <Region
                          key={geography.id}
                          geography={geography}
                          data={localityData[geography.id]}
                        />
                      );
                    });
                  }}
                </Geographies>
              </ComposableMap>
            </RatioContainer>
          </Wrapper>
        );
      }}
    </MeasureWidth>
  );
}

const RegionGroup = styled.g`
  &:focus {
    outline: none;
  }
`;

const RegionGeography = styled(Geography)`
  &:focus {
    outline: none;
  }
`;

const RegionMarker = styled(Marker)``;

const RegionLabel = styled.text`
  font-size: ${rem(18)};
  font-weight: 600;
  letter-spacing: -0.015em;
  text-anchor: middle;
`;

const Region = ({
  data,
  geography,
}: {
  data: ValuesType<LocalityDataMapping>;
  geography: GeographyProps["geography"];
}) => {
  const centroid = geoCentroid(geography);
  const { label, value } = data;
  const [hoverRegion, setHoverRegion] = useState(false);

  const setHover = () => {
    setHoverRegion(true);
  };

  const clearHover = () => {
    setHoverRegion(false);
  };

  return (
    <RegionGroup
      onBlur={clearHover}
      onMouseOut={clearHover}
      onFocus={setHover}
      onMouseOver={setHover}
      tabIndex={0}
      role="img"
      aria-label={`${label} value ${value}`}
    >
      {/*
        using spring renderprops instead of hook because react-simple-maps
        components are not compatible with the `animated` wrapper
      */}
      <Spring
        from={{
          fill: colors.mapFill,
          textFill: colors.text,
        }}
        to={{
          fill: hoverRegion ? colors.mapFillHover : colors.mapFill,
          textFill: hoverRegion ? colors.accent : colors.text,
        }}
      >
        {(props) => (
          <>
            <RegionGeography
              key={`region_${geography.id}`}
              geography={geography}
              fill={props.fill}
              stroke={colors.mapStroke}
              strokeWidth={1.5}
              tabIndex={-1}
            />
            <RegionMarker key={`marker_${geography.id}`} coordinates={centroid}>
              <RegionLabel fill={props.textFill}>{value}</RegionLabel>
            </RegionMarker>
          </>
        )}
      </Spring>
    </RegionGroup>
  );
};
