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

import fs from "fs";
import path from "path";
import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components/macro";
import { THEME } from "./theme";
import { InfoPanelProvider } from "./info-panel";

// eslint-disable-next-line react/prop-types
const GlobalWrapper = ({ children }) => {
  // include globally expected Context providers or other required wrappers here
  return (
    <ThemeProvider theme={THEME}>
      <InfoPanelProvider>{children}</InfoPanelProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: GlobalWrapper, ...options });

// re-export everything from testing-library
export * from "@testing-library/react";

// override render method
export { customRender as render };

// provide original render method as a fallback if needed
export { render as renderUnwrapped };

// retrieve a data fixture from spotlight-api
export function getDataFixture(filename) {
  const filePath = path.resolve(
    __dirname,
    `../../spotlight-api/core/demo_data/${filename}`
  );
  const stringContents = fs.readFileSync(filePath).toString();

  // copypasta from spotlight-api/core/metricsApi for transforming JSONLines
  if (!stringContents || stringContents.length === 0) {
    return null;
  }
  const jsonObject = [];
  const splitStrings = stringContents.split("\n");
  splitStrings.forEach((line) => {
    if (line) {
      jsonObject.push(JSON.parse(line));
    }
  });

  return jsonObject;
}
