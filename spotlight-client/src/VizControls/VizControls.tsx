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
  TooltipTrigger,
  Icon,
  IconSVG,
  typography,
} from "@recidiviz/design-system";
import HTMLReactParser from "html-react-parser";
import { rem } from "polished";
import React, { useState } from "react";
import styled from "styled-components/macro";
import downloadPath from "../assets/cloud-download.svg";
import machineLearningPath from "../assets/machine-learning.svg";
import { useDataStore } from "../StoreProvider";
import { colors, CopyBlock, Modal, ModalHeading, zIndex } from "../UiLibrary";

const Wrapper = styled.div`
  background: ${colors.background};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  z-index: ${zIndex.control};
  margin-bottom: ${rem(32)};
`;

const ControlsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterWrapper = styled.div`
  margin-right: ${rem(32)};

  &:last-child {
    margin-right: 0;
  }

  &:empty {
    margin-right: 0;
  }
`;

const Button = styled.button`
  ${typography.Sans14}
  background: none;
  border: none;
  color: ${colors.link};
  cursor: pointer;
  margin-bottom: ${rem(16)};
  padding: none;
`;

const ButtonIcon = styled.img`
  height: ${rem(16)};
  /* icon needs minor adjustment to align with text */
  margin-bottom: ${rem(-2)};
  width: ${rem(16)};
`;

const MethodologyCopy = styled(CopyBlock)``;

export interface VizControlsProps {
  filters: React.ReactNode[];
  download: () => void;
  methodology: string;
  smallData?: boolean;
}

const VizControls = ({
  download,
  filters,
  methodology,
  smallData,
}: VizControlsProps): React.ReactElement => {
  const [showMethodology, setShowMethodology] = useState(false);
  const { tenant } = useDataStore();

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
        {smallData && (
          <TooltipTrigger maxWidth={232} contents={tenant?.smallDataDisclaimer}>
            <Icon kind={IconSVG.Info} width={16} height={16} />
          </TooltipTrigger>
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
