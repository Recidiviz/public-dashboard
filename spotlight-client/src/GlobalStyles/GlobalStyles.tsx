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

import React from "react";
import { Helmet } from "react-helmet-async";
import { createGlobalStyle } from "styled-components/macro";
import reset from "styled-reset";
import { colors, typefaces } from "../UiLibrary";

const BaseStyles = createGlobalStyle`
  ${reset}

  html {
    box-sizing: border-box;

    * {
      font-family: ${typefaces.body};
    }

    *, *:before, *:after {
      box-sizing: inherit;
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
      <Helmet>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <BaseStyles />
    </>
  );
};

export default GlobalStyles;
