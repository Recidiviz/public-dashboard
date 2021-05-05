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
import { rem } from "polished";
import React, { useState } from "react";
import styled from "styled-components/macro";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import {
  Checkbox,
  colors,
  Modal,
  ModalHeading,
  SpotlightModalProps,
  typefaces,
} from "../UiLibrary";

const ShareActions = styled.div`
  border-color: ${colors.rule};
  border-style: solid;
  border-width: 1px 0;
  margin: ${rem(24)} 0;
  padding: ${rem(24)} 0;
`;

const UrlText = styled.div`
  font-family: ${typefaces.display};
  font-size: ${rem(21)};
  letter-spacing: -0.04em;
  overflow: auto;
  padding-bottom: ${rem(16)};
  white-space: nowrap;
`;

const ShareButtons = styled.div``;

const IncludeSectionLabel = styled.label`
  align-items: baseline;
  display: flex;
  font-size: ${rem(14)};
  line-height: 1.4;
`;

const SectionTitle = styled.span`
  color: ${colors.link};
`;

const ShareModal = (
  props: Omit<SpotlightModalProps, "children">
): JSX.Element => {
  const {
    tenantStore: {
      currentTenantId,
      currentNarrative,
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
      <ShareActions>
        <UrlText>{urlToShare}</UrlText>
        <ShareButtons>buttons</ShareButtons>
      </ShareActions>
      <>
        {currentSectionNumber && currentSectionNumber > 1 && (
          <IncludeSectionLabel>
            <Checkbox
              checked={includeSection}
              onChange={(e) => {
                setIncludeSection(e.target.checked);
              }}
            />
            <span>
              Link to current section:{" "}
              <SectionTitle>
                {currentNarrative?.sections[currentSectionNumber - 2].title}
              </SectionTitle>
            </span>
          </IncludeSectionLabel>
        )}
      </>
    </Modal>
  );
};

export default observer(ShareModal);
