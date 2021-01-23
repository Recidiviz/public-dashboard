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
import Measure from "react-measure";

type MeasureWidthProps = {
  children: (props: {
    measureRef: (ref: Element | null) => void;
    width: number;
  }) => React.ReactElement;
};

/**
 * Renders a function that accepts a ref for an element to measure,
 * and the width of that element whenever it changes.
 * (Unlike with a bare instance of `react-measure`, width is guaranteed to be a number.
 */
const MeasureWidth: React.FC<MeasureWidthProps> = ({ children }) => {
  return (
    <Measure bounds>
      {({ measureRef, contentRect: { bounds } }) => {
        const width = bounds?.width || 0;
        return children({ measureRef, width });
      }}
    </Measure>
  );
};

export default MeasureWidth;
