import React, { useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import useBreakpoint from "@w11r/use-breakpoint";

import CloseModalSrc from "../assets/icons/closeModal.svg";

const BackgroundAside = styled.aside`
  align-items: center;
  background-color: ${(props) => props.theme.colors.asideBackground};
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.modal};
`;

const ModalDialogWrapper = styled.div`
  align-self: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height};
  max-height: 90vh;
  max-width: 90wh;
  overflow-y: auto;
  padding: ${(props) => props.padding}px;
  position: relative;
  width: ${(props) => props.width};
`;

const CloseButtonImg = styled.img`
  cursor: pointer;
  height: 20px;
  position: absolute;
  right: ${(props) => props.position}px;
  top: ${(props) => props.position}px;
`;

const DEFAULT_PADDING = 64;

export default function ModalDialog(props) {
  const { open, closeModal, height, width, children } = props;
  const smallScreen = useBreakpoint(false, ["mobile-", true]);
  const PADDING = smallScreen ? DEFAULT_PADDING / 4 : DEFAULT_PADDING;
  // WARNING: On smaller screens we are explicitly setting the width of
  // the modal to 90% and otherwise ignorning any value that is passed
  // in. This could lead to confusing results in the case that a smaller
  // width modal is actually desired on smaller screens. Mostly this was
  // a hack to meet a launch deadline and some additional care should be
  // taken to make this more robust.
  const WIDTH = smallScreen ? "90%" : width;

  const ref = useRef(null);

  if (!open) return null;

  const isOutsideModal = (event, element) =>
    event.target instanceof HTMLElement &&
    element &&
    !element.contains(event.target);

  const handleOnClick = (event) => {
    event.stopPropagation();

    if (isOutsideModal(event, ref.current) && closeModal) {
      closeModal(event);
    }
  };

  return ReactDOM.createPortal(
    <BackgroundAside onClick={handleOnClick}>
      <ModalDialogWrapper
        ref={ref}
        height={height}
        width={WIDTH}
        padding={PADDING}
      >
        {closeModal && (
          <CloseButtonImg
            onClick={closeModal}
            src={CloseModalSrc}
            alt="close button"
            role="button"
            position={PADDING}
          />
        )}
        {children}
      </ModalDialogWrapper>
    </BackgroundAside>,
    document.getElementById("root")
  );
}

ModalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
