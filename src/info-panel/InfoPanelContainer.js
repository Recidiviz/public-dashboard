import React from "react";
import InfoPanel from "./InfoPanel";
import { useInfoPanelState } from "./InfoPanelContext";

export default function InfoPanelContainer() {
  const state = useInfoPanelState();
  return <InfoPanel {...state} />;
}
