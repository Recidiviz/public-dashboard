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

import assertNever from "assert-never";
import React from "react";
import { InfoPanelState } from "./types";

type InfoPanelAction =
  | {
      type: "update";
      payload: Partial<InfoPanelState>;
    }
  | { type: "clear" };

type InfoPanelDispatch = (action: InfoPanelAction) => void;

const InfoPanelStateContext = React.createContext<InfoPanelState | undefined>(
  undefined
);
const InfoPanelDispatchContext = React.createContext<
  InfoPanelDispatch | undefined
>(undefined);

function infoPanelReducer(
  state: InfoPanelState,
  action: InfoPanelAction
): InfoPanelState {
  switch (action.type) {
    case "update": {
      return { ...state, ...action.payload };
    }
    case "clear": {
      return {};
    }
    default: {
      assertNever(action);
    }
  }
}

export const InfoPanelProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(infoPanelReducer, {});
  return (
    <InfoPanelStateContext.Provider value={state}>
      <InfoPanelDispatchContext.Provider value={dispatch}>
        {children}
      </InfoPanelDispatchContext.Provider>
    </InfoPanelStateContext.Provider>
  );
};

export function useInfoPanelState(): InfoPanelState {
  const context = React.useContext(InfoPanelStateContext);
  if (context === undefined) {
    throw new Error(
      "useInfoPanelState must be used within an InfoPanelProvider"
    );
  }
  return context;
}

export function useInfoPanelDispatch(): InfoPanelDispatch {
  const context = React.useContext(InfoPanelDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useInfoPanelDispatch must be used within an InfoPanelProvider"
    );
  }
  return context;
}
