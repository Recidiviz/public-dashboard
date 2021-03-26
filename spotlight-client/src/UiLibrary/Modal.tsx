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
  ModalProps,
} from "@recidiviz/case-triage-components";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { rem, rgba } from "polished";
import React, { useRef } from "react";
import styled from "styled-components/macro";
import { Omit, Required } from "utility-types";
import iconPath from "../assets/x.svg";
import { colors } from ".";
import animation from "./animation";
import zIndex from "./zIndex";

export const StyledModal = styled(ModalBase)`
  /*
    the double ampersands are a trick to overcome
    specificity in the imported component styles
  */
  && .ReactModal__Overlay {
    background: ${rgba(colors.modalOverlay, 0)};
    transition: background-color ${animation.defaultDuration}ms,
      backdrop-filter ${animation.defaultDuration}ms;
    z-index: ${zIndex.modal};

    &.ReactModal__Overlay--after-open {
      /* not all browsers support backdrop-filter but it's a nice progressive enhancement */
      backdrop-filter: blur(${rem(4)});
      background: ${rgba(colors.modalOverlay, 0.7)};
    }

    &.ReactModal__Overlay--before-close {
      backdrop-filter: none;
      background: ${rgba(colors.modalOverlay, 0)};
    }
  }

  && .ReactModal__Content {
    max-height: 90vh;
    max-width: 90vw;
    overflow: auto;
    z-index: ${zIndex.modal + 1};
  }
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

type SpotlightModalProps = Omit<
  Required<ModalProps, "onRequestClose">,
  "closeTimeoutMs"
>;

export const Modal: React.FC<SpotlightModalProps> = ({
  children,
  onAfterOpen,
  onRequestClose,
  ...passThruProps
}) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const onRequestCloseWithScrollLock: ModalProps["onRequestClose"] = (e) => {
    if (modalContentRef.current) {
      enableBodyScroll(modalContentRef.current);
    }
    onRequestClose(e);
  };

  return (
    <StyledModal
      {...passThruProps}
      closeTimeoutMS={animation.defaultDuration}
      contentRef={(node) => {
        modalContentRef.current = node;
      }}
      onAfterOpen={(opts) => {
        if (modalContentRef.current) {
          disableBodyScroll(modalContentRef.current);
        }
        if (onAfterOpen) {
          onAfterOpen(opts);
        }
      }}
      onRequestClose={onRequestCloseWithScrollLock}
    >
      <>
        <CloseButton onClick={(e) => onRequestCloseWithScrollLock(e)}>
          <CloseIcon alt="close modal" src={iconPath} />
        </CloseButton>
        {children}
      </>
    </StyledModal>
  );
};

export { ModalHeading } from "@recidiviz/case-triage-components";
