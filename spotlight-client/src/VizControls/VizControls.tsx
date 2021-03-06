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

import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React, { useState } from "react";
import styled from "styled-components/macro";
import downloadPath from "../assets/cloud-download.svg";
import machineLearningPath from "../assets/machine-learning.svg";
import { colors, CopyBlock, Modal, ModalHeading, zIndex } from "../UiLibrary";

const Wrapper = styled.div`
  background: ${colors.background};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  z-index: ${zIndex.control};
`;

const ControlsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${rem(16)};
  padding-bottom: ${rem(16)};
`;

const FilterWrapper = styled.div`
  margin: 0 ${rem(16)};

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${colors.link};
  cursor: pointer;
  font-size: ${rem(14)};
  font-weight: 500;
  padding: none;
`;

const ButtonIcon = styled.img`
  height: ${rem(16)};
  /* icon needs minor adjustment to align with text */
  margin-bottom: ${rem(-2)};
  width: ${rem(16)};
`;

const MethodologyCopy = styled(CopyBlock)`
  line-height: 1.7;
  margin-top: ${rem(16)};
`;

export interface VizControlsProps {
  filters: (React.ReactElement | null)[];
  download: () => void;
  methodology: string;
}

const VizControls = ({
  download,
  filters,
  methodology,
}: VizControlsProps): React.ReactElement => {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <Wrapper>
      <ControlsGroup>
        {filters.map(
          (filter, index) =>
            // there's nothing else to use as a key, but these should be pretty static
            // so there isn't any real performance concern
            // eslint-disable-next-line react/no-array-index-key
            filter && <FilterWrapper key={index}>{filter}</FilterWrapper>
        )}
      </ControlsGroup>
      <ControlsGroup>
        <Button onClick={() => download()}>
          <ButtonIcon src={downloadPath} /> Download Data
        </Button>
        <Button onClick={() => setShowMethodology(true)}>
          <ButtonIcon src={machineLearningPath} /> Methodology
        </Button>
        <Modal
          isOpen={showMethodology}
          onRequestClose={() => setShowMethodology(false)}
        >
          <ModalHeading>Methodology</ModalHeading>
          <MethodologyCopy>{HTMLReactParser(methodology)}</MethodologyCopy>
        </Modal>
      </ControlsGroup>
    </Wrapper>
  );
};

export default VizControls;
