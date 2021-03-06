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

import styled from "styled-components/macro";
import { colors } from "../UiLibrary";

export default styled.div`
  /* classes provided by Semiotic */
  .frame {
    .axis-baseline {
      stroke: ${colors.chartAxis};
    }

    .axis-label,
    .ordinal-labels {
      fill: ${colors.caption};
      font-size: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .axis-title {
      fill: ${colors.caption};
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .background-graphics,
    .visualization-layer {
      shape-rendering: crispEdges;
    }

    .frame-title {
      fill: ${colors.text};
      font-size: 16px;
    }

    .tick-line {
      stroke: ${colors.chartGridLine};
    }

    .xyframe-matte {
      fill: ${colors.background};
    }

    .xybrush {
      .selection {
        fill: ${colors.timeWindowFill};
        fill-opacity: 0.2;
        stroke: ${colors.timeWindowStroke};
      }
    }
  }
`;
