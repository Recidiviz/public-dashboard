// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { typography } from "@recidiviz/design-system";
import React from "react";
import { createGlobalStyle } from "styled-components/macro";
import reset from "styled-reset";
import { colors } from "../UiLibrary";

const BaseStyles = createGlobalStyle`
  ${reset}

  html {
    ${typography.Sans16}

    box-sizing: border-box;
    

    *, *:before, *:after {
      box-sizing: inherit;
      font-family: inherit;
    }
  }

  body {
    background-color: ${colors.background};
    color: ${colors.text};
  }
`;

const GlobalStyles: React.FC = () => {
  return (
    <>
      <BaseStyles />
    </>
  );
};

export default GlobalStyles;
