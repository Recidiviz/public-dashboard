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

import {
  Modal as ModalBase,
  ModalHeading as ModalHeadingBase,
  ModalProps,
} from "@recidiviz/design-system";
import { rem } from "polished";
import React from "react";
import styled from "styled-components/macro";
import { Omit, Required } from "utility-types";
import iconPath from "../assets/x.svg";
import animation from "./animation";

export const ModalHeading = styled(ModalHeadingBase)`
  margin-bottom: ${rem(16)};
`;

const CloseButton = styled.button.attrs({ type: "button" })`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${rem(16)};
  position: absolute;
  right: 0;
  top: 0;
`;
const CloseIcon = styled.img`
  height: ${rem(12)};
  width: ${rem(12)};
`;

export type SpotlightModalProps = Omit<
  Required<ModalProps, "onRequestClose">,
  "closeTimeoutMs"
>;

export const Modal: React.FC<SpotlightModalProps> = ({
  children,
  onRequestClose,
  ...passThruProps
}) => {
  return (
    <ModalBase
      {...passThruProps}
      closeTimeoutMS={animation.defaultDuration}
      onRequestClose={onRequestClose}
    >
      <>
        <CloseButton onClick={(e) => onRequestClose(e)}>
          <CloseIcon alt="close modal" src={iconPath} />
        </CloseButton>
        {children}
      </>
    </ModalBase>
  );
};
