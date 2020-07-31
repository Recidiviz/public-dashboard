import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { HeadingDescription, HeadingTitle } from "../heading";
import Modal from "../modal";

const MethodologyWrapper = styled.div``;
const MethodologyHeader = styled.div`
  margin-bottom: 48px;
`;
const MethodologyHeading = styled(HeadingTitle)``;

const MethodologyDescription = styled(HeadingDescription)`
  font-size: 16px;
`;

const MethodologyBody = styled.div``;

const SectionTitle = styled.h1`
  color: ${(props) => props.theme.colors.heading};
  font: ${(props) => props.theme.fonts.display};
  font-size: 20px;
  margin-bottom: 16px;
`;

export default function MethodologyModal({ trigger }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Modal trigger={trigger} open={modalOpen} setOpen={setModalOpen}>
      <MethodologyWrapper>
        <MethodologyHeader>
          <MethodologyHeading>Methodology</MethodologyHeading>
          <MethodologyDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
            nunc lacus diam varius varius enim risus. Sagittis, in risus sed sit
            elementum volutpat amet turpis nisi.
          </MethodologyDescription>
        </MethodologyHeader>
        <MethodologyBody>
          <SectionTitle>Header</SectionTitle>
          <MethodologyDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
            nunc lacus diam varius varius enim risus. Sagittis, in risus sed sit
            elementum volutpat amet turpis nisi.
          </MethodologyDescription>
          <SectionTitle>Header</SectionTitle>
          <MethodologyDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
            nunc lacus diam varius varius enim risus. Sagittis, in risus sed sit
            elementum volutpat amet turpis nisi.
          </MethodologyDescription>
          <SectionTitle>Header</SectionTitle>
          <MethodologyDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
            nunc lacus diam varius varius enim risus. Sagittis, in risus sed sit
            elementum volutpat amet turpis nisi.
          </MethodologyDescription>
        </MethodologyBody>
      </MethodologyWrapper>
    </Modal>
  );
}

MethodologyModal.propTypes = {
  trigger: PropTypes.node.isRequired,
};
