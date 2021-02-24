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
import styled from "styled-components/macro";
import { ReactComponent as MenuOpenIcon } from "../assets/menu-open.svg";
import colors from "./colors";
import zIndex from "./zIndex";

const Wrapper = styled.div`
  align-items: flex-end;
  background: ${colors.tooltipBackground};
  border-radius: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  left: 0;
  padding-top: 8px;
  position: fixed;
  right: 0;
  z-index: ${zIndex.modal};
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

const Overlay = styled.div`
  bottom: 0;
  left: 0%;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${zIndex.modal};
`;

type FixedBottomPanelProps = {
  className?: string;
  closePanel: React.MouseEventHandler;
  isOpen: boolean;
  top?: string | number;
};

const ICON_SIZE = 16;

const FixedBottomPanel: React.FC<FixedBottomPanelProps> = ({
  children,
  className,
  closePanel,
  isOpen,
  top,
}) => {
  return (
    <>
      {isOpen && <Overlay onClick={closePanel} />}
      <Wrapper className={className} style={{ top }}>
        <CloseButton onClick={closePanel}>
          <MenuOpenIcon width={ICON_SIZE} height={ICON_SIZE} />
        </CloseButton>
        {children}
      </Wrapper>
    </>
  );
};

export default FixedBottomPanel;
