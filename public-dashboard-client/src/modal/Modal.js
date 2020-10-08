import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ModalDialog from "./ModalDialog";

const ModalWrapper = styled.div``;
const TriggerWrapper = styled.div``;

export default function Modal(props) {
  const { trigger, open, setOpen, height, width, children } = props;

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <ModalWrapper>
      <TriggerWrapper onClick={() => setOpen(true)}>{trigger}</TriggerWrapper>
      <ModalDialog
        open={open}
        closeModal={closeModal}
        height={height}
        width={width}
      >
        {children}
      </ModalDialog>
    </ModalWrapper>
  );
}

Modal.propTypes = {
  trigger: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Modal.defaultProps = {
  height: "auto",
  width: "65vw",
};
