import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { HeadingDescription, HeadingTitle } from "../heading";
import { LinkPill } from "../pill";
import Modal from "../modal";

const DownloadDataWrapper = styled.div``;
const DownloadDataHeader = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;
const DownloadDataHeading = styled(HeadingTitle)`
  font-size: 20px;
`;

const DownloadDataDescription = styled(HeadingDescription)`
  font-size: 16px;
`;

const DownloadDataBody = styled.div``;
const DownloadDataRow = styled.div`
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  display: flex;
  justify-content: space-between;
  padding: 32px 0 32px 0;
`;

const DownloadDataFilename = styled(DownloadDataHeading)`
  margin: 0;
`;

export default function DownloadDataModal({ trigger }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Modal trigger={trigger} open={modalOpen} setOpen={setModalOpen}>
      <DownloadDataWrapper>
        <DownloadDataHeader>
          <DownloadDataHeading>Download data</DownloadDataHeading>
          <DownloadDataDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
            nunc lacus diam varius varius enim risus. Sagittis, in risus sed sit
            elementum volutpat amet turpis nisi.
          </DownloadDataDescription>
        </DownloadDataHeader>
        <DownloadDataBody>
          <DownloadDataRow>
            <DownloadDataFilename>All-Data.zip</DownloadDataFilename>
            <LinkPill href="#">Download</LinkPill>
          </DownloadDataRow>
          <DownloadDataRow>
            <DownloadDataFilename>Sentencing.csv</DownloadDataFilename>
            <LinkPill href="#">Download</LinkPill>
          </DownloadDataRow>
          <DownloadDataRow>
            <DownloadDataFilename>Label</DownloadDataFilename>
            <LinkPill href="#">Download</LinkPill>
          </DownloadDataRow>
          <DownloadDataRow>
            <DownloadDataFilename>Label</DownloadDataFilename>
            <LinkPill href="#">Download</LinkPill>
          </DownloadDataRow>
          <DownloadDataRow>
            <DownloadDataFilename>Label</DownloadDataFilename>
            <LinkPill href="#">Download</LinkPill>
          </DownloadDataRow>
        </DownloadDataBody>
      </DownloadDataWrapper>
    </Modal>
  );
}

DownloadDataModal.propTypes = {
  trigger: PropTypes.node.isRequired,
};
