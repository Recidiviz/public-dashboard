import PropTypes from "prop-types";
import React from "react";

const InfoPanelStateContext = React.createContext();
const InfoPanelDispatchContext = React.createContext();

function infoPanelReducer(state, action) {
  switch (action.type) {
    case "update": {
      return { ...state, ...action.payload };
    }
    case "clear": {
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function InfoPanelProvider({ children }) {
  const [state, dispatch] = React.useReducer(infoPanelReducer, {});
  return (
    <InfoPanelStateContext.Provider value={state}>
      <InfoPanelDispatchContext.Provider value={dispatch}>
        {children}
      </InfoPanelDispatchContext.Provider>
    </InfoPanelStateContext.Provider>
  );
}

InfoPanelProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useInfoPanelState() {
  const context = React.useContext(InfoPanelStateContext);
  if (context === undefined) {
    throw new Error(
      "useInfoPanelState must be used within an InfoPanelProvider"
    );
  }
  return context;
}

export function useInfoPanelDispatch() {
  const context = React.useContext(InfoPanelDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useInfoPanelDispatch must be used within an InfoPanelProvider"
    );
  }
  return context;
}
