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

import { geoAlbers } from "d3-geo";
import React from "react";
import { ComposableMap, Geographies } from "react-simple-maps";
import styled from "styled-components/macro";
import { mesh } from "topojson";
import type { Topology } from "topojson-specification";
import { LocalityDataMapping } from "../../contentModels/types";
import MeasureWidth from "../../MeasureWidth";
import RatioContainer from "./RatioContainer";
import Region from "./Region";

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
