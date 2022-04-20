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

import { AVAILABLE_FONTS } from "@recidiviz/design-system";
import React, { useContext } from "react";
import { ThemeProvider } from "styled-components/macro";
import DataStore from "../DataStore";

const StoreContext = React.createContext<typeof DataStore | undefined>(
  undefined
);

const StoreProvider: React.FC = ({ children }) => {
  return (
    <ThemeProvider
      theme={{
        fonts: {
          body: AVAILABLE_FONTS.LIBRE_FRANKLIN,
        },
      }}
    >
      <StoreContext.Provider value={DataStore}>
        {children}
      </StoreContext.Provider>
    </ThemeProvider>
  );
};

export default StoreProvider;

export function useDataStore(): typeof DataStore {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
