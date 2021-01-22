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

import useBreakpoint from "@w11r/use-breakpoint";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/macro";
import { ReactComponent as MenuOpenIcon } from "../assets/menu-open.svg";
import { useDataStore } from "../StoreProvider";
import { colors, zIndex } from "../UiLibrary";

const InfoPanelWrapper = styled.div`
  background: ${colors.tooltipBackground};
  border-radius: 0;
  bottom: 0;
  left: 0;
  padding-top: 8px;
  position: fixed;
  right: 0;
  z-index: ${zIndex.modal};
`;

const InfoPanelOverlay = styled.div`
  background: ${colors.tooltipBackground};
  bottom: 0;
  left: 0%;
  opacity: 0.1;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${zIndex.modal};
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-right: 24px;

  rect {
    fill: ${colors.textLight} !important;
  }
`;

const ICON_SIZE = 16;

const InfoPanel = (): React.ReactElement | null => {
  const enabled = useBreakpoint(false, ["mobile-", true]);
  const { uiStore } = useDataStore();
  const { infoPanelData, renderInfoPanel, clearInfoPanel } = uiStore;

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearInfoPanel();
  };

  if (enabled && infoPanelData && renderInfoPanel) {
    return (
      <>
        <InfoPanelOverlay onClick={dismiss} />
        <InfoPanelWrapper className="InfoPanel">
          <CloseButtonWrapper>
            <CloseButton onClick={dismiss}>
              <MenuOpenIcon width={ICON_SIZE} height={ICON_SIZE} />
            </CloseButton>
          </CloseButtonWrapper>
          {renderInfoPanel(infoPanelData)}
        </InfoPanelWrapper>
      </>
    );
  }
  return null;
};

export default observer(InfoPanel);
