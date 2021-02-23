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

import React from "react";
import styled from "styled-components/macro";

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

export default RatioContainer;
