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

import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import styled from "styled-components/macro";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import {
  CopyBlock,
  Modal,
  ModalHeading,
  SpotlightModalProps,
} from "../UiLibrary";

const ShareActions = styled.div``;

const UrlText = styled.div``;

const ShareButtons = styled.div``;

const IncludeSectionLabel = styled.label``;

const ShareModal = (
  props: Omit<SpotlightModalProps, "children">
): JSX.Element => {
  const {
    tenantStore: {
      currentTenantId,
      currentNarrativeTypeId,
      currentSectionNumber,
    },
  } = useDataStore();
  const [includeSection, setIncludeSection] = useState(false);

  let urlToShare = window.location.host;

  if (currentTenantId) {
    if (currentNarrativeTypeId) {
      urlToShare += getUrlForResource({
        page: "narrative",
        params: {
          tenantId: currentTenantId,
          narrativeTypeId: currentNarrativeTypeId,
          sectionNumber: includeSection ? currentSectionNumber : undefined,
        },
      });
    } else {
      urlToShare += getUrlForResource({
        page: "tenant",
        params: { tenantId: currentTenantId },
      });
    }
  }

  return (
    <Modal {...props}>
      <ModalHeading>Share</ModalHeading>
      <CopyBlock>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
        nunc lacus diam varius varius enim risus. Sagittis, in risus sed sit
        elementum volutpat amet turpis nisi.
      </CopyBlock>
      <ShareActions>
        <UrlText>{urlToShare}</UrlText>
        <ShareButtons>buttons</ShareButtons>
      </ShareActions>
      <>
        {currentNarrativeTypeId && (
          <IncludeSectionLabel>
            <input
              type="checkbox"
              checked={includeSection}
              onChange={(e) => {
                setIncludeSection(e.target.checked);
              }}
            />{" "}
            label text
          </IncludeSectionLabel>
        )}
      </>
    </Modal>
  );
};

export default observer(ShareModal);
