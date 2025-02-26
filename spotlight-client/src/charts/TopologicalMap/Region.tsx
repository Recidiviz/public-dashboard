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

import { geoCentroid } from "d3-geo";
import React, { useState } from "react";
import { Geography, GeographyProps, Marker } from "react-simple-maps";
import { Spring } from "react-spring/renderprops.cjs";
import styled from "styled-components/macro";
import { ValuesType } from "utility-types";
import { LocalityDataMapping } from "../../contentModels/types";
import { colors } from "../../UiLibrary";

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
  text-anchor: middle;
`;

const Region = ({
  data,
  geography,
}: {
  data: ValuesType<LocalityDataMapping>;
  geography: GeographyProps["geography"];
}): React.ReactElement => {
  const centroid = geoCentroid(geography);
  const { label, value } = data || {};
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

export default Region;
